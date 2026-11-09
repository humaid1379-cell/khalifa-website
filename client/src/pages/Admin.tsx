import { useState, useEffect } from "react";
import { isAdminAuthenticated } from "@/lib/articleStorage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    isAdminAuthenticated()
      .then(value => {
        if (active) setAuthenticated(value);
      })
      .catch(reason => {
        if (active)
          setError(
            reason instanceof Error ? reason.message : "تعذّر التحقق من الجلسة."
          );
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => {
      active = false;
    };
  }, []);
  if (checking)
    return (
      <main
        className="min-h-screen flex items-center justify-center bg-[#f1efd6]"
        role="status"
      >
        <p>جاري التحقق من الجلسة…</p>
      </main>
    );
  if (!authenticated)
    return (
      <AdminLogin
        initialError={error}
        onSuccess={() => {
          setError("");
          setAuthenticated(true);
        }}
      />
    );
  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}
