"use client";
import { X, Bed, Bath, Square, MapPin, Tag, Building2 } from "lucide-react";

export default function ViewPropertyModal({
  property,
  API_URL,
  getImagesArray,
  onClose,
  isOpen,
}) {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-4 pr-10">
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {property.property_type || "Property"}
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-2">
            {property.title}
          </h2>
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
            <MapPin size={16} className="text-orange-500" /> {property.city}
            {property.address ? `, ${property.address}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {getImagesArray(property.images).map((img, idx) => (
            <img
              key={idx}
              src={`${API_URL}${img}`}
              alt="Property"
              className="w-full h-44 object-cover rounded-2xl border"
            />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-gray-50 p-4 rounded-2xl">
          {property.bedrooms !== undefined && property.bedrooms !== null && (
            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
              <Bed className="text-orange-500" size={20} />
              <span>{property.bedrooms} Bedrooms</span>
            </div>
          )}
          {property.bathrooms !== undefined && property.bathrooms !== null && (
            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
              <Bath className="text-orange-500" size={20} />
              <span>{property.bathrooms} Bathrooms</span>
            </div>
          )}
          {property.sqft && (
            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
              <Square className="text-orange-500" size={20} />
              <span>{property.sqft} sq.ft</span>
            </div>
          )}
          {property.furnishing && (
            <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold">
              <Building2 className="text-orange-500" size={20} />
              <span>{property.furnishing}</span>
            </div>
          )}
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Description</h3>
            <p className="text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              {property.property_description ||
                property.description ||
                "No description provided."}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block font-medium">
                Total Price
              </span>
              <span className="text-orange-600 text-2xl font-black">
                ₹ {Number(property.price || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl transition text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
