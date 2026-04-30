/*
 * Admin Dashboard — Arabic RTL, green theme
 * Full CRUD for articles via Cloudflare D1 API
 * Includes seed button to populate database with initial articles
 */
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  LogOut,
  ArrowRight,
  X,
  Save,
  FileText,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Database,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  fetchArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getAllCategories,
  generateId,
  adminLogout,
  seedDatabase,
  getHardcodedArticles,
  type StoredArticle,
} from "@/lib/articleStorage";

const ITEMS_PER_PAGE = 10;

interface ArticleForm {
  title: string;
  newspaper: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

const emptyForm: ArticleForm = {
  title: "",
  newspaper: "",
  date: new Date().toISOString().split("T")[0],
  category: "رأي",
  excerpt: "",
  content: "",
};

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [articles, setArticles] = useState<StoredArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const categories = getAllCategories();

  // Load articles from API on mount
  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const apiArticles = await fetchArticles();
      setArticles(apiArticles);
    } catch {
      setErrorMsg("فشل في تحميل المقالات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Filter by search
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.includes(q) ||
        a.excerpt.includes(q) ||
        (a.newspaper && a.newspaper.includes(q))
    );
  }, [articles, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleEdit = (article: StoredArticle) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      newspaper: article.newspaper || "",
      date: article.date,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);

    const year = new Date(form.date).getFullYear();

    try {
      if (editingId) {
        const result = await updateArticle(editingId, {
          title: form.title.trim(),
          newspaper: form.newspaper.trim(),
          date: form.date,
          category: form.category,
          excerpt: form.excerpt.trim() || form.content.trim().substring(0, 150) + "...",
          content: form.content.trim(),
          year,
        });
        if (result.success) {
          showSuccess("تم تحديث المقال بنجاح");
        } else {
          showError(result.error || "فشل في تحديث المقال");
        }
      } else {
        const newArticle: StoredArticle = {
          id: generateId(),
          title: form.title.trim(),
          newspaper: form.newspaper.trim(),
          date: form.date,
          category: form.category,
          excerpt: form.excerpt.trim() || form.content.trim().substring(0, 150) + "...",
          content: form.content.trim(),
          year,
        };
        const result = await addArticle(newArticle);
        if (result.success) {
          showSuccess("تم إضافة المقال بنجاح");
        } else {
          showError(result.error || "فشل في إضافة المقال");
        }
      }

      await loadArticles();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch {
      showError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    try {
      const result = await deleteArticle(id);
      if (result.success) {
        showSuccess("تم حذف المقال بنجاح");
        await loadArticles();
      } else {
        showError(result.error || "فشل في حذف المقال");
      }
    } catch {
      showError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSaving(false);
      setDeleteConfirm(null);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seedDatabase();
      if (result.success) {
        showSuccess(result.message || "تم تعبئة قاعدة البيانات بنجاح");
        await loadArticles();
      } else {
        showError(result.error || "فشل في تعبئة قاعدة البيانات");
      }
    } catch {
      showError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setSeeding(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    onLogout();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f0e1]">
      {/* Top Bar */}
      <header className="bg-[#3a3a32] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={22} className="text-[#87b0b6]" />
            <h1 className="font-[Amiri] text-xl font-bold">لوحة إدارة المقالات</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 text-[#87b0b6] hover:text-white font-[Amiri] text-sm transition-colors"
            >
              <ArrowRight size={14} />
              <span>الموقع</span>
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-100 font-[Amiri] text-sm transition-colors"
            >
              <LogOut size={14} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#3a3a32] text-white px-6 py-3 rounded-xl shadow-xl font-[Amiri] text-sm animate-[fadeIn_0.3s_ease]">
          {successMsg}
        </div>
      )}

      {/* Error toast */}
      {errorMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-xl font-[Amiri] text-sm animate-[fadeIn_0.3s_ease]">
          {errorMsg}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="إجمالي المقالات"
            value={articles.length}
            icon={<FileText size={20} />}
          />
          <StatCard
            label="التصنيفات"
            value={categories.length}
            icon={<FileText size={20} />}
          />
          <div className="col-span-2 md:col-span-2 flex gap-4">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex-1 bg-white rounded-xl p-4 shadow-sm border border-[#d4d1b8] hover:border-[#87b0b6] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#87b0b6/15] flex items-center justify-center text-[#87b0b6]">
                  {seeding ? <Loader2 size={20} className="animate-spin" /> : <Database size={20} />}
                </div>
                <div className="text-right">
                  <p className="font-[Amiri] text-sm font-bold text-[#3a3a32]">
                    {seeding ? "جاري التعبئة..." : "تعبئة قاعدة البيانات"}
                  </p>
                  <p className="font-[Amiri] text-xs text-[#6b6b5e]">إضافة المقالات النموذجية</p>
                </div>
              </div>
            </button>
            <button
              onClick={loadArticles}
              disabled={loading}
              className="bg-white rounded-xl p-4 shadow-sm border border-[#d4d1b8] hover:border-[#87b0b6] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#87b0b6/15] flex items-center justify-center text-[#87b0b6]">
                  <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </div>
                <div className="text-right">
                  <p className="font-[Amiri] text-sm font-bold text-[#3a3a32]">تحديث</p>
                  <p className="font-[Amiri] text-xs text-[#6b6b5e]">إعادة تحميل</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#d4d1b8] mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b5e]"
              />
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-[#d4d1b8] bg-[#f5f0e1] font-[Amiri] text-sm text-[#3a3a32] placeholder:text-[#6b6b5e] focus:outline-none focus:border-[#87b0b6] focus:ring-1 focus:ring-[#87b0b6] transition-colors"
              />
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 bg-[#3a3a32] text-white px-5 py-2.5 rounded-lg font-[Amiri] text-sm font-medium hover:bg-[#6a9199] transition-colors shadow-md"
            >
              <Plus size={18} />
              <span>إضافة مقال جديد</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-[#87b0b6]" />
            <span className="mr-3 font-[Amiri] text-[#6b6b5e]">جاري تحميل المقالات...</span>
          </div>
        )}

        {/* Articles Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border border-[#d4d1b8] overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#e8e4cf] border-b border-[#d4d1b8]">
                    <th className="text-right px-4 py-3 font-[Amiri] text-xs font-semibold text-[#3a3a32] uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="text-right px-4 py-3 font-[Amiri] text-xs font-semibold text-[#3a3a32] uppercase tracking-wider">
                      الصحيفة
                    </th>
                    <th className="text-right px-4 py-3 font-[Amiri] text-xs font-semibold text-[#3a3a32] uppercase tracking-wider">
                      التصنيف
                    </th>
                    <th className="text-right px-4 py-3 font-[Amiri] text-xs font-semibold text-[#3a3a32] uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="text-center px-4 py-3 font-[Amiri] text-xs font-semibold text-[#3a3a32] uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles.map((article, i) => (
                    <tr
                      key={article.id}
                      className={`border-b border-[#d4d1b8] hover:bg-[#f5f0e1] transition-colors ${
                        i % 2 === 0 ? "bg-white" : "bg-[#fafcfb]"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <p className="font-[Amiri] text-sm text-[#3a3a32] font-medium line-clamp-1 max-w-xs">
                          {article.title}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-[Amiri] text-xs text-[#6b6b5e]">
                          {article.newspaper || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block font-[Amiri] text-xs bg-[#87b0b6/15] text-[#6a9199] px-2 py-0.5 rounded-full">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-[Amiri] text-xs text-[#6b6b5e]">
                          {formatDate(article.date)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-1.5 rounded-lg text-[#87b0b6] hover:bg-[#87b0b6/15] transition-colors"
                            title="تعديل"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(article.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedArticles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <p className="font-[Amiri] text-[#6b6b5e]">
                          {articles.length === 0
                            ? "لا توجد مقالات في قاعدة البيانات. اضغط على \"تعبئة قاعدة البيانات\" لإضافة المقالات النموذجية."
                            : "لا توجد مقالات مطابقة للبحث"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-[#d4d1b8]">
              {paginatedArticles.map((article) => (
                <div key={article.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-[Amiri] text-sm font-medium text-[#3a3a32] line-clamp-2 flex-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-1.5 rounded-lg text-[#87b0b6] hover:bg-[#87b0b6/15]"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(article.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-[Amiri] text-xs bg-[#87b0b6/15] text-[#6a9199] px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span className="font-[Amiri] text-xs text-[#6b6b5e]">
                      {formatDate(article.date)}
                    </span>
                    {article.newspaper && (
                      <span className="font-[Amiri] text-xs text-[#6b6b5e]">
                        {article.newspaper}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {paginatedArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-[Amiri] text-[#6b6b5e]">
                    {articles.length === 0
                      ? "لا توجد مقالات. اضغط على \"تعبئة قاعدة البيانات\" أعلاه."
                      : "لا توجد مقالات مطابقة"}
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t border-[#d4d1b8]">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg border border-[#d4d1b8] flex items-center justify-center text-[#87b0b6] hover:bg-[#87b0b6/15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
                <span className="font-[Amiri] text-sm text-[#6b6b5e]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg border border-[#d4d1b8] flex items-center justify-center text-[#87b0b6] hover:bg-[#87b0b6/15] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Article Form Modal */}
      {showForm && (
        <ArticleFormModal
          form={form}
          setForm={setForm}
          categories={categories}
          isEditing={!!editingId}
          onSave={handleSave}
          saving={saving}
          onClose={() => {
            setShowForm(false);
            setEditingId(null);
            setForm(emptyForm);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="font-[Amiri] text-xl font-bold text-[#3a3a32] mb-3">
              تأكيد الحذف
            </h3>
            <p className="font-[Amiri] text-sm text-[#6b6b5e] mb-6">
              هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-[Amiri] text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "جاري الحذف..." : "حذف"}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#d4d1b8] text-[#3a3a32] font-[Amiri] text-sm font-medium hover:bg-[#f5f0e1] transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#d4d1b8]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#87b0b6/15] flex items-center justify-center text-[#87b0b6]">
          {icon}
        </div>
        <div>
          <p className="font-[Amiri] text-2xl font-bold text-[#3a3a32]">{value}</p>
          <p className="font-[Amiri] text-xs text-[#6b6b5e]">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ArticleFormModal({
  form,
  setForm,
  categories,
  isEditing,
  onSave,
  saving,
  onClose,
}: {
  form: ArticleForm;
  setForm: (f: ArticleForm) => void;
  categories: string[];
  isEditing: boolean;
  onSave: () => void;
  saving: boolean;
  onClose: () => void;
}) {
  const isValid = form.title.trim() && form.content.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#d4d1b8]">
          <h2 className="font-[Amiri] text-xl font-bold text-[#3a3a32]">
            {isEditing ? "تعديل المقال" : "إضافة مقال جديد"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#6b6b5e] hover:bg-[#e8e4cf] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block font-[Amiri] text-sm font-medium text-[#3a3a32] mb-1.5">
              عنوان المقال <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="أدخل عنوان المقال"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4d1b8] bg-[#f5f0e1] font-[Amiri] text-sm text-[#3a3a32] placeholder:text-[#6b6b5e] focus:outline-none focus:border-[#87b0b6] transition-colors"
            />
          </div>

          {/* Newspaper + Date row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-[Amiri] text-sm font-medium text-[#3a3a32] mb-1.5">
                اسم الصحيفة / المجلة
              </label>
              <input
                type="text"
                value={form.newspaper}
                onChange={(e) => setForm({ ...form, newspaper: e.target.value })}
                placeholder="مثال: جريدة الاتحاد"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4d1b8] bg-[#f5f0e1] font-[Amiri] text-sm text-[#3a3a32] placeholder:text-[#6b6b5e] focus:outline-none focus:border-[#87b0b6] transition-colors"
              />
            </div>
            <div>
              <label className="block font-[Amiri] text-sm font-medium text-[#3a3a32] mb-1.5">
                تاريخ النشر
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4d1b8] bg-[#f5f0e1] font-[Amiri] text-sm text-[#3a3a32] focus:outline-none focus:border-[#87b0b6] transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-[Amiri] text-sm font-medium text-[#3a3a32] mb-1.5">
              التصنيف
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4d1b8] bg-[#f5f0e1] font-[Amiri] text-sm text-[#3a3a32] focus:outline-none focus:border-[#87b0b6] appearance-none cursor-pointer transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-[Amiri] text-sm font-medium text-[#3a3a32] mb-1.5">
              المقتطف{" "}
              <span className="text-[#6b6b5e] font-normal">(اختياري — يُولّد تلقائياً)</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="ملخص قصير للمقال يظهر في بطاقة المقال"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4d1b8] bg-[#f5f0e1] font-[Amiri] text-sm text-[#3a3a32] placeholder:text-[#6b6b5e] focus:outline-none focus:border-[#87b0b6] transition-colors resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block font-[Amiri] text-sm font-medium text-[#3a3a32] mb-1.5">
              نص المقال <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="اكتب نص المقال الكامل هنا..."
              rows={10}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4d1b8] bg-[#f5f0e1] font-[Amiri] text-sm text-[#3a3a32] placeholder:text-[#6b6b5e] focus:outline-none focus:border-[#87b0b6] transition-colors resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#d4d1b8]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border-2 border-[#d4d1b8] text-[#3a3a32] font-[Amiri] text-sm font-medium hover:bg-[#f5f0e1] transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onSave}
            disabled={!isValid || saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#3a3a32] text-white font-[Amiri] text-sm font-medium hover:bg-[#6a9199] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{saving ? "جاري الحفظ..." : isEditing ? "تحديث" : "حفظ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
