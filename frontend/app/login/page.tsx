"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Pre-fill default admin credentials as requested
  const [form, setForm] = useState({ username: "admin", password: "admin", remember: false });
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  // Simple password strength evaluation
  const passwordStrength = useMemo(() => {
    const pwd = form.password;
    if (!pwd) return { score: 0, label: "", pct: 0, color: "bg-slate-600" };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const pct = (score / 5) * 100;
    const labelMap = ["Too weak", "Weak", "Fair", "Good", "Strong", "Elite"];
    const colorMap = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-400", "bg-green-500", "bg-emerald-500"];
    return { score, label: labelMap[score], pct, color: colorMap[score] };
  }, [form.password]);

  function validate() {
    const e: typeof errors = {};
    if (!form.username) e.username = "Username is required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    setLoading(true);
    // Simple client-side check for default admin credentials
    const isAdmin = form.username === "admin" && form.password === "admin";
    if (isAdmin) {
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
      }, 600);
    } else {
      setTimeout(() => {
        setLoading(false);
        setErrors((prev) => ({ ...prev, password: "Invalid credentials" }));
      }, 500);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--dark-bg)]">
      <Header className="shadow-lg" showSearch={false} showUserMenu={false} />
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-10" aria-labelledby="login-heading">
        {/* Background gradient / decoration */}
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(67,56,202,0.25),transparent_60%)]" />
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="glass rounded-2xl shadow-xl p-8 backdrop-saturate-150 border border-[var(--dark-border)]/40 focus-within:ring-1 focus-within:ring-[var(--primary-600)]/60">
            <div className="mb-6 text-center space-y-1">
              <h1 id="login-heading" className="text-2xl font-semibold text-white tracking-tight">Sign in</h1>
              <p className="text-sm text-slate-300">Access your Operateev.ai dashboard</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-describedby="form-errors" role="form">
              
              {/* Username field */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-medium text-slate-200">Username</label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  aria-required="true"
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={`w-full rounded-md bg-[var(--dark-surface)]/70 border text-sm px-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:border-[var(--primary-600)] shadow-sm transition ${errors.username ? 'border-red-500/70' : 'border-[var(--dark-border)]/60'}`}
                  placeholder="Enter your username"
                />
                {errors.username && <p id="username-error" className="text-xs text-red-400 mt-0.5" role="alert">{errors.username}</p>}
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="text-xs text-[var(--primary-500)] hover:text-[var(--primary-400)] focus:outline-none inline-flex items-center gap-1"
                    aria-controls="password"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-required="true"
                    aria-invalid={!!errors.password}
                    aria-describedby={`${errors.password ? 'password-error ' : ''}password-strength-label`}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full rounded-md bg-[var(--dark-surface)]/70 border text-sm px-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:border-[var(--primary-600)] shadow-sm transition ${errors.password ? 'border-red-500/70' : 'border-[var(--dark-border)]/60'}`}
                    placeholder="••••••••"
                  />
                  {form.password && (
                    <div className="mt-2" aria-hidden>
                      <div className="h-1 w-full rounded-full bg-slate-700/50 overflow-hidden">
                        <div className={`h-full ${passwordStrength.color} transition-all duration-500`} style={{ width: `${passwordStrength.pct}%` }} />
                      </div>
                      <p id="password-strength-label" className="mt-1 text-[10px] tracking-wide text-slate-400 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>
                {errors.password && <p id="password-error" className="text-xs text-red-400 mt-0.5" role="alert">{errors.password}</p>}
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                    className="h-4 w-4 rounded border-[var(--dark-border)]/60 bg-[var(--dark-surface)]/70 text-[var(--primary-600)] focus:ring-[var(--primary-600)]"
                  />
                  Remember me
                </label>
                <button type="button" className="text-xs font-medium text-[var(--primary-500)] hover:text-[var(--primary-400)] focus:outline-none">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || (submitted && Object.keys(errors).length > 0)}
                className="relative inline-flex w-full justify-center items-center gap-2 rounded-md bg-[var(--primary-600)] hover:bg-[var(--primary-500)] disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[var(--primary-900)]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-600)] focus:ring-offset-[var(--dark-bg)] transition"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Don't have an account? </span>
              <Link href="/register" className="text-[var(--primary-500)] hover:text-[var(--primary-400)] font-medium">Create one</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer showStatus={false} />
    </div>
  );
}
