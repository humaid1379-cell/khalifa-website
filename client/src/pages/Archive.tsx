/*
 * Design: Green Ink Press — Editorial newspaper style
 * Archive page: full searchable, filterable article archive
 * All articles from D1 database, sorted by date descending
 * Search, category filter, year filter, pagination
 */
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Calendar,
  Tag,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { fetchAllArticles, type StoredArticle } from "@/lib/articleStorage";
import { categories as defaultCategories } from "@/data/articles";
import { ArticleModal } from "@/components/ArticlesSection";
import { Link } from "wouter";

const ARTICLES_PER_PAGE = 9;

const PATTERN_BG =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/articles-pattern-P3uHDEeAuMjKEYia9gYeCW.webp";

export default function Archive() {
  const [allArticles, setAllArticles] = useState<StoredArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedYear, setSelectedYear] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<StoredArticle | null>(null);

  // Fetch articles from API on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const articles = await fetchAllArticles();
        if (!cancelled) {
          // Sort by date descending
          setAllArticles(
            [...articles].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          );
        }
      } catch {
        // handled inside fetchAllArticles
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedArticle]);

  const years = useMemo(
    () =>
      Array.from(new Set(allArticles.map((a) => a.year))).sort((a, b) => b - a),
    [allArticles]
  );

  const categories = useMemo(() => {
    const storedCats = allArticles.map((a) => a.category).filter(Boolean);
    return Array.from(new Set([...defaultCategories, ...storedCats]));
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      const matchesSearch =
        searchQuery === "" ||
        article.title.includes(searchQuery) ||
        article.excerpt.includes(searchQuery) ||
        article.content.includes(searchQuery);
      const matchesCategory =
        selectedCategory === "الكل" || article.category === selectedCategory;
      const matchesYear =
        selectedYear === "الكل" || article.year.toString() === selectedYear;
      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [searchQuery, selectedCategory, selectedYear, allArticles]);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const resetPage = () => setCurrentPage(1);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${PATTERN_BG})`,
        backgroundSize: "400px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="absolute inset-0 bg-[#f7f5f2]/85 pointer-events-none" />

      {/* Page Header */}
      <div className="relative z-10 bg-[#0d3b1f] text-white py-14 md:py-20">
        <div className="container">
          {/* Back link */}
          <Link href="/">
            <span className="inline-flex items-center gap-1.5 text-[#7cc89a] hover:text-white font-[Cairo] text-sm mb-6 cursor-pointer transition-colors">
              <ArrowRight size={16} />
              <span>العودة إلى الرئيسية</span>
            </span>
          </Link>

          <h1 className="font-[Amiri] text-4xl md:text-5xl font-bold mb-4">
            أرشيف المقالات
          </h1>
          <div
            className="w-16 h-0.5 mb-4"
            style={{ background: "#2e7d4a" }}
          />
          <p className="font-[Cairo] text-white/70 text-base max-w-xl leading-relaxed">
            جميع المقالات والآراء المنشورة — مرتبة من الأحدث إلى الأقدم
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container py-10 md:py-14">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-[#d4edda] mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7aa88e]"
              />
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  resetPage();
                }}
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] placeholder:text-[#7aa88e] focus:outline-none focus:border-[#2e7d4a] focus:ring-1 focus:ring-[#2e7d4a] transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[160px]">
              <Tag
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7aa88e] pointer-events-none"
              />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  resetPage();
                }}
                className="w-full pr-9 pl-4 py-2.5 rounded-lg border border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] focus:outline-none focus:border-[#2e7d4a] appearance-none cursor-pointer"
              >
                <option value="الكل">كل التصنيفات</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="relative min-w-[140px]">
              <Calendar
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7aa88e] pointer-events-none"
              />
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  resetPage();
                }}
                className="w-full pr-9 pl-4 py-2.5 rounded-lg border border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] focus:outline-none focus:border-[#2e7d4a] appearance-none cursor-pointer"
              >
                <option value="الكل">كل السنوات</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 font-[Tajawal] text-xs text-[#7aa88e]">
            {loading
              ? "جاري التحميل..."
              : `${filteredArticles.length} مقال`}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#2e7d4a]" />
            <span className="mr-3 font-[Cairo] text-[#4a6b5a]">
              جاري تحميل المقالات...
            </span>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && paginatedArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {paginatedArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="w-full text-right bg-white rounded-xl overflow-hidden shadow-sm border border-[#e8f0ec] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-1 bg-[#2e7d4a] group-hover:bg-[#1b6b3a] transition-colors" />
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-[Tajawal] text-xs bg-[#e8f5e9] text-[#1b6b3a] px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="font-[Tajawal] text-xs text-[#7aa88e]">
                      {formatDate(article.date)}
                    </span>
                  </div>
                  <h3 className="font-[Amiri] text-lg font-bold text-[#0d3b1f] mb-3 leading-relaxed group-hover:text-[#1b6b3a] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.newspaper && (
                    <p className="font-[Tajawal] text-xs text-[#7aa88e] mb-2">
                      {article.newspaper}
                    </p>
                  )}
                  <p className="font-[Cairo] text-sm text-[#4a6b5a] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 font-[Cairo] text-sm text-[#2e7d4a] group-hover:text-[#1b6b3a] flex items-center gap-1">
                    <span>اقرأ المزيد</span>
                    <ChevronLeft size={14} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && paginatedArticles.length === 0 && (
          <div className="text-center py-20">
            <p className="font-[Cairo] text-[#7aa88e] text-lg">
              {allArticles.length === 0
                ? "لا توجد مقالات في الأرشيف حتى الآن"
                : "لا توجد مقالات مطابقة لبحثك"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg border border-[#d4edda] bg-white flex items-center justify-center text-[#2e7d4a] hover:bg-[#e8f5e9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-[Tajawal] text-sm transition-colors ${
                  currentPage === page
                    ? "bg-[#2e7d4a] text-white shadow-md"
                    : "border border-[#d4edda] bg-white text-[#2e7d4a] hover:bg-[#e8f5e9]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border border-[#d4edda] bg-white flex items-center justify-center text-[#2e7d4a] hover:bg-[#e8f5e9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
