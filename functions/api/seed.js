/**
 * Cloudflare Pages Function — /api/seed
 * POST: Seed the database with built-in sample articles (admin auth required)
 *
 * This endpoint has sample articles embedded directly so it always works.
 * It also accepts additional articles in the request body (optional).
 * Does NOT use the 'year' column — computed from date on the fly.
 */

const ADMIN_PASSWORD = "Khalifa@2025";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function checkAuth(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  return authHeader.slice(7) === ADMIN_PASSWORD;
}

// Built-in sample articles — always available for seeding
const SAMPLE_ARTICLES = [
  {
    id: "sample-1",
    title: "مرحباً بكم في موقع خليفة جمعة الرميثي",
    excerpt: "هذا مقال نموذجي يوضح كيفية عرض المقالات على الموقع. يمكن للمدير إضافة المقالات الحقيقية من خلال لوحة الإدارة.",
    content: `هذا مقال نموذجي لإظهار كيفية عمل الموقع.

لإضافة مقالاتك الحقيقية، يرجى:
١. الانتقال إلى لوحة الإدارة على الرابط: /admin
٢. تسجيل الدخول بكلمة المرور
٣. الضغط على "إضافة مقال جديد"

جميع المقالات المضافة من لوحة الإدارة ستظهر تلقائياً لجميع زوار الموقع على جميع الأجهزة.`,
    date: "2025-01-01",
    category: "رأي",
    newspaper: "",
  },
  {
    id: "sample-2",
    title: "الإعلام الرقمي وتحديات المستقبل",
    excerpt: "يشهد الإعلام الرقمي تحولات جذرية تعيد تشكيل طريقة تلقي المحتوى وإنتاجه، مما يفرض على الصحفيين والكتّاب تطوير مهاراتهم باستمرار.",
    content: `يشهد الإعلام الرقمي تحولات جذرية تعيد تشكيل طريقة تلقي المحتوى وإنتاجه.

في ظل هذه التحولات، يجد الصحفيون والكتّاب أنفسهم أمام تحديات جديدة تتطلب التكيف المستمر مع الأدوات الرقمية والمنصات الاجتماعية.

الإعلام الرقمي لم يعد مجرد نقل للمعلومة، بل أصبح تجربة تفاعلية متكاملة تشمل الصوت والصورة والنص في آنٍ واحد.`,
    date: "2025-03-15",
    category: "ثقافة",
    newspaper: "صحيفة البيان",
  },
  {
    id: "sample-3",
    title: "الاقتصاد الإماراتي ومسيرة التنويع",
    excerpt: "تواصل الإمارات مسيرتها نحو اقتصاد متنوع يتجاوز الاعتماد على النفط، مستندةً إلى رؤية استراتيجية طموحة تضع الابتكار في صدارة أولوياتها.",
    content: `تواصل الإمارات مسيرتها نحو اقتصاد متنوع يتجاوز الاعتماد على النفط.

تستند هذه المسيرة إلى رؤية استراتيجية طموحة تضع الابتكار والتكنولوجيا في صدارة الأولويات، وتسعى إلى بناء بيئة أعمال جاذبة للاستثمارات العالمية.

القطاعات غير النفطية باتت تمثل الجزء الأكبر من الناتج المحلي الإجمالي، وهو مؤشر واضح على نجاح سياسات التنويع الاقتصادي.`,
    date: "2025-06-10",
    category: "اقتصاد",
    newspaper: "الاتحاد",
  },
];

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  if (!checkAuth(context.request)) {
    return jsonResponse({ success: false, error: "غير مصرح" }, 401);
  }

  try {
    // Use built-in sample articles; optionally merge with any sent in body
    let articlesToSeed = [...SAMPLE_ARTICLES];
    try {
      const body = await context.request.json();
      if (body.articles && Array.isArray(body.articles) && body.articles.length > 0) {
        // Merge body articles with samples, avoiding duplicates by id
        const bodyIds = new Set(body.articles.map((a) => a.id));
        const uniqueSamples = articlesToSeed.filter((a) => !bodyIds.has(a.id));
        articlesToSeed = [...body.articles, ...uniqueSamples];
      }
    } catch {
      // No body or invalid JSON — use sample articles only
    }

    // Check how many articles already exist
    const { results: existing } = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM articles"
    ).all();
    const existingCount = existing[0]?.count || 0;

    let inserted = 0;
    let skipped = 0;
    for (const article of articlesToSeed) {
      try {
        await context.env.DB.prepare(
          `INSERT OR IGNORE INTO articles (id, title, excerpt, content, date, category, newspaper)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            article.id,
            article.title,
            article.excerpt || "",
            article.content,
            article.date,
            article.category || "رأي",
            article.newspaper || ""
          )
          .run();
        inserted++;
      } catch (e) {
        skipped++;
      }
    }

    return jsonResponse({
      success: true,
      message: `تم إضافة ${inserted} مقال بنجاح. كان هناك ${existingCount} مقال موجود مسبقاً.`,
      inserted,
      skipped,
      existingCount,
    });
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
