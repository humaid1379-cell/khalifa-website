import { ArrowUp, Instagram, MessageCircle } from "lucide-react";
import { SITE, whatsappUrl } from "@/config/site";
import KharijLogo from "./KharijLogo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <a className="brand-link" href="/" aria-label="خارج النص — الصفحة الرئيسية">
            <KharijLogo variant="hero" color="beige" />
            <span className="footer-author">{SITE.author}<span>كاتب وصحفي إماراتي</span></span>
          </a>
          <nav aria-label="روابط التذييل" className="footer-nav">
            <a href="/#bio">السيرة الذاتية</a>
            <a href="/archive">أرشيف المقالات</a>
            <a href="/podcast">البودكاست</a>
            <a href="/#contact">تواصل</a>
          </nav>
          <div className="footer-socials">
            <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="انستغرام — يفتح في نافذة جديدة"><Instagram size={20} aria-hidden="true" /></a>
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="واتساب — يفتح في نافذة جديدة"><MessageCircle size={20} aria-hidden="true" /></a>}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {SITE.author}. جميع الحقوق محفوظة.</p>
          <button type="button" onClick={() => {
            window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
          }}>العودة للأعلى <ArrowUp size={16} aria-hidden="true" /></button>
        </div>
      </div>
    </footer>
  );
}
