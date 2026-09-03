"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import headerImg from "../public/logos/main-logo.png";

export default function Navbar() {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState("User");
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // <-- Dropdown element-ஐ track பண்ண ref
  const router = useRouter();

  // const checkAuth = () => {
  //   const storedToken = localStorage.getItem("token");
  //   const storedName = localStorage.getItem("userName");

  //   setToken(storedToken);

  //   if (storedName && storedName !== "undefined" && storedName !== "null") {
  //     setUserName(storedName);
  //   } else {
  //     setUserName("User");
  //   }
  // };

  const checkAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("userName");

    setToken(storedToken);

    if (storedName && storedName !== "undefined" && storedName !== "null") {
      setUserName(storedName);
    } else {
      setUserName("User");
    }
  };

  // useEffect(() => {

  //   window.addEventListener("storage", checkAuth);
  //   window.addEventListener("auth-change", checkAuth);

  //   return () => {
  //     window.removeEventListener("storage", checkAuth);
  //     window.removeEventListener("auth-change", checkAuth);
  //   };
  // }, []);

  useEffect(() => {
    // Check auth immediately when Navbar mounts / page refreshes
    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setUserName("User");
    window.dispatchEvent(new Event("auth-change"));
    setIsOpen(false);
    setDropdownOpen(false);
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-50">
      <Link href="/" className="...">
        <img
          src={headerImg.src}
          alt="Citi Estate Logo"
          className="h-10 w-auto object-contain mx-auto"
          width={500}
          height={100}
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
          <Link
            href="/add-property"
            className="text-gray-700 hover:text-orange-500 transition flex items-center gap-1.5"
          >
            Add Property
          </Link>
        )}

        {token ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-2 rounded-2xl transition border border-orange-200 cursor-pointer"
            >
              <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-xs">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="font-semibold text-sm max-w-[120px] truncate">
                {userName}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400">Signed in as</p>
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {userName}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard?tab=profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-orange-600 transition"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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
          className="text-gray-700 focus:outline-none hover:text-orange-500 transition cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md border-b border-gray-100 flex flex-col py-4 px-6 gap-4 md:hidden text-sm font-medium">
          {token && (
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="w-9 h-9 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </div>
              <div>
                <p className="text-xs text-gray-500">Logged in as</p>
                <p className="font-bold text-gray-900 truncate max-w-[200px]">
                  {userName}
                </p>
              </div>
            </div>
          )}

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
                className="w-full bg-red-500 text-white px-4 py-2.5 rounded-xl hover:bg-red-600 transition shadow-sm text-center font-bold cursor-pointer"
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
