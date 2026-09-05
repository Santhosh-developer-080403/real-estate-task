"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { API_URL } from "@/services/api";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      const userName =
        res.data.user?.name || res.data.name || res.data.username || "User";
      localStorage.setItem("userName", userName);

      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-gray-50 px-4 !bg-[#ff9701]">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-50/30 z-0"></div>
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleLogin}
          autoComplete="off"
          className="bg-orange-500 p-8 md:p-10 rounded-3xl shadow-2xl shadow-orange-500/20 border border-orange-400 text-white"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-white leading-tight">
            Welcome to <br />
            <span className="text-orange-100 tracking-wide drop-shadow-sm">
              Citi Estate
            </span>
          </h2>
          {error && (
            <p className="bg-red-500/20 text-white border border-red-200/40 p-3 rounded-xl mb-5 text-sm text-center backdrop-blur-sm font-medium">
              {error}
            </p>
          )}
          <div className="mb-5">
            <label className="block text-orange-100 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-orange-400/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-orange-500 placeholder-orange-500 bg-white transition text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-orange-100 text-sm font-semibold mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 border border-orange-400/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white text-orange-500 placeholder-orange-500 bg-white transition text-sm"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-orange-400 hover:text-orange-600 transition cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-orange-50 text-orange-600 font-extrabold py-3.5 rounded-xl shadow-lg transition duration-200 uppercase tracking-wide text-sm cursor-pointer disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="mt-6 text-center text-sm text-orange-100">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="text-white font-bold underline hover:text-orange-200 transition"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
