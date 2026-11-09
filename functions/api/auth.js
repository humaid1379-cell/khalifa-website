import {
  authenticate,
  checkLoginRate,
  createSession,
  passwordMatches,
  revokeSession,
  sessionCookie,
} from "../_lib/auth.js";
import {
  errorResponse,
  HttpError,
  json,
  readJson,
  requireSameOrigin,
} from "../_lib/http.js";

export async function onRequestGet(context) {
  try {
    return json({ success: true, authenticated: await authenticate(context) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function onRequestPost(context) {
  try {
    requireSameOrigin(context.request);
    await checkLoginRate(context);
    const { password } = await readJson(context.request, 4096);
    if (typeof password !== "string" || password.length > 1024)
      throw new HttpError(400, "بيانات تسجيل الدخول غير صالحة.");
    if (!(await passwordMatches(password, context.env.ADMIN_PASSWORD)))
      throw new HttpError(401, "كلمة المرور غير صحيحة.");
    const token = await createSession(context);
    return json({ success: true, authenticated: true }, 200, {
      "Set-Cookie": sessionCookie(token),
    });
  } catch (error) {
    const response = errorResponse(error);
    if (error?.status === 429) response.headers.set("Retry-After", "900");
    return response;
  }
}

export async function onRequestDelete(context) {
  try {
    requireSameOrigin(context.request);
    await revokeSession(context);
    return json({ success: true }, 200, { "Set-Cookie": sessionCookie("", 0) });
  } catch (error) {
    return errorResponse(error);
  }
}
