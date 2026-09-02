"use client";
import { useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Key } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);

      window.dispatchEvent(new Event("auth-change"));
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-white">
      <div className="absolute top-0 left-0 w-full md:w-1/2 h-full bg-orange-500 z-0"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <form
          onSubmit={handleLogin}
          autoComplete="off"
          className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-orange-100"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center text-gray-800 leading-tight">
            Welcome to <br />
            <span className="text-orange-500">Citi Estate</span>
          </h2>

          {error && (
            <p className="bg-red-50 text-red-500 border border-red-200 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </p>
          )}

          <div className="mb-5">
            <label className="block text-gray-600 text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="no-autofill-email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-orange-50/30 transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="no-autofill-password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-10 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-orange-50/30 transition"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Key size={18} />
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition duration-200 uppercase tracking-wide text-sm"
          >
            Login
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">Don't have an account?{" "}
            <Link
              href="/register"
              className="text-orange-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
