-- Khalifa Website Articles Database Schema
-- Run this in the Cloudflare D1 console to create the articles table

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'رأي',
  newspaper TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- NOTE: If you created the table before April 2026, the 'year' column may not exist.
-- Run this to add it (safe to run even if it already exists in newer SQLite versions):
-- ALTER TABLE articles ADD COLUMN year INTEGER;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date DESC);
