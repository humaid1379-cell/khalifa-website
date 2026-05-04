/*
 * Admin Login Page — Arabic RTL, Kharij Al Nass branding
 * Simple password-only authentication (now async via API)
 */
import { useState, type FormEvent } from "react";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { adminLogin } from "@/lib/articleStorage";

interface Props {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await adminLogin(password);
      if (success) {
        onSuccess();
      } else {
        setError("كلمة المرور غير صحيحة");
        setLoading(false);
      }
    } catch {
      setError("حدث خطأ في الاتصال");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #87b0b6 0%, #87b0b6 50%, #87b0b6 100%)",
      }}
    >
      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Back to site link */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-[#f1efd6] hover:text-white font-[Amiri] text-sm mb-6 transition-colors"
        >
          <ArrowRight size={16} />
          <span>العودة إلى الموقع</span>
        </a>

        {/* Login Card */}
        <div className="bg-[#f1efd6] rounded-2xl shadow-2xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#87b0b6]/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-[#87b0b6]" />
            </div>
            <h1 className="font-[Amiri] text-2xl font-bold text-[#455a5d] mb-2">
              لوحة التحكم
            </h1>
            <p className="font-[Amiri] text-sm text-[#455a5d]">
              أدخل كلمة المرور للوصول إلى إدارة المقالات
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block font-[Amiri] text-sm font-medium text-[#455a5d] mb-2"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="أدخل كلمة المرور"
                  className="w-full pr-4 pl-12 py-3 rounded-xl border-2 border-[#87b0b6] bg-[#f1efd6] font-[Amiri] text-[#455a5d] placeholder:text-[#455a5d] focus:outline-none focus:border-[#87b0b6] transition-colors text-base"
                  autoFocus
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#455a5d] hover:text-[#455a5d] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Error message */}
              {error && (
                <p className="mt-2 font-[Amiri] text-sm text-[#bf4240] flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#bf4240]" />
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-[#87b0b6] text-white font-[Amiri] font-medium text-base hover:bg-[#87b0b6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحقق...
                </span>
              ) : (
                "دخول"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 font-[Amiri] text-xs text-[#f1efd6]/60">
          خليفة جمعة الرميثي — لوحة إدارة المقالات
        </p>
      </div>
    </div>
  );
}
