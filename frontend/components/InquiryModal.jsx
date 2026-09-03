"use client";
import { X } from "lucide-react";

export default function InquiryModal({
  isOpen,
  onClose,
  inquiryForm,
  onChange,
  onSubmit,
  submitting,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition cursor-pointer"
        >
          <X size={20} />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Contact <span className="text-orange-500">Agent</span>
        </h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-1">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={inquiryForm.name}
              onChange={onChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={inquiryForm.email}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-xs font-semibold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={inquiryForm.phone}
                onChange={onChange}
                placeholder="Enter phone number"
                className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-1">
              Your Location
            </label>
            <input
              type="text"
              name="location"
              value={inquiryForm.location}
              onChange={onChange}
              placeholder="e.g. Chennai, Madurai"
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-xs font-semibold mb-1">
              Message
            </label>
            <textarea
              rows="3"
              name="message"
              value={inquiryForm.message}
              onChange={onChange}
              placeholder="I am interested in this property. Please contact me."
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition text-sm disabled:opacity-50 cursor-pointer mt-2"
          >
            {submitting ? "Sending..." : "Send Inquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
