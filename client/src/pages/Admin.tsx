/*
 * Admin Page — wraps login and dashboard
 * Checks auth state and shows appropriate view
 */
import { useState, useEffect } from "react";
import { isAdminAuthenticated } from "@/lib/articleStorage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import Navbar from "@/components/Navbar";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex flex-col bg-[#87b0b6]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#f1efd6]/30 border-t-[#f1efd6] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <AdminLogin onSuccess={() => setAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AdminDashboard onLogout={() => setAuthenticated(false)} />
    </div>
  );
}
