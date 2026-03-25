"use client"
import React, { useState } from "react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"

export default function LoginPage() {
  const router = useRouter()
  const [user, setUser] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post("/api/users/login", user, { withCredentials: true })
      toast.success(`Welcome back, ${response.data.user.username}!`)
      try { router.refresh() } catch (_) {}
      const params = new URLSearchParams(window.location.search)
      router.push(params.get("from") || "/")
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Authentication Failed"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen overflow-hidden bg-[#06060e] font-mono"
      style={{ fontFamily: "'Space Mono', 'Courier New', monospace" }}
    >
      {/* ── Subtle dot-grid background ── */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(197,251,69,0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── Ambient glow blobs ── */}
      <div
        className="pointer-events-none fixed"
        style={{
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
          top: "-120px",
          right: "-80px",
        }}
      />
      <div
        className="pointer-events-none fixed"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197,251,69,0.1) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-60px",
        }}
      />

      {/* ── Nav bar (mirrors homepage) ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-zinc-800/60 bg-[#06060e]/80 backdrop-blur-xl">
        <Link href="/" className="text-white text-sm font-black tracking-[0.2em] uppercase hover:text-[#c5fb45] transition-colors">
          BAZAAR
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="border border-zinc-700 px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-300 hover:border-[#c5fb45] hover:text-[#c5fb45] transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ── Left panel — brand copy ── */}
      <div className="hidden lg:flex flex-col justify-center flex-1 px-20 pt-24">
        {/* NEW badge */}
        <div className="mb-6 flex items-center gap-3">
          <span className="bg-[#c5fb45] text-black text-[10px] font-black px-2 py-0.5 tracking-widest uppercase">
            NEW
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-zinc-400">
            Private Marketplace Rooms
          </span>
        </div>

        {/* Hero headline — mirrors homepage type scale */}
        <div className="leading-none">
          <p className="text-[80px] font-black uppercase text-white tracking-tight">TRADE</p>
          <p className="text-[80px] font-black uppercase tracking-tight" style={{ color: "#8b5cf6" }}>
            WITH YOUR
          </p>
          <p className="text-[80px] font-black uppercase tracking-tight" style={{ color: "#c5fb45" }}>
            CIRCLE
          </p>
          <p className="text-[80px] font-black uppercase tracking-tight text-zinc-700">
            NOT THE WHOLE
          </p>
          <p className="text-[80px] font-black uppercase tracking-tight text-zinc-700">WORLD</p>
        </div>

        {/* Live status pill */}
        <div
          className="mt-10 inline-flex items-center gap-2 border border-zinc-700 bg-zinc-900/60 px-4 py-2"
          style={{ width: "fit-content" }}
        >
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Status</span>
          <span className="flex items-center gap-1.5 text-[#c5fb45] text-[10px] font-bold uppercase tracking-widest">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#c5fb45]"
              style={{ boxShadow: "0 0 6px #c5fb45" }}
            />
            Live
          </span>
        </div>
      </div>

      {/* ── Right panel — login card ── */}
      <div className="flex flex-1 items-center justify-center px-6 pt-28 pb-12 lg:max-w-[520px] lg:border-l lg:border-zinc-800/60">
        <div className="relative w-full max-w-md">
          {/* Corner brackets */}
          <div className="absolute -left-2 -top-2 h-5 w-5 border-l-2 border-t-2 border-[#c5fb45]" />
          <div className="absolute -right-2 -bottom-2 h-5 w-5 border-r-2 border-b-2 border-[#c5fb45]" />
          {/* Faint right accent lines (like the hero illustration) */}
          <div
            className="pointer-events-none absolute -right-6 top-1/4"
            style={{ width: 3, height: 60, background: "#8b5cf6", opacity: 0.5, transform: "skewY(-30deg)" }}
          />
          <div
            className="pointer-events-none absolute -right-10 top-1/3"
            style={{ width: 3, height: 40, background: "#c5fb45", opacity: 0.4, transform: "skewY(-30deg)" }}
          />

          {/* Header */}
          <div className="mb-10">
            <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              Identity Verification Required
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">
              SIGN_
              <span style={{ color: "#c5fb45" }}>IN</span>
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={onLogin} className="space-y-8">
            {/* Email */}
            <div className="group">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#c5fb45]">
                Email_Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full border-b border-zinc-700 bg-transparent pb-3 pt-1 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#c5fb45]"
                />
                <div className="absolute bottom-0 left-0 h-px w-0 bg-[#c5fb45] transition-all duration-300 group-focus-within:w-full" />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#c5fb45]">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[9px] uppercase tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full border-b border-zinc-700 bg-transparent pb-3 pt-1 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-[#c5fb45]"
                />
                <div className="absolute bottom-0 left-0 h-px w-0 bg-[#c5fb45] transition-all duration-300 group-focus-within:w-full" />
              </div>
            </div>

            {/* Room-code style CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="relative w-full overflow-hidden bg-[#c5fb45] py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-all hover:bg-[#d4ff6b] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Authenticating...
                  </span>
                ) : (
                  "Initialize_Login →"
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-10 border-t border-zinc-800 pt-6 text-center">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600">
              No records found?{" "}
              <Link
                href="/signup"
                className="font-bold text-white hover:text-[#c5fb45] transition-colors"
              >
                Create_Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}