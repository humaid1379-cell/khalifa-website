import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  ArrowRight,
  Edit3,
  FileText,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addArticle,
  adminLogin,
  adminLogout,
  deleteArticle,
  fetchArticle,
  fetchArticles,
  generateId,
  getAllCategories,
  invalidateArticlesCache,
  updateArticle,
  type MutationResult,
  type StoredArticle,
} from "@/lib/articleStorage";

interface ArticleForm {
  title: string;
  newspaper: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}
const createEmptyForm = (): ArticleForm => ({
  title: "",
  newspaper: "",
  date: new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()),
  category: "رأي",
  excerpt: "",
  content: "",
});
const fieldClass =
  "w-full rounded-xl border border-[#455a5d]/30 bg-white px-4 py-3 text-base text-[#243c3f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#455a5d]";
const actionClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors disabled:cursor-wait disabled:opacity-50";
const formatDate = (date: string) =>
  new Date(`${date.slice(0, 10)}T12:00:00Z`).toLocaleDateString("ar-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [articles, setArticles] = useState<StoredArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingRevision, setEditingRevision] = useState(0);
  const [conflict, setConflict] = useState(false);
  const [draftId, setDraftId] = useState(generateId);
  const [form, setForm] = useState<ArticleForm>(createEmptyForm);
  const [initialForm, setInitialForm] = useState<ArticleForm>(createEmptyForm);
  const [deleteTarget, setDeleteTarget] = useState<StoredArticle | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [sessionExpired, setSessionExpired] = useState(false);
  const [password, setPassword] = useState("");
  const [reauthError, setReauthError] = useState("");
  const [reauthLoading, setReauthLoading] = useState(false);
  const dirty =
    showForm && JSON.stringify(form) !== JSON.stringify(initialForm);
  const categories = getAllCategories();
  const loadArticles = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    invalidateArticlesCache();
    try {
      setArticles(await fetchArticles());
    } catch (reason) {
      setLoadError(
        reason instanceof Error ? reason.message : "تعذّر تحميل المقالات."
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ar");
    return articles.filter(article =>
      [article.title, article.excerpt, article.newspaper || ""].some(value =>
        value.toLocaleLowerCase("ar").includes(term)
      )
    );
  }, [articles, query]);
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10);

  const openEditor = (article?: StoredArticle) => {
    const next = article
      ? {
          title: article.title,
          newspaper: article.newspaper || "",
          date: article.date.slice(0, 10),
          category: article.category,
          excerpt: article.excerpt,
          content: article.content,
        }
      : createEmptyForm();
    setForm(next);
    setInitialForm(next);
    setEditingId(article?.id || null);
    setEditingRevision(article?.revision || 0);
    setConflict(false);
    setDraftId(generateId());
    setError("");
    setShowForm(true);
  };
  const closeEditor = () => {
    if (
      saving ||
      (dirty && !window.confirm("لديك تغييرات لم تُحفظ. هل تريد إغلاق المحرر؟"))
    )
      return;
    setShowForm(false);
    setError("");
  };
  const mutationFailed = (result: MutationResult) => {
    setError(result.error || "تعذّر حفظ التغيير.");
    if (result.status === 401) {
      setSessionExpired(true);
      setReauthError("");
    }
  };
  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (saving || conflict) return;
    setSaving(true);
    setError("");
    setNotice("");
    const value = {
      ...form,
      title: form.title.trim(),
      content: form.content.trim(),
      excerpt: form.excerpt.trim() || form.content.trim().slice(0, 150),
      year: Number(form.date.slice(0, 4)),
    };
    try {
      const result = editingId
        ? await updateArticle(editingId, value, editingRevision)
        : await addArticle({ ...value, id: draftId });
      if (!result.success) {
        if (result.status === 409 || result.status === 428) {
          setConflict(true);
          setError(
            "تغيّرت نسخة المقال على الخادم. نصك باقٍ في المحرر ولم يُستبدل. انسخ التغييرات التي تريد الاحتفاظ بها، ثم حمّل أحدث نسخة وادمجها قبل الحفظ."
          );
        } else mutationFailed(result);
        return;
      }
      setShowForm(false);
      setInitialForm(form);
      setNotice(editingId ? "تم تحديث المقال بنجاح." : "تم نشر المقال بنجاح.");
      await loadArticles();
    } finally {
      setSaving(false);
    }
  };
  const loadLatestVersion = async () => {
    if (
      saving ||
      !window.confirm(
        "تحميل أحدث نسخة سيستبدل النص الحالي في المحرر. تأكد من نسخ تغييراتك أولاً. هل تريد المتابعة؟"
      )
    )
      return;
    setSaving(true);
    try {
      const latest = await fetchArticle(editingId || draftId);
      if (!latest) {
        setError("لم يعد المقال متاحاً. نصك باقٍ في المحرر؛ انسخه قبل إغلاقه.");
        return;
      }
      openEditor(latest);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "تعذّر تحميل أحدث نسخة. نصك باقٍ في المحرر."
      );
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async () => {
    if (!deleteTarget || saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await deleteArticle(
        deleteTarget.id,
        deleteTarget.revision
      );
      if (!result.success) {
        if ([404, 409, 428].includes(result.status || 0)) {
          setDeleteTarget(null);
          setError(
            result.status === 404
              ? "لم يعد المقال موجوداً. تم تحديث المكتبة."
              : "تغيّر المقال ولم يُحذف. تم تحديث المكتبة؛ راجع أحدث نسخة قبل محاولة الحذف مجدداً."
          );
          await loadArticles();
          return;
        }
        mutationFailed(result);
        return;
      }
      setDeleteTarget(null);
      setNotice("تم حذف المقال.");
      await loadArticles();
    } finally {
      setSaving(false);
    }
  };
  const handleLogout = async () => {
    if (
      dirty &&
      !window.confirm("لديك تغييرات لم تُحفظ. هل تريد تسجيل الخروج؟")
    )
      return;
    setSaving(true);
    setError("");
    try {
      await adminLogout();
      onLogout();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "تعذّر تسجيل الخروج."
      );
    } finally {
      setSaving(false);
    }
  };
  const reauthenticate = async (event: FormEvent) => {
    event.preventDefault();
    setReauthLoading(true);
    setReauthError("");
    try {
      await adminLogin(password);
      setPassword("");
      setSessionExpired(false);
      setError("");
      setNotice("تم تجديد الجلسة. يمكنك الآن حفظ المقال.");
    } catch (reason) {
      setReauthError(
        reason instanceof Error ? reason.message : "تعذّر تسجيل الدخول."
      );
    } finally {
      setReauthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1efd6] text-[#243c3f]" dir="rtl">
      <header className="bg-[#455a5d] text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="mb-1 text-xs text-[#f1efd6]">خارج النص</p>
            <h1 className="text-2xl font-bold">إدارة المقالات</h1>
          </div>
          <div className="flex gap-2">
            <a href="/" className={`${actionClass} text-white`}>
              <ArrowRight size={16} />
              الموقع
            </a>
            <button
              disabled={saving}
              onClick={handleLogout}
              className={`${actionClass} border border-white/40`}
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        {notice && (
          <p
            role="status"
            className="mb-5 rounded-xl border border-[#455a5d]/20 bg-white p-4"
          >
            {notice}
          </p>
        )}
        {error && !showForm && !deleteTarget && (
          <p
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800"
          >
            {error}
          </p>
        )}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">مكتبة المقالات</h2>
            <p className="mt-2 text-sm">
              {loadError
                ? "تعذّر تحديث المكتبة"
                : `${articles.length.toLocaleString("ar-AE")} مقال منشور`}
            </p>
          </div>
          <button
            onClick={() => openEditor()}
            className={`${actionClass} bg-[#455a5d] text-white hover:bg-[#243c3f]`}
          >
            <Plus size={18} />
            إضافة مقال جديد
          </button>
        </div>
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute right-4 top-3.5"
              size={18}
              aria-hidden="true"
            />
            <input
              className={`${fieldClass} pr-11`}
              aria-label="البحث في المقالات"
              placeholder="ابحث بعنوان المقال أو الصحيفة…"
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
          <button
            className={`${actionClass} border border-[#455a5d]/30 bg-white`}
            disabled={loading}
            onClick={loadArticles}
            aria-label="تحديث المقالات"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
        {loading ? (
          <p role="status" className="py-16 text-center">
            جاري تحميل المقالات…
          </p>
        ) : loadError ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-white p-8"
          >
            <h3 className="mb-2 text-xl font-bold">تعذّر تحميل المقالات</h3>
            <p>{loadError}</p>
            <button
              className={`${actionClass} mt-4 bg-[#455a5d] text-white`}
              onClick={loadArticles}
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl border border-[#455a5d]/20 bg-white">
              {visible.length ? (
                <ul className="divide-y divide-[#455a5d]/15">
                  {visible.map(article => (
                    <li
                      key={article.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6"
                    >
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words text-xl font-bold">
                          {article.title}
                        </h3>
                        <p className="mt-2 text-sm text-[#455a5d]">
                          {article.category} · {formatDate(article.date)}
                          {article.newspaper ? ` · ${article.newspaper}` : ""}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className={`${actionClass} border border-[#455a5d]/25`}
                          onClick={() => openEditor(article)}
                          aria-label={`تعديل ${article.title}`}
                        >
                          <Edit3 size={16} />
                          تعديل
                        </button>
                        <button
                          className={`${actionClass} text-red-800 hover:bg-red-50`}
                          onClick={() => {
                            setDeleteTarget(article);
                            setError("");
                          }}
                          aria-label={`حذف ${article.title}`}
                        >
                          <Trash2 size={16} />
                          حذف
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-16 text-center">
                  <FileText className="mx-auto mb-4" size={32} />
                  <h3 className="text-xl font-bold">
                    {query ? "لا توجد نتائج مطابقة" : "المكتبة جاهزة لأول مقال"}
                  </h3>
                  <p className="mt-3">
                    {query
                      ? "جرّب كلمات أخرى في البحث."
                      : "أضف مقالك من الزر أعلاه، وسيظهر على الموقع بعد حفظه."}
                  </p>
                </div>
              )}
            </div>
            {pages > 1 && (
              <nav
                className="mt-6 flex items-center justify-center gap-4"
                aria-label="صفحات المقالات"
              >
                <button
                  className={`${actionClass} border border-[#455a5d]/30`}
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  السابق
                </button>
                <p>
                  {currentPage} / {pages}
                </p>
                <button
                  className={`${actionClass} border border-[#455a5d]/30`}
                  disabled={currentPage === pages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  التالي
                </button>
              </nav>
            )}
          </>
        )}
      </main>
      <Dialog
        open={showForm}
        onOpenChange={open => {
          if (!open) closeEditor();
        }}
      >
        <DialogContent
          dir="rtl"
          showCloseButton={false}
          className="max-h-[90dvh] overflow-y-auto bg-[#f1efd6] sm:max-w-2xl"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogTitle className="text-2xl font-bold">
            {editingId ? "تعديل المقال" : "مقال جديد"}
          </DialogTitle>
          <DialogDescription className="text-[#455a5d]">
            سيظهر المقال للقراء بعد الحفظ. الحقول المعلّمة بنجمة مطلوبة.
          </DialogDescription>
          <form onSubmit={handleSave} className="space-y-5" aria-busy={saving}>
            {error && (
              <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-800">
                {error}
              </p>
            )}
            {conflict && (
              <button
                type="button"
                disabled={saving}
                onClick={loadLatestVersion}
                className={`${actionClass} border border-[#455a5d]/30`}
              >
                تحميل أحدث نسخة
              </button>
            )}
            <fieldset disabled={saving} className="min-w-0 space-y-5">
              <legend className="sr-only">بيانات المقال</legend>
              <Field label="عنوان المقال *" id="article-title">
                <input
                  id="article-title"
                  className={fieldClass}
                  required
                  maxLength={300}
                  value={form.title}
                  onChange={event =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="الصحيفة أو المجلة" id="article-newspaper">
                  <input
                    id="article-newspaper"
                    className={fieldClass}
                    maxLength={300}
                    value={form.newspaper}
                    onChange={event =>
                      setForm({ ...form, newspaper: event.target.value })
                    }
                  />
                </Field>
                <Field label="تاريخ النشر *" id="article-date">
                  <input
                    id="article-date"
                    type="date"
                    dir="ltr"
                    className={fieldClass}
                    required
                    value={form.date}
                    onChange={event =>
                      setForm({ ...form, date: event.target.value })
                    }
                  />
                </Field>
              </div>
              <Field label="التصنيف *" id="article-category">
                <select
                  id="article-category"
                  className={fieldClass}
                  required
                  value={form.category}
                  onChange={event =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  {Array.from(new Set([form.category, ...categories]))
                    .filter(Boolean)
                    .map(category => (
                      <option key={category}>{category}</option>
                    ))}
                </select>
              </Field>
              <Field label="مقتطف قصير (اختياري)" id="article-excerpt">
                <textarea
                  id="article-excerpt"
                  className={fieldClass}
                  rows={3}
                  maxLength={1500}
                  value={form.excerpt}
                  onChange={event =>
                    setForm({ ...form, excerpt: event.target.value })
                  }
                />
              </Field>
              <Field label="نص المقال *" id="article-content">
                <textarea
                  id="article-content"
                  className={`${fieldClass} leading-loose`}
                  rows={12}
                  required
                  maxLength={100000}
                  value={form.content}
                  onChange={event =>
                    setForm({ ...form, content: event.target.value })
                  }
                />
              </Field>
              <div className="flex flex-wrap gap-3 border-t border-[#455a5d]/20 pt-5">
                <button
                  type="submit"
                  disabled={
                    saving ||
                    conflict ||
                    !form.title.trim() ||
                    !form.content.trim()
                  }
                  className={`${actionClass} bg-[#455a5d] text-white`}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving
                    ? "جاري الحفظ…"
                    : editingId
                      ? "حفظ التعديلات"
                      : "نشر المقال"}
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={closeEditor}
                  className={`${actionClass} border border-[#455a5d]/30`}
                >
                  إلغاء
                </button>
              </div>
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={open => {
          if (!open && !saving) setDeleteTarget(null);
        }}
      >
        <DialogContent
          dir="rtl"
          showCloseButton={false}
          className="bg-[#f1efd6]"
        >
          <DialogTitle>حذف المقال</DialogTitle>
          <DialogDescription className="text-[#455a5d]">
            هل تريد حذف «{deleteTarget?.title}»؟ لا يمكن التراجع عن الحذف.
          </DialogDescription>
          {error && (
            <p role="alert" className="text-red-800">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button
              autoFocus
              disabled={saving}
              className={`${actionClass} border border-[#455a5d]/30`}
              onClick={() => setDeleteTarget(null)}
            >
              إلغاء
            </button>
            <button
              disabled={saving}
              className={`${actionClass} bg-red-800 text-white`}
              onClick={handleDelete}
            >
              {saving ? "جاري الحذف…" : "حذف المقال"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={sessionExpired} onOpenChange={setSessionExpired}>
        <DialogContent
          dir="rtl"
          showCloseButton={false}
          className="bg-[#f1efd6]"
          onInteractOutside={event => event.preventDefault()}
        >
          <DialogTitle>تجديد جلسة الدخول</DialogTitle>
          <DialogDescription className="text-[#455a5d]">
            انتهت الجلسة. نص المقال باقٍ في المحرر. سجّل الدخول ثم احفظه مجدداً.
          </DialogDescription>
          <form onSubmit={reauthenticate} className="space-y-4">
            <Field label="كلمة المرور" id="reauth-password">
              <input
                id="reauth-password"
                className={fieldClass}
                type="password"
                dir="ltr"
                autoComplete="current-password"
                required
                maxLength={1024}
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </Field>
            {reauthError && (
              <p role="alert" className="text-red-800">
                {reauthError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                disabled={reauthLoading}
                className={`${actionClass} bg-[#455a5d] text-white`}
              >
                {reauthLoading ? "جاري التحقق…" : "تسجيل الدخول"}
              </button>
              <button
                type="button"
                className={`${actionClass} border border-[#455a5d]/30`}
                onClick={() => setSessionExpired(false)}
              >
                العودة للمحرر
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}
