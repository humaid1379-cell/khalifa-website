import { Home } from "lucide-react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f1efd6]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-[Amiri] text-8xl font-bold text-[#87b0b6] mb-4">404</h1>
          <div className="divider-double mx-auto mb-6" />
          <h2 className="font-[Amiri] text-2xl font-bold text-[#455a5d] mb-4">
            الصفحة غير موجودة
          </h2>
          <p className="font-[Amiri] text-[#5a7275] mb-8 leading-relaxed max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها.
          </p>
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 bg-[#bf4240] hover:bg-[#a83836] text-white font-[Amiri] text-sm px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Home size={16} />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
}
