import { useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArticleCard,
  ArticlesLoading,
  ArticlesState,
} from "@/components/ArticleList";
import { useArticles } from "@/hooks/useArticles";
import { filterArticles } from "@/lib/articlePresentation";

const PAGE_SIZE = 9;

export default function Archive() {
  const { articles, loading, error, retry } = useArticles();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);
  const categories = useMemo(
    () => Array.from(new Set(articles.map(a => a.category))),
    [articles]
  );
  const years = useMemo(
    () => Array.from(new Set(articles.map(a => a.date.slice(0, 4)))).sort().reverse(),
    [articles]
  );
  const filtered = useMemo(
    () => filterArticles(articles, query, category, year),
    [articles, query, category, year]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const clear = () => {
    setQuery("");
    setCategory("");
    setYear("");
    setPage(1);
  };
  const changePage = (next: number) => {
    setPage(next);
    document
      .getElementById("archive-results")
      ?.scrollIntoView({ behavior: "instant", block: "start" });
    document.getElementById("archive-results")?.focus({ preventScroll: true });
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
                  onChange={e => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
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
                onChange={e => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
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
                onChange={e => {
                  setYear(e.target.value);
                  setPage(1);
                }}
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
              <button
                type="button"
                className="editorial-button editorial-button--outline"
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
              >
                <ChevronRight size={18} aria-hidden="true" /> السابقة
              </button>
              <span aria-live="polite">
                {currentPage.toLocaleString("ar-AE")} /{" "}
                {pages.toLocaleString("ar-AE")}
              </span>
              <button
                type="button"
                className="editorial-button editorial-button--outline"
                disabled={currentPage === pages}
                onClick={() => changePage(currentPage + 1)}
              >
                التالية <ChevronLeft size={18} aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
