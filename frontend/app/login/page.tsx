"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Loader from "../components/loader";
import { useToast } from "../components/toaster";

// Base URL for backend API. Must be provided via env: NEXT_PUBLIC_API_BASE
const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string;

export default function LoginPage() {
  const router = useRouter();
  const { success, error: pushError } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    try {
      const t = localStorage.getItem("auth_token");
      if (t) {
        router.replace("/dashboard");
        return; // don't unset checkingAuth to avoid flicker
      }
    } catch { }
    setCheckingAuth(false);
  }, [router]);

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password) {
      const msg = "Username and password are required";
      setError(msg);
      pushError(msg, { title: "Missing fields" });
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.username.trim(), password: form.password }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = data.error || "Login failed";
        setError(msg);
        pushError(msg, { title: "Login failed" });
        return;
      }

      if (!data.token) {
        const msg = "Invalid response from server";
        setError(msg);
        pushError(msg, { title: "Login error" });
        return;
      }

      try {
        localStorage.setItem("auth_token", data.token);
      } catch { }

      localStorage.setItem("customer_id", data.customer_id);
      localStorage.setItem("username", data.username);
      success(`Welcome ${data.username}`, { title: "Login successful" });
      router.push("/dashboard/" + data.customer_id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error";
      setError(msg);
      pushError(msg, { title: "Login error" });
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--dark-bg)]">
      <Header className="shadow-lg" showSearch={false} showUserMenu={false} />

      <main className="flex-grow flex items-center justify-center relative px-4 py-10">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(67,56,202,0.25),transparent_60%)]" />
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="glass rounded-2xl shadow-xl p-8 backdrop-saturate-150 border border-[var(--dark-border)]/40">
            <div className="mb-6 text-center space-y-1">
              <h1 className="text-2xl font-semibold text-white">Sign in</h1>
              <p className="text-sm text-slate-300">Access your Operateev.ai dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm text-slate-200">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-md bg-[var(--dark-surface)]/70 border border-[var(--dark-border)]/60 text-sm px-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] shadow-sm"
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-xs text-[var(--primary-500)] hover:text-[var(--primary-400)] focus:outline-none flex items-center gap-1"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-md bg-[var(--dark-surface)]/70 border border-[var(--dark-border)]/60 text-sm px-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] shadow-sm"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              {/* Error */}
              {error && <p className="text-xs text-red-400" role="alert">{error}</p>}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative hover:cursor-pointer inline-flex w-full justify-center items-center gap-2 rounded-md bg-[var(--primary-600)] hover:bg-[var(--primary-500)] disabled:opacity-60 px-4 py-2.5 text-sm font-medium text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-600)] focus:ring-offset-[var(--dark-bg)] transition"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Don&apos;t have an account? </span>
              <Link href="/register" className="text-[var(--primary-500)] hover:text-[var(--primary-400)] font-medium">
                Create one
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer showStatus={false} />
    </div>
  );
}
