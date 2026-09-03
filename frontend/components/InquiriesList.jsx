import { MessageSquare, Eye } from "lucide-react";

export default function InquiriesList({ inquiries, loading, onInquiryView }) {
  if (loading) {
    return (
      <p className="text-center text-gray-500 py-10 font-medium">
        Loading inquiries...
      </p>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 font-medium">No inquiries received yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <div
          key={inquiry.id}
          className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <h3 className="font-bold text-lg text-orange-600 mb-1">
              {inquiry.property_title || "Property Inquiry"}
            </h3>
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
              <strong className="text-gray-900">Message:</strong>{" "}
              {inquiry.message}
            </p>
            <div className="text-xs text-gray-400 flex flex-wrap gap-4 font-medium">
              <span>
                <strong className="text-gray-600">Sender:</strong>{" "}
                {inquiry.sender_name ||
                  inquiry.user_name ||
                  inquiry.name ||
                  inquiry.username ||
                  "User"}
              </span>
              <span>
                <strong className="text-gray-600">Date:</strong>{" "}
                {new Date(inquiry.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <button
              onClick={() => onInquiryView(inquiry)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shrink-0"
            >
              <Eye size={16} /> View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
