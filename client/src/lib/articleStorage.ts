/**
 * Article Storage — merges hardcoded sample articles with localStorage-managed articles.
 * Admin-added articles are stored in localStorage under key "khalifa_articles".
 * The public site reads from getAllArticles() which combines both sources.
 */
import { articles as hardcodedArticles, categories as defaultCategories, type Article } from "@/data/articles";

const STORAGE_KEY = "khalifa_articles";
const AUTH_KEY = "khalifa_admin_auth";
const ADMIN_PASSWORD = "Khalifa@2025";

export interface StoredArticle extends Article {
  newspaper?: string; // اسم الصحيفة أو المجلة
  isHardcoded?: boolean; // flag to identify sample articles
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function isAdminAuthenticated(): boolean {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return false;
    const { expiry } = JSON.parse(session);
    return Date.now() < expiry;
  } catch {
    return false;
  }
}

export function adminLogin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    // Session valid for 24 hours
    localStorage.setItem(AUTH_KEY, JSON.stringify({ expiry: Date.now() + 24 * 60 * 60 * 1000 }));
    return true;
  }
  return false;
}

export function adminLogout(): void {
  localStorage.removeItem(AUTH_KEY);
}

// ─── Article CRUD ────────────────────────────────────────────────────────────

/** Read admin-managed articles from localStorage */
export function getStoredArticles(): StoredArticle[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredArticle[];
  } catch {
    return [];
  }
}

/** Save admin-managed articles to localStorage */
export function saveStoredArticles(articles: StoredArticle[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

/** Add a new article */
export function addArticle(article: StoredArticle): void {
  const existing = getStoredArticles();
  existing.unshift(article); // newest first
  saveStoredArticles(existing);
}

/** Update an existing article by id */
export function updateArticle(id: string, updates: Partial<StoredArticle>): void {
  const existing = getStoredArticles();
  const idx = existing.findIndex((a) => a.id === id);
  if (idx !== -1) {
    existing[idx] = { ...existing[idx], ...updates };
    saveStoredArticles(existing);
  }
}

/** Delete an article by id */
export function deleteArticle(id: string): void {
  const existing = getStoredArticles();
  saveStoredArticles(existing.filter((a) => a.id !== id));
}

/** Get all articles: admin-stored first (newest), then hardcoded samples */
export function getAllArticles(): StoredArticle[] {
  const stored = getStoredArticles();
  const hardcodedWithFlag: StoredArticle[] = hardcodedArticles.map((a) => ({
    ...a,
    newspaper: "",
    isHardcoded: true,
  }));
  return [...stored, ...hardcodedWithFlag];
}

/** Get unique years from all articles */
export function getAllYears(articles: StoredArticle[]): number[] {
  return Array.from(new Set(articles.map((a) => a.year))).sort((a, b) => b - a);
}

/** Get all categories including any new ones from stored articles */
export function getAllCategories(): string[] {
  const stored = getStoredArticles();
  const storedCats = stored.map((a) => a.category).filter(Boolean);
  const allCats = new Set([...defaultCategories, ...storedCats]);
  return Array.from(allCats);
}

/** Generate a unique ID for new articles */
export function generateId(): string {
  return `admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
