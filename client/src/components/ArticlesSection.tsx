/*
 * Design: Kharij Al Nass — Warm editorial Arabic-first
 * Main articles section: shows only the 5 NEWEST articles by date
 * Full archive is at /archive
 * Fetches from Cloudflare D1 API, falls back to one example article
 */
import { useState, useMemo, useEffect, useRef } from "react";
import { X, ChevronLeft, ArrowLeft } from "lucide-react";
import { fetchAllArticles, type StoredArticle } from "@/lib/articleStorage";
import AnimatedSection from "./AnimatedSection";
import { Link } from "wouter";

const MAX_RECENT = 5;

export default function ArticlesSection() {
  const [selectedArticle, setSelectedArticle] = useState<StoredArticle | null>(null);
  const [allArticles, setAllArticles] = useState<StoredArticle[]>([]);
  const [loading, setLoading] = useState(true);

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

  const recentArticles = useMemo(() => {
    return [...allArticles]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, MAX_RECENT);
  }, [allArticles]);

  const hasMore = allArticles.length > MAX_RECENT;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  const ROSETTE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663135713175/7EAJf9X3KvFUwHgCUasNkN/rosette-pattern_27b104e0.jpeg";

  return (
    <section
      id="articles"
      className="py-20 md:py-28 relative"
      style={{
        backgroundColor: '#f1efd6',
        backgroundImage: `url(${ROSETTE_IMG})`,
        backgroundRepeat: 'repeat',
        backgroundSize: '120px 120px',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-[#f1efd6]/88" />

      <div className="container relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-[Amiri] text-3xl md:text-4xl font-bold text-[#87b0b6] mb-4">
            أحدث المقالات
          </h2>
          <div className="divider-double mx-auto mb-6" />
          <p className="font-[Amiri] text-[#6b6b5e] max-w-2xl mx-auto leading-relaxed">
            آخر ما نُشر من مقالات وآراء
          </p>
        </AnimatedSection>

        {/* Skeleton loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[#faf9f0] rounded-xl overflow-hidden shadow-sm border border-[#d4d1b8]">
                <div className="h-1 bg-[#87b0b6]/30" />
                <div className="p-5 md:p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-16 bg-[#87b0b6]/15 rounded-full animate-pulse" />
                    <div className="h-4 w-24 bg-[#e4e1c4] rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-full bg-[#e4e1c4] rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-[#e4e1c4] rounded animate-pulse" />
                  <div className="space-y-2 pt-1">
                    <div className="h-4 w-full bg-[#e4e1c4]/60 rounded animate-pulse" />
                    <div className="h-4 w-full bg-[#e4e1c4]/60 rounded animate-pulse" />
                    <div className="h-4 w-2/3 bg-[#e4e1c4]/60 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-20 bg-[#87b0b6]/15 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Articles Grid — 5 newest */}
        {!loading && recentArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {recentArticles.map((article, i) => (
              <AnimatedSection key={article.id} delay={i * 60}>
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full text-right bg-[#faf9f0] rounded-xl overflow-hidden shadow-sm border border-[#d4d1b8] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Category bar — teal */}
                  <div className="h-1 bg-[#87b0b6] group-hover:bg-[#6a9199] transition-colors" />

                  <div className="p-5 md:p-6">
                    {/* Category & Date */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-[Amiri] text-xs bg-[#87b0b6]/15 text-[#6a9199] px-2.5 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span className="font-[Amiri] text-xs text-[#6b6b5e]">
                        {formatDate(article.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-[Amiri] text-lg font-bold text-[#3a3a32] mb-3 leading-relaxed group-hover:text-[#87b0b6] transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Newspaper name if present */}
                    {article.newspaper && (
                      <p className="font-[Amiri] text-xs text-[#6b6b5e] mb-2">
                        {article.newspaper}
                      </p>
                    )}

                    {/* Excerpt */}
                    <p className="font-[Amiri] text-sm text-[#6b6b5e] leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>

                    {/* Read more */}
                    <div className="mt-4 font-[Amiri] text-sm text-[#bf4240] group-hover:text-[#a83836] flex items-center gap-1">
                      <span>اقرأ المزيد</span>
                      <ChevronLeft size={14} />
                    </div>
                  </div>
                </button>
              </AnimatedSection>
            ))}
          </div>
        )}

        {!loading && recentArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="font-[Amiri] text-[#6b6b5e] text-lg">
              لا توجد مقالات حتى الآن
            </p>
          </div>
        )}

        {/* Archive link */}
        {!loading && (
          <AnimatedSection delay={300} className="flex justify-center mt-4">
            <Link href="/archive">
              <span className="inline-flex items-center gap-2 bg-[#87b0b6] text-white font-[Amiri] text-sm font-medium px-7 py-3 rounded-xl hover:bg-[#6a9199] transition-colors shadow-md cursor-pointer">
                {hasMore ? (
                  <>
                    <span>عرض جميع المقالات ({allArticles.length})</span>
                    <ArrowLeft size={16} />
                  </>
                ) : (
                  <>
                    <span>أرشيف المقالات</span>
                    <ArrowLeft size={16} />
                  </>
                )}
              </span>
            </Link>
          </AnimatedSection>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </section>
  );
}

export function ArticleModal({
  article,
  onClose,
}: {
  article: StoredArticle;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        className="bg-[#faf9f0] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(20px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — teal */}
        <div className="bg-[#87b0b6] p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="font-[Amiri] text-xs bg-[#6a9199] text-white px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="font-[Amiri] text-xs text-white/70">
              {formatDate(article.date)}
            </span>
            {article.newspaper && (
              <span className="font-[Amiri] text-xs text-white/70">
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
          <div className="font-[Amiri] text-base text-[#3a3a32] leading-[2] whitespace-pre-line">
            {article.content}
          </div>

          {/* Author attribution */}
          <div className="mt-8 pt-6 border-t border-[#d4d1b8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#87b0b6]/15 flex items-center justify-center">
                <span className="font-[Amiri] text-[#87b0b6] font-bold text-sm">خ</span>
              </div>
              <div>
                <p className="font-[Amiri] text-sm font-semibold text-[#3a3a32]">
                  خليفة جمعة الرميثي
                </p>
                <p className="font-[Amiri] text-xs text-[#6b6b5e]">
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
