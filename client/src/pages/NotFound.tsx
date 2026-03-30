import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f5f2]">
      <div className="text-center px-6">
        <h1 className="font-[Amiri] text-8xl font-bold text-[#0d3b1f] mb-4">404</h1>
        <div className="divider-double mx-auto mb-6" />
        <h2 className="font-[Amiri] text-2xl font-bold text-[#2e7d4a] mb-4">
          الصفحة غير موجودة
        </h2>
        <p className="font-[Cairo] text-[#4a6b5a] mb-8 leading-relaxed max-w-md mx-auto">
          عذراً، الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها.
        </p>
        <button
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 bg-[#2e7d4a] hover:bg-[#3a9d5e] text-white font-[Cairo] text-sm px-6 py-3 rounded-lg transition-colors shadow-md"
        >
          <Home size={16} />
          <span>العودة للرئيسية</span>
        </button>
      </div>
    </div>
  );
}
