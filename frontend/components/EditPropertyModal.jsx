"use client";
import { X, Edit3, Trash2, Upload } from "lucide-react";
import API from "@/services/api";
export default function EditPropertyModal({
  editForm,
  updating,
  onChange,
  onSubmit,
  onClose,
  isOpen,
  API_URL,
  setEditForm,
}) {
  if (!isOpen) return null;

  const handleRemoveExistingImage = (indexToRemove) => {
    const updatedImages = editForm.existingImages.filter(
      (_, index) => index !== indexToRemove,
    );
    setEditForm({ ...editForm, existingImages: updatedImages });
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setEditForm({ ...editForm, newImages: files });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <Edit3 className="text-orange-500" size={22} /> Edit Property & Images
        </h2>

        <form onSubmit={onSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Property Title
            </label>
            <input
              type="text"
              name="title"
              value={editForm.title || ""}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={editForm.city || ""}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={editForm.price || ""}
                onChange={onChange}
                className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Property Type
            </label>
            <select
              name="property_type"
              value={editForm.property_type || "Apartment"}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          {/* Existing Images Management */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Current Images
            </label>

            {Array.isArray(editForm.existingImages) &&
              editForm.existingImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {editForm.existingImages.map((img, idx) => {
                  const imageUrl = getImageUrl(img);

                  return (
                    <div
                      key={`${img}-${idx}`}
                      className="relative group rounded-xl overflow-hidden border border-gray-300 h-24 bg-gray-100"
                    >
                      {/* IMAGE */}
                      <img
                        src={imageUrl}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("❌ Image failed:", imageUrl);

                          e.currentTarget.onerror = null;

                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition cursor-pointer shadow-md"
                        title="Remove image"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-dashed border-gray-300 rounded-xl p-5 text-center">
                <p className="text-gray-400 text-xs">No images uploaded yet.</p>
              </div>
            )}
          </div>

          {/* Upload New Images */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Add New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImagesChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 cursor-pointer border rounded-xl p-1 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={editForm.description || ""}
              onChange={onChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow-md text-sm disabled:opacity-50 cursor-pointer"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}













