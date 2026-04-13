import { Home } from "lucide-react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f5f0e1]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-[Amiri] text-8xl font-bold text-[#87b07a] mb-4">404</h1>
          <div className="divider-double mx-auto mb-6" />
          <h2 className="font-[Amiri] text-2xl font-bold text-[#3d5a45] mb-4">
            الصفحة غير موجودة
          </h2>
          <p className="font-[Amiri] text-[#4a6b50] mb-8 leading-relaxed max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها.
          </p>
          <button
            onClick={() => setLocation("/")}
            className="inline-flex items-center gap-2 bg-[#8b2e3b] hover:bg-[#731f2c] text-white font-[Amiri] text-sm px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            <Home size={16} />
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
}
