/*
 * Admin Dashboard — Arabic RTL, green theme
 * Full CRUD for articles with table view, search, and modal forms
 */
import { useState, useMemo, useCallback } from "react";
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
} from "lucide-react";
import {
  getStoredArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  getAllCategories,
  generateId,
  adminLogout,
  type StoredArticle,
} from "@/lib/articleStorage";
import { articles as hardcodedArticles } from "@/data/articles";

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
  const [articles, setArticles] = useState<StoredArticle[]>(getStoredArticles());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  const categories = getAllCategories();

  // Combine stored + hardcoded for display
  const allArticles = useMemo(() => {
    const stored = articles.map((a) => ({ ...a, isHardcoded: false }));
    const hardcoded = hardcodedArticles.map((a) => ({
      ...a,
      newspaper: "",
      isHardcoded: true,
    }));
    return [...stored, ...hardcoded];
  }, [articles]);

  // Filter by search
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return allArticles;
    const q = searchQuery.toLowerCase();
    return allArticles.filter(
      (a) =>
        a.title.includes(q) ||
        a.excerpt.includes(q) ||
        (a.newspaper && a.newspaper.includes(q))
    );
  }, [allArticles, searchQuery]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
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

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;

    const year = new Date(form.date).getFullYear();

    if (editingId) {
      // Update existing
      updateArticle(editingId, {
        title: form.title.trim(),
        newspaper: form.newspaper.trim(),
        date: form.date,
        category: form.category,
        excerpt: form.excerpt.trim() || form.content.trim().substring(0, 150) + "...",
        content: form.content.trim(),
        year,
      });
      showSuccess("تم تحديث المقال بنجاح");
    } else {
      // Add new
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
      addArticle(newArticle);
      showSuccess("تم إضافة المقال بنجاح");
    }

    setArticles(getStoredArticles());
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    deleteArticle(id);
    setArticles(getStoredArticles());
    setDeleteConfirm(null);
    showSuccess("تم حذف المقال بنجاح");
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
    <div className="min-h-screen bg-[#f7f5f2]">
      {/* Top Bar */}
      <header className="bg-[#0d3b1f] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={22} className="text-[#7cc89a]" />
            <h1 className="font-[Amiri] text-xl font-bold">لوحة إدارة المقالات</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 text-[#7cc89a] hover:text-white font-[Cairo] text-sm transition-colors"
            >
              <ArrowRight size={14} />
              <span>الموقع</span>
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-100 font-[Cairo] text-sm transition-colors"
            >
              <LogOut size={14} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0d3b1f] text-white px-6 py-3 rounded-xl shadow-xl font-[Cairo] text-sm animate-[fadeIn_0.3s_ease]">
          {successMsg}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            label="إجمالي المقالات"
            value={allArticles.length}
            icon={<FileText size={20} />}
          />
          <StatCard
            label="مقالات مضافة"
            value={articles.length}
            icon={<Plus size={20} />}
          />
          <StatCard
            label="مقالات نموذجية"
            value={hardcodedArticles.length}
            icon={<FileText size={20} />}
          />
          <StatCard
            label="التصنيفات"
            value={categories.length}
            icon={<FileText size={20} />}
          />
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#d4edda] mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7aa88e]"
              />
              <input
                type="text"
                placeholder="ابحث في المقالات..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] placeholder:text-[#7aa88e] focus:outline-none focus:border-[#2e7d4a] focus:ring-1 focus:ring-[#2e7d4a] transition-colors"
              />
            </div>

            {/* Add button */}
            <button
              onClick={handleAdd}
              className="inline-flex items-center justify-center gap-2 bg-[#0d3b1f] text-white px-5 py-2.5 rounded-lg font-[Cairo] text-sm font-medium hover:bg-[#1b5e30] transition-colors shadow-md"
            >
              <Plus size={18} />
              <span>إضافة مقال جديد</span>
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl shadow-sm border border-[#d4edda] overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f0f7f2] border-b border-[#d4edda]">
                  <th className="text-right px-4 py-3 font-[Cairo] text-xs font-semibold text-[#0d3b1f] uppercase tracking-wider">
                    العنوان
                  </th>
                  <th className="text-right px-4 py-3 font-[Cairo] text-xs font-semibold text-[#0d3b1f] uppercase tracking-wider">
                    الصحيفة
                  </th>
                  <th className="text-right px-4 py-3 font-[Cairo] text-xs font-semibold text-[#0d3b1f] uppercase tracking-wider">
                    التصنيف
                  </th>
                  <th className="text-right px-4 py-3 font-[Cairo] text-xs font-semibold text-[#0d3b1f] uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="text-right px-4 py-3 font-[Cairo] text-xs font-semibold text-[#0d3b1f] uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="text-center px-4 py-3 font-[Cairo] text-xs font-semibold text-[#0d3b1f] uppercase tracking-wider">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedArticles.map((article, i) => (
                  <tr
                    key={article.id}
                    className={`border-b border-[#e8f0ec] hover:bg-[#f8faf9] transition-colors ${
                      i % 2 === 0 ? "bg-white" : "bg-[#fafcfb]"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-[Cairo] text-sm text-[#0d3b1f] font-medium line-clamp-1 max-w-xs">
                        {article.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[Cairo] text-xs text-[#4a6b5a]">
                        {article.newspaper || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block font-[Tajawal] text-xs bg-[#e8f5e9] text-[#1b6b3a] px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-[Tajawal] text-xs text-[#7aa88e]">
                        {formatDate(article.date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {article.isHardcoded ? (
                        <span className="font-[Cairo] text-xs text-[#7aa88e]">نموذجي</span>
                      ) : (
                        <span className="font-[Cairo] text-xs text-[#2e7d4a] font-medium">
                          مضاف
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {!article.isHardcoded && (
                          <>
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-1.5 rounded-lg text-[#2e7d4a] hover:bg-[#e8f5e9] transition-colors"
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
                          </>
                        )}
                        {article.isHardcoded && (
                          <span className="font-[Cairo] text-xs text-[#aaa]">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedArticles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <p className="font-[Cairo] text-[#7aa88e]">لا توجد مقالات</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#e8f0ec]">
            {paginatedArticles.map((article) => (
              <div key={article.id} className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-[Cairo] text-sm font-medium text-[#0d3b1f] line-clamp-2 flex-1">
                    {article.title}
                  </h3>
                  {!article.isHardcoded && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(article)}
                        className="p-1.5 rounded-lg text-[#2e7d4a] hover:bg-[#e8f5e9]"
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
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-[Tajawal] text-xs bg-[#e8f5e9] text-[#1b6b3a] px-2 py-0.5 rounded-full">
                    {article.category}
                  </span>
                  <span className="font-[Tajawal] text-xs text-[#7aa88e]">
                    {formatDate(article.date)}
                  </span>
                  {article.newspaper && (
                    <span className="font-[Cairo] text-xs text-[#4a6b5a]">
                      {article.newspaper}
                    </span>
                  )}
                  {article.isHardcoded && (
                    <span className="font-[Cairo] text-xs text-[#aaa]">نموذجي</span>
                  )}
                </div>
              </div>
            ))}
            {paginatedArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="font-[Cairo] text-[#7aa88e]">لا توجد مقالات</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-[#e8f0ec]">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-[#d4edda] flex items-center justify-center text-[#2e7d4a] hover:bg-[#e8f5e9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <span className="font-[Tajawal] text-sm text-[#4a6b5a]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-[#d4edda] flex items-center justify-center text-[#2e7d4a] hover:bg-[#e8f5e9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Article Form Modal */}
      {showForm && (
        <ArticleFormModal
          form={form}
          setForm={setForm}
          categories={categories}
          isEditing={!!editingId}
          onSave={handleSave}
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
            <h3 className="font-[Amiri] text-xl font-bold text-[#0d3b1f] mb-3">
              تأكيد الحذف
            </h3>
            <p className="font-[Cairo] text-sm text-[#4a6b5a] mb-6">
              هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-[Cairo] text-sm font-medium hover:bg-red-700 transition-colors"
              >
                حذف
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-[#d4edda] text-[#0d3b1f] font-[Cairo] text-sm font-medium hover:bg-[#f8faf9] transition-colors"
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
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#d4edda]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#e8f5e9] flex items-center justify-center text-[#2e7d4a]">
          {icon}
        </div>
        <div>
          <p className="font-[Cairo] text-2xl font-bold text-[#0d3b1f]">{value}</p>
          <p className="font-[Cairo] text-xs text-[#7aa88e]">{label}</p>
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
  onClose,
}: {
  form: ArticleForm;
  setForm: (f: ArticleForm) => void;
  categories: string[];
  isEditing: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const isValid = form.title.trim() && form.content.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e8f0ec]">
          <h2 className="font-[Amiri] text-xl font-bold text-[#0d3b1f]">
            {isEditing ? "تعديل المقال" : "إضافة مقال جديد"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#7aa88e] hover:bg-[#f0f7f2] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block font-[Cairo] text-sm font-medium text-[#0d3b1f] mb-1.5">
              عنوان المقال <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="أدخل عنوان المقال"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] placeholder:text-[#7aa88e] focus:outline-none focus:border-[#2e7d4a] transition-colors"
            />
          </div>

          {/* Newspaper + Date row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-[Cairo] text-sm font-medium text-[#0d3b1f] mb-1.5">
                اسم الصحيفة / المجلة
              </label>
              <input
                type="text"
                value={form.newspaper}
                onChange={(e) => setForm({ ...form, newspaper: e.target.value })}
                placeholder="مثال: جريدة الاتحاد"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] placeholder:text-[#7aa88e] focus:outline-none focus:border-[#2e7d4a] transition-colors"
              />
            </div>
            <div>
              <label className="block font-[Cairo] text-sm font-medium text-[#0d3b1f] mb-1.5">
                تاريخ النشر
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] focus:outline-none focus:border-[#2e7d4a] transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-[Cairo] text-sm font-medium text-[#0d3b1f] mb-1.5">
              التصنيف
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] focus:outline-none focus:border-[#2e7d4a] appearance-none cursor-pointer transition-colors"
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
            <label className="block font-[Cairo] text-sm font-medium text-[#0d3b1f] mb-1.5">
              المقتطف{" "}
              <span className="text-[#7aa88e] font-normal">(اختياري — يُولّد تلقائياً)</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              placeholder="ملخص قصير للمقال يظهر في بطاقة المقال"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] placeholder:text-[#7aa88e] focus:outline-none focus:border-[#2e7d4a] transition-colors resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block font-[Cairo] text-sm font-medium text-[#0d3b1f] mb-1.5">
              نص المقال <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="اكتب نص المقال الكامل هنا..."
              rows={10}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-[#d4edda] bg-[#f8faf9] font-[Cairo] text-sm text-[#0d3b1f] placeholder:text-[#7aa88e] focus:outline-none focus:border-[#2e7d4a] transition-colors resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#e8f0ec]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border-2 border-[#d4edda] text-[#0d3b1f] font-[Cairo] text-sm font-medium hover:bg-[#f8faf9] transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onSave}
            disabled={!isValid}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d3b1f] text-white font-[Cairo] text-sm font-medium hover:bg-[#1b5e30] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Save size={16} />
            <span>{isEditing ? "تحديث" : "حفظ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
