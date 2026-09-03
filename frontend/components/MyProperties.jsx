import {
  Building2,
  MapPin,
  IndianRupee,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function MyProperties({
  properties,
  loading,
  onView,
  onEdit,
  onDelete,
  API_URL,
  getImagesArray,
}) {
  if (loading) {
    return (
      <p className="text-center text-gray-500 py-10 font-medium">
        Loading your properties...
      </p>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-gray-500 mb-4 font-medium">
          You have not added any properties yet.
        </p>
        <Link
          href="/add-property"
          className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition shadow-md"
        >
          Add Property Now
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => {
        const imgs = getImagesArray(property.images);
        const firstImg =
          imgs.length > 0 ? `${API_URL}${imgs[0]}` : "/placeholder.jpg";

        return (
          <div
            key={property.id}
            className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="h-48 relative overflow-hidden bg-gray-100">
                <img
                  src={firstImg}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2.5 py-1 rounded-md font-semibold">
                  {property.property_type || "House"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                  {property.title}
                </h3>
                <p className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin size={15} className="text-orange-500" />{" "}
                  {property.city}
                </p>
                <p className="text-orange-600 font-extrabold text-xl flex items-center">
                  <IndianRupee size={18} />{" "}
                  {property.price
                    ? Number(property.price).toLocaleString("en-IN")
                    : 0}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onView(property)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                <Eye size={15} /> View
              </button>
              <button
                onClick={() => onEdit(property)}
                className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                <Edit3 size={15} /> Edit
              </button>
              <button
                onClick={() => onDelete(property.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
