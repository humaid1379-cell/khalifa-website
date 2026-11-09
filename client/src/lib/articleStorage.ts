/** Same-origin article API. Authentication stays in an HttpOnly cookie. */
import { categories as defaultCategories, type Article } from "@/data/articles";

export interface StoredArticle extends Article {
  newspaper?: string;
  created_at?: string;
  updated_at?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function clearLegacyCredentials() {
  try {
    localStorage.removeItem("khalifa_admin_auth");
  } catch {
    /* storage may be disabled */
  }
}

async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "same-origin",
      signal: controller.signal,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
    let data: any;
    try {
      data = await response.json();
    } catch {
      throw new ApiError(
        "الخدمة غير متاحة مؤقتاً. يرجى المحاولة مجدداً.",
        response.status || 503
      );
    }
    if (!response.ok || data.success !== true)
      throw new ApiError(
        data.error || "تعذّر إتمام الطلب. يرجى المحاولة مجدداً.",
        response.status
      );
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      "تعذّر الاتصال بالخادم. تحقق من الاتصال وحاول مجدداً.",
      0
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  clearLegacyCredentials();
  const data = await apiRequest("/api/auth");
  return data.authenticated === true;
}

export async function adminLogin(password: string): Promise<boolean> {
  clearLegacyCredentials();
  const data = await apiRequest("/api/auth", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
  return data.authenticated === true;
}

export async function adminLogout(): Promise<void> {
  await apiRequest("/api/auth", { method: "DELETE" });
  clearLegacyCredentials();
  invalidateArticlesCache();
}

let articlesCache: { data: StoredArticle[]; timestamp: number } | null = null;
let pendingArticles: Promise<StoredArticle[]> | null = null;
let cacheVersion = 0;
const CACHE_TTL = 30000;

export async function fetchArticles(): Promise<StoredArticle[]> {
  if (articlesCache && Date.now() - articlesCache.timestamp < CACHE_TTL)
    return articlesCache.data;
  if (pendingArticles) return pendingArticles;
  const version = cacheVersion;
  const request = apiRequest("/api/articles").then(data => {
    if (!Array.isArray(data.articles))
      throw new ApiError("استجابة المقالات غير صالحة.", 502);
    const articles: StoredArticle[] = data.articles;
    if (version === cacheVersion)
      articlesCache = { data: articles, timestamp: Date.now() };
    return articles;
  });
  pendingArticles = request;
  try {
    return await request;
  } finally {
    if (pendingArticles === request) pendingArticles = null;
  }
}

export function invalidateArticlesCache(): void {
  cacheVersion += 1;
  articlesCache = null;
  pendingArticles = null;
}

export const fetchAllArticles = fetchArticles;

export async function fetchArticle(id: string): Promise<StoredArticle | null> {
  try {
    return (await apiRequest(`/api/articles/${encodeURIComponent(id)}`))
      .article;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export interface MutationResult {
  success: boolean;
  error?: string;
  status?: number;
}
async function mutate(
  url: string,
  options: RequestInit
): Promise<MutationResult> {
  try {
    const result = await apiRequest(url, options);
    invalidateArticlesCache();
    return result;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "تعذّر حفظ التغيير.",
      status: error instanceof ApiError ? error.status : 0,
    };
  }
}

export function addArticle(article: StoredArticle): Promise<MutationResult> {
  return mutate("/api/articles", {
    method: "POST",
    body: JSON.stringify(article),
  });
}
export function updateArticle(
  id: string,
  updates: Partial<StoredArticle>
): Promise<MutationResult> {
  return mutate(`/api/articles/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}
export function deleteArticle(id: string): Promise<MutationResult> {
  return mutate(`/api/articles/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
export function getAllCategories(): string[] {
  return [...defaultCategories];
}
export function generateId(): string {
  return `art_${crypto.randomUUID()}`;
}
