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
      <div className="min-h-screen flex items-center justify-center bg-[#0d3b1f]">
        <div className="w-8 h-8 border-3 border-[#7cc89a]/30 border-t-[#7cc89a] rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}
