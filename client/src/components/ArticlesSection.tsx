import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useArticles } from "@/hooks/useArticles";
import { ArticleCard, ArticlesLoading, ArticlesState } from "./ArticleList";

export default function ArticlesSection() {
  const { articles, loading, error, retry } = useArticles();
  return (
    <section
      id="articles"
      className="section-spacing"
      aria-labelledby="articles-title"
    >
      <div className="container">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="eyebrow">من خارج النص</p>
            <h2 id="articles-title" className="section-title">
              أحدث المقالات
            </h2>
            <p className="section-copy mt-4">
              قراءات في السياسة والاقتصاد والمجتمع.
            </p>
          </div>
          <Link
            href="/archive"
            className="editorial-button editorial-button--outline"
          >
            أرشيف المقالات <ArrowLeft size={18} aria-hidden="true" />
          </Link>
        </div>
        {loading ? (
          <ArticlesLoading />
        ) : error ? (
          <ArticlesState error retry={retry} />
        ) : articles.length === 0 ? (
          <ArticlesState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
