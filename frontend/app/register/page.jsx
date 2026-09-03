"use client";
import { useState } from "react";
import { API_URL } from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      const userName =
        res.data.user?.name || res.data.name || res.data.username || name;
      localStorage.setItem("userName", userName);

      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-gray-50 px-4 py-8 !bg-[#ff9701]">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 z-0"></div>

      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleRegister}
          autoComplete="off"
          className="bg-orange-500 p-8 md:p-10 rounded-3xl shadow-2xl shadow-orange-500/20 border border-orange-400 text-white"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center text-white leading-tight">
            Create Account
          </h2>
          <p className="text-center text-sm text-orange-100 mb-8 font-medium">
            Join{" "}
            <span className="text-white font-bold tracking-wide">
              Citi Estate
            </span>{" "}
            today
          </p>

          {error && (
            <p className="bg-red-500/20 text-white border border-red-200/40 p-3 rounded-xl mb-5 text-sm text-center backdrop-blur-sm font-medium">
              {error}
            </p>
          )}

          <div className="mb-5">
            <label className="block text-orange-100 text-sm font-semibold mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-orange-400 pointer-events-none">
                <User size={18} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 pl-11 border border-orange-400/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-orange-500 placeholder-orange-500 bg-white transition text-sm"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-orange-100 text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-orange-400 pointer-events-none">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 pl-11 border border-orange-400/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-orange-500 placeholder-orange-500 bg-white transition text-sm"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-orange-100 text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-orange-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-11 border border-orange-400/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-orange-500 placeholder-orange-500 bg-white transition text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-orange-50 text-orange-600 font-extrabold py-3.5 rounded-xl shadow-lg transition duration-200 uppercase tracking-wide text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <p className="mt-6 text-center text-sm text-orange-100">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white font-bold underline hover:text-orange-200 transition"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
  