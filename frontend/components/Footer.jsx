import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaWhatsapp,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import footerImg from "../public/logos/white-main-logo.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Logo / Brand Name */}
        <div className="mb-4">
          <Link href="/" className="inline-block">
            <img
              src={footerImg.src}
              alt="Citi Estate Logo"
              className="h-10 w-auto object-contain mx-auto"
            />
          </Link>
        </div>

        {/* Short Description */}
        <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
          Find your dream property with trusted agents, verified listings, and
          seamless experiences tailored to your lifestyle.
        </p>

        {/* Contact Details (Underline layout style) */}
        <div className="w-full  py-6 my-2 max-w-4xl flex flex-col md:flex-row items-center justify-around gap-6 text-sm">
          {/* Phone */}
          <a
            href="tel:+919876543210"
            className="flex items-center gap-2.5 hover:text-orange-500 transition"
          >
            <Phone size={18} className="text-orange-500 shrink-0" />
            <span>+91 98765 43210</span>
          </a>

          {/* Email */}
          <a
            href="mailto:support@citiestate.com"
            className="flex items-center gap-2.5 hover:text-orange-500 transition"
          >
            <Mail size={18} className="text-orange-500 shrink-0" />
            <span>support@citiestate.com</span>
          </a>

          {/* Address */}
          <div className="flex items-center gap-2.5 text-left max-w-xs">
            <MapPin
              size={22}
              className="text-orange-500 shrink-0 self-start mt-0.5"
            />
            <span>
              No. 12, Anna Nagar Main Road, Chennai, Tamil Nadu 600040
            </span>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-4 my-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition shadow-md"
          >
            <FaFacebookF size={16} />
          </a>
          <a
            href="https://whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition shadow-md"
          >
            <FaWhatsapp size={18} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition shadow-md"
          >
            <FaYoutube size={18} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-500 text-white flex items-center justify-center transition shadow-md"
          >
            <FaInstagram size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
