/*
 * Design: Green Ink Press — Editorial newspaper style
 * Articles: Searchable, filterable archive with card layout
 * Pagination, category filters, year filters
 * Modal for full article view — CSS transitions, no framer-motion
 * Now fetches from Cloudflare D1 API, falls back to hardcoded articles
 */
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Search, X, Calendar, Tag, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { categories as defaultCategories, type Article } from "@/data/articles";
import { fetchAllArticles, type StoredArticle } from "@/lib/articleStorage";
import AnimatedSection from "./AnimatedSection";

const ARTICLES_PER_PAGE = 6;

const PATTERN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/articles-pattern-P3uHDEeAuMjKEYia9gYeCW.webp";

export default function ArticlesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedYear, setSelectedYear] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<StoredArticle | null>(null);
  const [allArticles, setAllArticles] = useState<StoredArticle[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles from API on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const articles = await fetchAllArticles();
        if (!cancelled) {
          setAllArticles(articles);
        }
      } catch {
        // fallback handled inside fetchAllArticles
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Derive years and categories from all articles
  const years = useMemo(
    () => Array.from(new Set(allArticles.map((a) => a.year))).sort((a, b) => b - a),
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

  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  return (
    <section
      id="articles"
      className="py-20 md:py-28 relative"
      style={{
        backgroundImage: `url(${PATTERN_BG})`,
        backgroundSize: "400px",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-[#f7f5f2]/85" />

      <div className="container relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-[Amiri] text-3xl md:text-4xl font-bold text-[#0d3b1f] mb-4">
            أرشيف المقالات
          </h2>
          <div className="divider-double mx-auto mb-6" />
          <p className="font-[Cairo] text-[#4a6b5a] max-w-2xl mx-auto leading-relaxed">
            مجموعة من المقالات والآراء المنشورة على مدار السنوات
          </p>
        </AnimatedSection>

        {/* Search & Filters */}
        <AnimatedSection delay={100} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-[#d4edda] mb-10">
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
                  handleFilterChange();
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
                  handleFilterChange();
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
                  handleFilterChange();
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
            {loading ? "جاري التحميل..." : `${filteredArticles.length} مقال`}
          </div>
        </AnimatedSection>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[#2e7d4a]" />
            <span className="mr-3 font-[Cairo] text-[#4a6b5a]">جاري تحميل المقالات...</span>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && paginatedArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {paginatedArticles.map((article, i) => (
              <AnimatedSection key={article.id} delay={i * 60}>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full text-right bg-white rounded-xl overflow-hidden shadow-sm border border-[#e8f0ec] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Category bar */}
                  <div className="h-1 bg-[#2e7d4a] group-hover:bg-[#1b6b3a] transition-colors" />

                  <div className="p-5 md:p-6">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-[Tajawal] text-xs bg-[#e8f5e9] text-[#1b6b3a] px-2.5 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="font-[Tajawal] text-xs text-[#7aa88e]">
                        {formatDate(article.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-[Amiri] text-lg font-bold text-[#0d3b1f] mb-3 leading-relaxed group-hover:text-[#1b6b3a] transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Newspaper name if present */}
                    {article.newspaper && (
                      <p className="font-[Tajawal] text-xs text-[#7aa88e] mb-2">
                        {article.newspaper}
                      </p>
                    )}

                    {/* Excerpt */}
                    <p className="font-[Cairo] text-sm text-[#4a6b5a] leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Read more */}
                    <div className="mt-4 font-[Cairo] text-sm text-[#2e7d4a] group-hover:text-[#1b6b3a] flex items-center gap-1">
                      <span>اقرأ المزيد</span>
                      <ChevronLeft size={14} />
                    </div>
                  </div>
                </button>
              </AnimatedSection>
            ))}
          </div>
        )}

        {!loading && paginatedArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="font-[Cairo] text-[#7aa88e] text-lg">
              لا توجد مقالات مطابقة لبحثك
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg border border-[#d4edda] flex items-center justify-center text-[#2e7d4a] hover:bg-[#e8f5e9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                    : "border border-[#d4edda] text-[#2e7d4a] hover:bg-[#e8f5e9]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border border-[#d4edda] flex items-center justify-center text-[#2e7d4a] hover:bg-[#e8f5e9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Article Modal — CSS transition, no framer-motion */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </section>
  );
}

function ArticleModal({
  article,
  onClose,
}: {
  article: StoredArticle;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger entrance animation after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        transition: "background-color 0.25s ease, backdrop-filter 0.25s ease",
      }}
      onClick={handleClose}
    >
      <div
        ref={innerRef}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0d3b1f] p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-3">
            <span className="font-[Tajawal] text-xs bg-[#2e7d4a] text-white px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="font-[Tajawal] text-xs text-white/60">
              {formatDate(article.date)}
            </span>
            {article.newspaper && (
              <span className="font-[Tajawal] text-xs text-white/60">
                — {article.newspaper}
              </span>
            )}
          </div>

          <h2 className="font-[Amiri] text-2xl md:text-3xl font-bold text-white leading-relaxed">
            {article.title}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[55vh]">
          <div className="font-[Cairo] text-base text-[#2a3f33] leading-[2] whitespace-pre-line">
            {article.content}
          </div>

          {/* Author attribution */}
          <div className="mt-8 pt-6 border-t border-[#d4edda]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                <span className="font-[Amiri] text-[#2e7d4a] font-bold text-sm">خ</span>
              </div>
              <div>
                <p className="font-[Cairo] text-sm font-semibold text-[#0d3b1f]">
                  خليفة جمعة الرميثي
                </p>
                <p className="font-[Tajawal] text-xs text-[#7aa88e]">
                  كاتب وصحفي
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
