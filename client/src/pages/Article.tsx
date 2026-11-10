import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Link as LinkIcon,
  Printer,
  RefreshCw,
} from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchArticle, type StoredArticle } from "@/lib/articleStorage";
import { articleDate, readingLabel } from "@/lib/articlePresentation";
import { SITE } from "@/config/site";
import type { ReaderMetadataState } from "@/lib/routeMetadata";

export default function Article({
  params,
  onMetadata,
}: {
  params: { id: string };
  onMetadata: (state: ReaderMetadataState) => void;
}) {
  const [article, setArticle] = useState<StoredArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    setArticle(null);
    setShareStatus("idle");
    fetchArticle(params.id)
      .then(value => {
        if (active) setArticle(value);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id, attempt]);

  useEffect(() => {
    onMetadata({
      id: params.id,
      status: loading
        ? "loading"
        : error
          ? "error"
          : article
            ? "ready"
            : "missing",
      article: article || undefined,
    });
  }, [params.id, article, loading, error, onMetadata]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <header className="page-intro">
          <div className="container">
            <div className="reader-shell">
              <Link
                href="/archive"
                className="reader-actions mb-8 inline-flex min-h-11 items-center gap-2 text-base"
              >
                <ArrowRight size={18} aria-hidden="true" /> جميع المقالات
              </Link>
              {loading ? (
                <div role="status">
                  <p className="eyebrow">خارج النص</p>
                  <h1 className="reader-title">جارٍ تحميل المقال…</h1>
                </div>
              ) : article ? (
                <>
                  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-base text-[#e2e5d8]">
                    <span className="article-category">{article.category}</span>
                    <time dateTime={article.date}>
                      {articleDate(article.date)}
                    </time>
                    <span>{readingLabel(article.content)}</span>
                  </div>
                  <h1 className="reader-title">{article.title}</h1>
                  <div className="mt-7 border-t border-[#f1efd6]/25 pt-6 text-lg">
                    <p>{SITE.author}</p>
                    {article.newspaper && (
                      <p className="mt-1 text-base text-[#e2e5d8]">
                        نُشر في {article.newspaper}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="eyebrow">خارج النص</p>
                  <h1 className="reader-title">
                    {error ? "تعذّر تحميل المقال" : "لم نجد هذا المقال"}
                  </h1>
                  <p className="section-copy mt-5">
                    {error
                      ? "يرجى التحقق من اتصالك والمحاولة مرة أخرى."
                      : "قد يكون الرابط غير صحيح أو لم يعد المقال متاحاً. يمكنك تصفّح بقية المقالات في الأرشيف."}
                  </p>
                  {error && (
                    <button
                      type="button"
                      className="editorial-button editorial-button--light mt-6"
                      onClick={() => setAttempt(value => value + 1)}
                    >
                      <RefreshCw size={18} aria-hidden="true" /> إعادة المحاولة
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </header>
        {!loading && article && (
          <div className="container section-spacing">
            <div className="reader-shell">
              <div className="reader-actions mb-10 border-b border-[#455a5d]/20 pb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="editorial-button editorial-button--outline"
                  >
                    {shareStatus === "copied" ? (
                      <Check size={17} aria-hidden="true" />
                    ) : (
                      <LinkIcon size={17} aria-hidden="true" />
                    )}
                    {shareStatus === "copied"
                      ? "تم نسخ الرابط"
                      : "نسخ رابط المقال"}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="editorial-button editorial-button--outline"
                  >
                    <Printer size={17} aria-hidden="true" /> طباعة المقال
                  </button>
                </div>
                <p role="status" aria-live="polite" className="mt-3 text-sm">
                  {shareStatus === "copied"
                    ? "الرابط جاهز للمشاركة."
                    : shareStatus === "failed"
                      ? "تعذّر النسخ. يمكنك نسخ الرابط من شريط العنوان."
                      : ""}
                </p>
              </div>
              <article className="reader-content" aria-label={article.title}>
                {article.content.split(/\n\s*\n/).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </article>
              <div className="reader-actions mt-14 border-t border-[#455a5d]/20 pt-8">
                <Link
                  href="/archive"
                  className="editorial-button editorial-button--outline"
                >
                  <ArrowRight size={18} aria-hidden="true" /> العودة إلى أرشيف
                  المقالات
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
