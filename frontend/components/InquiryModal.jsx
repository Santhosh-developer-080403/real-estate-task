"use client";
import { X, MessageSquare, User, Mail, Phone } from "lucide-react";

export default function InquiryModal({ inquiry, onClose, isOpen }) {
  // isOpen false-ஆக இருந்தாலோ அல்லது inquiry இல்லாட்டாலோ இது ரெண்டரே ஆகாது
  if (!isOpen || !inquiry) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition cursor-pointer"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
          <MessageSquare className="text-orange-500" size={22} /> Inquiry
          Details
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          Received on{" "}
          {inquiry.created_at
            ? new Date(inquiry.created_at).toLocaleString()
            : "N/A"}
        </p>
        <div className="space-y-4 text-sm">
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4">
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Inquired Property
            </span>
            <h3 className="font-bold text-base text-gray-900 mt-0.5">
              {inquiry.property_title || "Property Title Unavailable"}
            </h3>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Customer Information
            </span>
            <div className="flex items-center gap-3 text-gray-800">
              <div className="bg-white p-2 rounded-xl shadow-sm text-orange-500">
                <User size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Name</p>
                <p className="font-bold text-gray-900">
                  {inquiry.sender_name ||
                    inquiry.user_name ||
                    inquiry.name ||
                    inquiry.username ||
                    "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-800">
              <div className="bg-white p-2 rounded-xl shadow-sm text-orange-500">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Email Address
                </p>
                <p className="font-bold text-gray-900">
                  {inquiry.sender_email || inquiry.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-800">
              <div className="bg-white p-2 rounded-xl shadow-sm text-orange-500">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">
                  Phone Number
                </p>
                <p className="font-bold text-gray-900">
                  {inquiry.sender_phone || inquiry.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Message
            </span>
            <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-100 mt-1 italic">
              &quot;{inquiry.message || "No message provided."}&quot;
            </p>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition shadow-md text-sm cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
