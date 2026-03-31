/**
 * Cloudflare Pages Function — /api/auth
 * POST: Verify admin password and return a token
 */

const ADMIN_PASSWORD = "Khalifa@2025";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// POST /api/auth — verify password
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      return jsonResponse({
        success: true,
        token: ADMIN_PASSWORD, // Simple token-based auth
        message: "تم تسجيل الدخول بنجاح",
      });
    }

    return jsonResponse({ success: false, error: "كلمة المرور غير صحيحة" }, 401);
  } catch (error) {
    return jsonResponse({ success: false, error: error.message }, 500);
  }
}
