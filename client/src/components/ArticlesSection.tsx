/*
 * Design: Green Ink Press — Editorial newspaper style
 * Articles: Searchable, filterable archive with card layout
 * Pagination, category filters, year filters
 * Modal for full article view with framer-motion animations
 */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Calendar, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { articles, categories, years, type Article } from "@/data/articles";

const ARTICLES_PER_PAGE = 6;

const PATTERN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7bAYv5QYZcia9BxhPhwv4f/articles-pattern-P3uHDEeAuMjKEYia9gYeCW.webp";

export default function ArticlesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedYear, setSelectedYear] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
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
  }, [searchQuery, selectedCategory, selectedYear]);

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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-[Amiri] text-3xl md:text-4xl font-bold text-[#0d3b1f] mb-4">
            أرشيف المقالات
          </h2>
          <div className="divider-double mx-auto mb-6" />
          <p className="font-[Cairo] text-[#4a6b5a] max-w-2xl mx-auto leading-relaxed">
            مجموعة من المقالات والآراء المنشورة على مدار السنوات
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-[#d4edda] mb-10"
        >
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
            {filteredArticles.length} مقال
          </div>
        </motion.div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {paginatedArticles.map((article, i) => (
              <motion.button
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                onClick={() => setSelectedArticle(article)}
                className="text-right bg-white rounded-xl overflow-hidden shadow-sm border border-[#e8f0ec] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
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
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-[Cairo] text-[#7aa88e] text-lg">
              لا توجد مقالات مطابقة لبحثك
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
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

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ArticleModal({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0d3b1f] p-6 relative">
          <button
            onClick={onClose}
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
      </motion.div>
    </motion.div>
  );
}
