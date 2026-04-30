/*
 * Admin Page — wraps login and dashboard
 * Checks auth state and shows appropriate view
 */
import { useState, useEffect } from "react";
import { isAdminAuthenticated } from "@/lib/articleStorage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#87b0b6]">
        <div className="w-8 h-8 border-3 border-[#f5f0e1]/30 border-t-[#f5f0e1] rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}
