import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="not-found flex-1">
        <div className="container">
          <p className="eyebrow" dir="ltr">404</p>
          <h1 className="section-title">هذه الصفحة<br />خارج النص.</h1>
          <p className="section-copy">عذراً، لم نعثر على الصفحة المطلوبة. يمكنك العودة إلى الرئيسية أو تصفّح أرشيف المقالات.</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <a href="/" className="editorial-button"><ArrowRight size={18} aria-hidden="true" /> العودة للرئيسية</a>
            <a href="/archive" className="editorial-button editorial-button--outline">تصفّح الأرشيف</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
