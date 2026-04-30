/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Archive page: full searchable, filterable article archive
 * All articles from D1 database, sorted by date descending
 *
 * Fixes applied:
 * - Filter inputs use solid borders (#12)
 * - Article cards centered when only 1-2 articles (#9)
 * - Back button arrow direction fixed for RTL (#10)
 * - All borders are solid, no dashed borders (#1)
 * - Pagination buttons use solid borders (#1)
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

export default function Archive() {
  const [allArticles, setAllArticles] = useState<StoredArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedYear, setSelectedYear] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<StoredArticle | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const articles = await fetchAllArticles();
        if (!cancelled) {
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
      Array.from(
        new Set(allArticles.map((a) => a.year ?? new Date(a.date).getFullYear()))
      ).sort((a, b) => b - a),
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
      const articleYear = (article.year ?? new Date(article.date).getFullYear()).toString();
      const matchesYear =
        selectedYear === "الكل" || articleYear === selectedYear;
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

  /* Determine grid classes based on article count for centering (#9) */
  const getGridClasses = () => {
    const count = paginatedArticles.length;
    if (count === 1) {
      return "flex justify-center mb-10";
    }
    if (count === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto";
    }
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10";
  };

  return (
    <div
      className="min-h-screen rosette-pattern"
      style={{ backgroundColor: '#f5f0e1' }}
    >
      <div className="absolute inset-0 bg-[#f5f0e1]/85 pointer-events-none" />

      {/* Page Header — teal */}
      <div className="relative z-10 bg-[#87b0b6] text-white py-14 md:py-20">
        <div className="container">
          {/* Back link — arrow direction fixed for RTL (#10) */}
          <Link href="/">
            <span className="inline-flex items-center gap-1.5 text-[#f5f0e1] hover:text-white font-[Amiri] text-sm mb-6 cursor-pointer transition-colors">
              <ArrowRight size={16} />
              <span>العودة إلى الرئيسية</span>
            </span>
          </Link>

          <h1 className="font-[Amiri] text-4xl md:text-5xl font-bold mb-4 text-[#f5f0e1]">
            أرشيف المقالات
          </h1>
          <div
            className="w-16 h-0.5 mb-4"
            style={{ background: "#f5f0e1" }}
          />
          <p className="font-[Amiri] text-white/80 text-base max-w-xl leading-relaxed">
            جميع المقالات والآراء المنشورة — مرتبة من الأحدث إلى الأقدم
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container py-10 md:py-14">
        {/* Search & Filters — solid borders (#12) */}
        <div className="bg-[#f5f0e1] rounded-xl p-4 md:p-6 shadow-sm border-2 border-[#87b0b6]/20 mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87b0b6]"
              />
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  resetPage();
                }}
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border-2 border-[#87b0b6]/25 bg-[#f5f0e1] font-[Amiri] text-sm text-[#455a5d] placeholder:text-[#455a5d] focus:outline-none focus:border-[#87b0b6] focus:ring-1 focus:ring-[#87b0b6] transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative min-w-[160px]">
              <Tag
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87b0b6] pointer-events-none"
              />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  resetPage();
                }}
                className="w-full pr-9 pl-4 py-2.5 rounded-lg border-2 border-[#87b0b6]/25 bg-[#f5f0e1] font-[Amiri] text-sm text-[#455a5d] focus:outline-none focus:border-[#87b0b6] appearance-none cursor-pointer"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#87b0b6] pointer-events-none"
              />
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  resetPage();
                }}
                className="w-full pr-9 pl-4 py-2.5 rounded-lg border-2 border-[#87b0b6]/25 bg-[#f5f0e1] font-[Amiri] text-sm text-[#455a5d] focus:outline-none focus:border-[#87b0b6] appearance-none cursor-pointer"
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
          <div className="mt-3 font-[Amiri] text-xs text-[#455a5d]">
            {loading
              ? "جاري التحميل..."
              : `${filteredArticles.length} مقال`}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#87b0b6]" />
            <span className="mr-3 font-[Amiri] text-[#455a5d]">
              جاري تحميل المقالات...
            </span>
          </div>
        )}

        {/* Articles Grid — centered when few articles (#9) */}
        {!loading && paginatedArticles.length > 0 && (
          <div className={getGridClasses()}>
            {paginatedArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className={`${paginatedArticles.length === 1 ? 'w-full max-w-md' : 'w-full'} text-right bg-[#f5f0e1] rounded-xl overflow-hidden shadow-sm border-2 border-[#87b0b6]/15 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="h-1 bg-[#87b0b6] group-hover:bg-[#87b0b6] transition-colors" />
                <div className="p-5 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-[Amiri] text-xs bg-[#87b0b6]/15 text-[#87b0b6] px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="font-[Amiri] text-xs text-[#455a5d]">
                      {formatDate(article.date)}
                    </span>
                  </div>
                  <h3 className="font-[Amiri] text-lg font-bold text-[#455a5d] mb-3 leading-relaxed group-hover:text-[#87b0b6] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.newspaper && (
                    <p className="font-[Amiri] text-xs text-[#455a5d] mb-2">
                      {article.newspaper}
                    </p>
                  )}
                  <p className="font-[Amiri] text-sm text-[#455a5d] leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 font-[Amiri] text-sm text-[#8b2e3b] group-hover:text-[#8b2e3b] flex items-center gap-1">
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
            <p className="font-[Amiri] text-[#455a5d] text-lg">
              {allArticles.length === 0
                ? "لا توجد مقالات في الأرشيف حتى الآن"
                : "لا توجد مقالات مطابقة لبحثك"}
            </p>
          </div>
        )}

        {/* Pagination — solid borders (#1) */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg border-2 border-[#87b0b6]/25 bg-[#f5f0e1] flex items-center justify-center text-[#87b0b6] hover:bg-[#87b0b6]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-[Amiri] text-sm transition-colors ${
                  currentPage === page
                    ? "bg-[#87b0b6] text-white shadow-md"
                    : "border-2 border-[#87b0b6]/25 bg-[#f5f0e1] text-[#87b0b6] hover:bg-[#87b0b6]/10"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border-2 border-[#87b0b6]/25 bg-[#f5f0e1] flex items-center justify-center text-[#87b0b6] hover:bg-[#87b0b6]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
