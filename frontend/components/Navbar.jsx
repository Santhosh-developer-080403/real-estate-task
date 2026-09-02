"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [token, setToken] = useState(null); // Fixed here (Plain JS)
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    };

    checkToken();

    window.addEventListener("storage", checkToken);
    window.addEventListener("auth-change", checkToken);

    return () => {
      window.removeEventListener("storage", checkToken);
      window.removeEventListener("auth-change", checkToken);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.dispatchEvent(new Event("auth-change"));
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
      <Link
        href="/"
        className="text-xl font-bold text-orange-500 flex items-center gap-2"
      >
        <Image
          src="/logos/main-logo.png"
          alt="Citi Estate"
          width={100}
          height={40}
          priority
        />
      </Link>

      <div className="hidden md:flex gap-6 items-center text-sm font-medium">
        <Link
          href="/"
          className="text-gray-700 hover:text-orange-500 transition"
        >
          Home
        </Link>
        {token && (
          <>
            <Link
              href="/add-property"
              className="text-gray-700 hover:text-orange-500 transition"
            >
              Add Property
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-orange-500 transition"
            >
              Dashboard
            </Link>
          </>
        )}
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition shadow-sm"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="text-gray-700 hover:text-orange-500 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
            >
              Register
            </Link>
          </>
        )}
      </div>

      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 focus:outline-none hover:text-orange-500 transition"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md border-b border-gray-100 flex flex-col py-4 px-6 gap-4 md:hidden text-sm font-medium">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-orange-500 transition py-1"
          >
            Home
          </Link>
          {token && (
            <>
              <Link
                href="/add-property"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-orange-500 transition py-1"
              >
                Add Property
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-orange-500 transition py-1"
              >
                Dashboard
              </Link>
            </>
          )}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-3">
            {token ? (
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition shadow-sm text-center"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-gray-700 hover:text-orange-500 transition py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center bg-orange-500 text-white px-5 py-2.5 rounded-xl hover:bg-orange-600 transition shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
