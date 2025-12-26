"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/services/adminApi";
import Image from "next/image";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Updated to match the actual response structure of `adminLogin`
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const session = await adminLogin(username, password);
      if (!session?.session?.accessToken) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }
      // Save full login response (user and session) for later use
      sessionStorage.setItem("dalrotti_admin_auth", JSON.stringify(session));
      sessionStorage.setItem("dalrotti_admin_token", session.session.accessToken);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Network error. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8f6] via-[#f7eaea] to-[#ffe5e5] relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7a1313]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#7a1313]/20 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <div className="relative z-10 w-full max-w-sm mx-auto p-8 bg-white/90 rounded-2xl shadow-2xl border border-[#f3e0e0] backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Dal Rotti Logo"
            width={64}
            height={64}
            className="mb-2 rounded-full shadow"
          />
          <h1 className="text-3xl font-extrabold text-[#7a1313] tracking-tight mb-1">Dal Rotti Admin</h1>
          <span className="text-xs text-gray-500 font-semibold tracking-wide">Sign in to manage your restaurant</span>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1313]/40 transition"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1313]/40 transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
          <button
            type="submit"
            className="w-full bg-[#7a1313] hover:bg-[#a31e1e] text-white py-2 rounded-lg font-bold shadow transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-6 text-center">Role-based access will be implemented.</p>
      </div>
    </div>
  );
}
