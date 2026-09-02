"use client";
import { useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock } from "lucide-react";

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
      await API.post("/api/auth/register", { name, email, password });
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] px-4">
      <form
        onSubmit={handleRegister}
        autoComplete="off"
        className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-orange-100 w-full max-w-md"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-sm text-gray-500 mb-8">
          Join{" "}
          <span className="text-orange-500 font-semibold">Citi Estate</span>{" "}
          today
        </p>

        {error && (
          <p className="bg-red-50 text-red-500 border border-red-200 p-3 rounded-xl mb-6 text-sm text-center font-medium">
            {error}
          </p>
        )}

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              name="reg-name-fake"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-orange-50/30 transition text-sm"
              required
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <User size={18} />
            </span>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              name="reg-email-fake"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-orange-50/30 transition text-sm"
              required
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              name="reg-password-fake"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black bg-orange-50/30 transition text-sm"
              required
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition duration-200 uppercase tracking-wider text-sm disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600 font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-orange-500 font-bold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
