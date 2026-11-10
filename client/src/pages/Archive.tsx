import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArticleCard,
  ArticlesLoading,
  ArticlesState,
} from "@/components/ArticleList";
import { useArticles } from "@/hooks/useArticles";
import { filterArticles } from "@/lib/articlePresentation";
import {
  archiveHref,
  parseArchiveState,
  type ArchiveState,
} from "@/lib/archiveState";

const PAGE_SIZE = 9;

export default function Archive() {
  const { articles, loading, error, retry } = useArticles();
  const search = useSearch();
  const [, navigate] = useLocation();
  const state = parseArchiveState(search);
  const { query, category, year, page } = state;
  const paginationClicked = useRef(false);
  const categories = useMemo(
    () =>
      Array.from(new Set([category, ...articles.map(a => a.category)])).filter(
        Boolean
      ),
    [articles, category]
  );
  const years = useMemo(
    () =>
      Array.from(new Set([year, ...articles.map(a => a.date.slice(0, 4))]))
        .filter(Boolean)
        .sort()
        .reverse(),
    [articles, year]
  );
  const filtered = useMemo(
    () => filterArticles(articles, query, category, year),
    [articles, query, category, year]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const updateFilters = (updates: Partial<ArchiveState>) => {
    navigate(archiveHref({ ...state, ...updates, page: 1 }), { replace: true });
  };
  const clear = () => updateFilters({ query: "", category: "", year: "" });
  useEffect(() => {
    // Replace impossible page numbers only after a successful load.
    if (!loading && !error && page !== currentPage)
      navigate(archiveHref({ query, category, year, page: currentPage }), {
        replace: true,
      });
  }, [loading, error, page, currentPage, query, category, year, navigate]);
  useEffect(() => {
    if (!paginationClicked.current) return;
    paginationClicked.current = false;
    const results = document.getElementById("archive-results");
    results?.scrollIntoView({ behavior: "instant", block: "start" });
    results?.focus({ preventScroll: true });
  }, [currentPage]);
  const onPaginationClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey &&
      event.button === 0
    )
      paginationClicked.current = true;
  };
  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <header className="page-intro">
          <div className="container">
            <Link
              href="/"
              className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm"
            >
              <ArrowRight size={16} aria-hidden="true" /> العودة إلى الرئيسية
            </Link>
            <p className="eyebrow">الكلمة تبقى</p>
            <h1 className="section-title">أرشيف المقالات</h1>
            <p className="section-copy mt-5">
              مقالات وآراء، من الأحدث إلى الأقدم. ابحث عن موضوع يشغلك.
            </p>
          </div>
        </header>
        <div className="container section-spacing">
          <form
            role="search"
            aria-label="البحث في المقالات"
            onSubmit={e => e.preventDefault()}
            className="archive-filters"
          >
            <div className="min-w-0 flex-1">
              <label
                htmlFor="article-search"
                className="mb-2 block text-sm font-bold"
              >
                ابحث في المقالات
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                  size={19}
                  aria-hidden="true"
                />
                <input
                  id="article-search"
                  type="search"
                  value={query}
                  onChange={e => updateFilters({ query: e.target.value })}
                  placeholder="عنوان، موضوع، أو كلمة…"
                  className="archive-input article-search"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="article-category"
                className="mb-2 block text-sm font-bold"
              >
                الموضوع
              </label>
              <select
                id="article-category"
                value={category}
                className="archive-input"
                onChange={e => updateFilters({ category: e.target.value })}
              >
                <option value="">كل الموضوعات</option>
                {categories.map(value => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="article-year"
                className="mb-2 block text-sm font-bold"
              >
                السنة
              </label>
              <select
                id="article-year"
                value={year}
                className="archive-input"
                onChange={e => updateFilters({ year: e.target.value })}
              >
                <option value="">كل السنوات</option>
                {years.map(value => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
          </form>
          <div className="mb-8 flex items-center justify-between gap-4 border-b border-[#455a5d]/20 pb-4">
            <p role="status" aria-live="polite" className="text-sm">
              {loading
                ? "جارٍ تحميل المقالات…"
                : error
                  ? "المقالات غير متاحة حالياً"
                  : `${filtered.length.toLocaleString("ar-AE")} من المقالات`}
            </p>
            {(query || category || year) && (
              <button
                type="button"
                className="min-h-11 text-sm font-bold text-[#a33432] underline underline-offset-4"
                onClick={clear}
              >
                مسح التصفية
              </button>
            )}
          </div>
          <section
            id="archive-results"
            aria-label="نتائج المقالات"
            tabIndex={-1}
            className="scroll-mt-28"
          >
            {loading ? (
              <ArticlesLoading />
            ) : error ? (
              <ArticlesState error retry={retry} />
            ) : filtered.length === 0 ? (
              <ArticlesState filtered={articles.length > 0} reset={clear} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered
                  .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                  .map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
            )}
          </section>
          {!loading && !error && pages > 1 && (
            <nav
              aria-label="صفحات المقالات"
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              {currentPage > 1 ? (
                <Link
                  href={archiveHref({ ...state, page: currentPage - 1 })}
                  rel="prev"
                  onClick={onPaginationClick}
                  className="editorial-button editorial-button--outline"
                >
                  <ChevronRight size={18} aria-hidden="true" /> السابقة
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="editorial-button editorial-button--outline opacity-50"
                >
                  <ChevronRight size={18} aria-hidden="true" /> السابقة
                </span>
              )}
              <span aria-live="polite">
                {currentPage.toLocaleString("ar-AE")} /{" "}
                {pages.toLocaleString("ar-AE")}
              </span>
              {currentPage < pages ? (
                <Link
                  href={archiveHref({ ...state, page: currentPage + 1 })}
                  rel="next"
                  onClick={onPaginationClick}
                  className="editorial-button editorial-button--outline"
                >
                  التالية <ChevronLeft size={18} aria-hidden="true" />
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="editorial-button editorial-button--outline opacity-50"
                >
                  التالية <ChevronLeft size={18} aria-hidden="true" />
                </span>
              )}
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
