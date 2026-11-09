import { ArrowUpLeft, BookOpen, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import type { StoredArticle } from "@/lib/articleStorage";
import {
  articleDate,
  articleHref,
  readingLabel,
} from "@/lib/articlePresentation";

export function ArticleCard({ article }: { article: StoredArticle }) {
  return (
    <article className="article-card">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#455a5d]">
        <span className="article-category">{article.category}</span>
        <time dateTime={article.date}>{articleDate(article.date)}</time>
      </div>
      <h3 className="mt-5 text-2xl font-bold leading-relaxed md:text-3xl">
        <Link href={articleHref(article.id)} className="article-title-link">
          {article.title}
        </Link>
      </h3>
      {article.newspaper && (
        <p className="mt-2 text-sm text-[#526562]">{article.newspaper}</p>
      )}
      <p className="article-excerpt mt-4 line-clamp-3 text-lg leading-[1.95] text-[#526562]">
        {article.excerpt || article.content.slice(0, 180)}
      </p>
      <div className="article-card-footer flex items-center justify-between gap-3 border-t border-[#455a5d]/15 text-sm">
        <span>{readingLabel(article.content)}</span>
        <Link
          href={articleHref(article.id)}
          aria-label={`اقرأ: ${article.title}`}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 font-bold text-[#a33432]"
        >
          اقرأ المقال <ArrowUpLeft size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function ArticlesLoading() {
  return (
    <div
      role="status"
      aria-label="جارٍ تحميل المقالات"
      className="grid gap-6 md:grid-cols-3"
    >
      {[0, 1, 2].map(item => (
        <div key={item} className="article-skeleton" aria-hidden="true">
          <div />
          <div />
          <div />
        </div>
      ))}
      <span className="sr-only">جارٍ تحميل المقالات</span>
    </div>
  );
}

export function ArticlesState({
  error,
  retry,
  filtered,
  reset,
}: {
  error?: boolean;
  retry?: () => void;
  filtered?: boolean;
  reset?: () => void;
}) {
  return (
    <div className="article-state" role={error ? "alert" : "status"}>
      <BookOpen
        size={32}
        strokeWidth={1.3}
        aria-hidden="true"
        className="mx-auto mb-5 text-[#637e7a]"
      />
      <h2 className="text-2xl font-bold">
        {error
          ? "تعذّر تحميل المقالات"
          : filtered
            ? "لا توجد نتائج مطابقة"
            : "مساحة للكلمة والرأي"}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-[#526562]">
        {error
          ? "يرجى المحاولة مرة أخرى بعد قليل."
          : filtered
            ? "جرّب كلمة أخرى أو أزل خيارات التصفية."
            : "ستجد هنا المقالات الجديدة عند نشرها. يمكنك متابعة آخر المستجدات عبر إنستغرام."}
      </p>
      {error && (
        <button type="button" onClick={retry} className="editorial-button mt-6">
          <RefreshCw size={16} aria-hidden="true" /> إعادة المحاولة
        </button>
      )}
      {filtered && (
        <button type="button" onClick={reset} className="editorial-button mt-6">
          مسح البحث والتصفية
        </button>
      )}
    </div>
  );
}
