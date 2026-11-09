import { json } from "../_lib/http.js";

// Sample content is never published automatically. Existing articles are untouched.
export function onRequest() {
  return json(
    {
      success: false,
      error:
        "إضافة المقالات النموذجية غير متاحة. استخدم محرر المقالات لإضافة محتوى حقيقي.",
    },
    410
  );
}
