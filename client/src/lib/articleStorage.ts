/**
 * Article Storage — API-based article management via Cloudflare D1.
 * Admin auth uses localStorage for session persistence.
 * Articles are fetched from /api/articles (Cloudflare Pages Functions + D1).
 * Falls back to hardcoded articles if API is unavailable.
 */
import { articles as hardcodedArticles, categories as defaultCategories, type Article } from "@/data/articles";

const AUTH_KEY = "khalifa_admin_auth";

export interface StoredArticle extends Article {
  newspaper?: string;
  isHardcoded?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function isAdminAuthenticated(): boolean {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return false;
    const { expiry, token } = JSON.parse(session);
    return Date.now() < expiry && !!token;
  } catch {
    return false;
  }
}

export function getAuthToken(): string | null {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return null;
    const { expiry, token } = JSON.parse(session);
    if (Date.now() >= expiry) return null;
    return token;
  } catch {
    return null;
  }
}

export async function adminLogin(password: string): Promise<boolean> {
  try {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ expiry: Date.now() + 24 * 60 * 60 * 1000, token: data.token })
      );
      return true;
    }
    return false;
  } catch {
    // Fallback: if API is not available (local dev), use direct password check
    if (password === "Khalifa@2025") {
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ expiry: Date.now() + 24 * 60 * 60 * 1000, token: password })
      );
      return true;
    }
    return false;
  }
}

export function adminLogout(): void {
  localStorage.removeItem(AUTH_KEY);
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

async function apiRequest(url: string, options: RequestInit = {}): Promise<any> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  return res.json();
}

// ─── Article CRUD (API-based) ────────────────────────────────────────────────

/** Fetch all articles from the API */
export async function fetchArticles(): Promise<StoredArticle[]> {
  try {
    const data = await apiRequest("/api/articles");
    if (data.success && Array.isArray(data.articles)) {
      return data.articles.map((a: any) => ({
        ...a,
        newspaper: a.newspaper || "",
        isHardcoded: false,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

/** Fetch all articles, falling back to hardcoded if API fails */
export async function fetchAllArticles(): Promise<StoredArticle[]> {
  try {
    const apiArticles = await fetchArticles();
    if (apiArticles.length > 0) {
      return apiArticles;
    }
    // If API returns empty, return hardcoded as fallback
    return getHardcodedArticles();
  } catch {
    return getHardcodedArticles();
  }
}

/** Get hardcoded articles (for fallback) */
export function getHardcodedArticles(): StoredArticle[] {
  return hardcodedArticles.map((a) => ({
    ...a,
    newspaper: "",
    isHardcoded: true,
  }));
}

/** Add a new article via API */
export async function addArticle(article: StoredArticle): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await apiRequest("/api/articles", {
      method: "POST",
      body: JSON.stringify(article),
    });
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/** Update an existing article via API */
export async function updateArticle(
  id: string,
  updates: Partial<StoredArticle>
): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await apiRequest(`/api/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/** Delete an article via API */
export async function deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const data = await apiRequest(`/api/articles/${id}`, {
      method: "DELETE",
    });
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/** Seed the database with hardcoded articles */
export async function seedDatabase(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const data = await apiRequest("/api/seed", {
      method: "POST",
      body: JSON.stringify({ articles: hardcodedArticles }),
    });
    return data;
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/** Get all categories */
export function getAllCategories(): string[] {
  return [...defaultCategories];
}

/** Generate a unique ID for new articles */
export function generateId(): string {
  return `art_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
