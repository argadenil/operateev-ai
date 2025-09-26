"use client";
import React, { useState } from "react";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
}

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "", confirm: "", agree: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function validate() {
    const e: typeof errors = {};
    if (!form.name) e.name = "Name required";
    if (!form.email) e.email = "Email required";
    if (!form.password) e.password = "Password required";
    if (form.password && form.password.length < 6) e.password = "Min 6 characters";
    if (!form.confirm) e.confirm = "Confirm password";
    if (form.password && form.confirm && form.password !== form.confirm) e.confirm = "Passwords do not match";
    if (!form.agree) e.agree = "You must accept";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Placeholder for backend request
    setTimeout(() => { setLoading(false); }, 900);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--dark-bg)]">
  <Header className="shadow-lg" showSearch={false} showUserMenu={false} />
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-10">
        <div className="absolute inset-0 -z-10 opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(67,56,202,0.25),transparent_60%)]" />
        </div>

        <div className="w-full max-w-lg animate-fade-in">
          <div className="glass rounded-2xl shadow-xl p-8 backdrop-saturate-150 border border-[var(--dark-border)]/40">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold text-white tracking-tight">Create Account</h1>
              <p className="text-sm text-slate-300 mt-1">Get started with Operateev.ai</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-sm font-medium text-slate-200">Full Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full rounded-md bg-[var(--dark-surface)]/70 border text-sm px-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:border-[var(--primary-600)] shadow-sm transition ${errors.name ? 'border-red-500/70' : 'border-[var(--dark-border)]/60'}`}
                placeholder="Jane Doe"
              />
              {errors.name && <p className="text-xs text-red-400 mt-0.5">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-200">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full rounded-md bg-[var(--dark-surface)]/70 border text-sm px-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:border-[var(--primary-600)] shadow-sm transition ${errors.email ? 'border-red-500/70' : 'border-[var(--dark-border)]/60'}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-red-400 mt-0.5">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`w-full rounded-md bg-[var(--dark-surface)]/70 border text-sm px-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:border-[var(--primary-600)] shadow-sm transition ${errors.password ? 'border-red-500/70' : 'border-[var(--dark-border)]/60'}`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="text-xs text-red-400 mt-0.5">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="confirm" className="block text-sm font-medium text-slate-200">Confirm</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="text-xs text-[var(--primary-500)] hover:text-[var(--primary-400)] focus:outline-none"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  className={`w-full rounded-md bg-[var(--dark-surface)]/70 border text-sm px-3 py-2.5 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] focus:border-[var(--primary-600)] shadow-sm transition ${errors.confirm ? 'border-red-500/70' : 'border-[var(--dark-border)]/60'}`}
                  placeholder="••••••••"
                />
                {errors.confirm && <p className="text-xs text-red-400 mt-0.5">{errors.confirm}</p>}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="agree"
                type="checkbox"
                checked={form.agree}
                onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-[var(--dark-border)]/60 bg-[var(--dark-surface)]/70 text-[var(--primary-600)] focus:ring-[var(--primary-600)]"
              />
              <label htmlFor="agree" className="text-xs text-slate-300 leading-relaxed">
                I agree to the <span className="text-[var(--primary-500)] hover:text-[var(--primary-400)] cursor-pointer">Terms of Service</span> and <span className="text-[var(--primary-500)] hover:text-[var(--primary-400)] cursor-pointer">Privacy Policy</span>.
                {errors.agree && <p className="text-xs text-red-400 mt-1">{errors.agree}</p>}
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative inline-flex w-full justify-center items-center gap-2 rounded-md bg-[var(--primary-600)] hover:bg-[var(--primary-500)] disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-[var(--primary-900)]/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-600)] focus:ring-offset-[var(--dark-bg)] transition"
            >
              {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              Create Account
            </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              <span>Already have an account? </span>
              <Link href="/login" className="text-[var(--primary-500)] hover:text-[var(--primary-400)] font-medium">Sign in</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer showStatus={false} />
    </div>
  );
}
