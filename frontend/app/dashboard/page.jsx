"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import Link from "next/link";
import {
  MessageSquare,
  Building2,
  Trash2,
  Edit3,
  Eye,
  MapPin,
  IndianRupee,
  X,
  Bed,
  Bath,
  Car,
  CheckCircle2,
  Compass,
  Maximize,
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("properties");

  const [myProperties, setMyProperties] = useState([]);
  const [propLoading, setPropLoading] = useState(true);

  const [inquiries, setInquiries] = useState([]);
  const [inqLoading, setInqLoading] = useState(true);

  // Modal States
  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);

  const fetchMyProperties = async () => {
    try {
      setPropLoading(true);
      const res = await API.get("/api/properties/my-properties");
      setMyProperties(res.data);
    } catch (err) {
      console.error("Error fetching user properties:", err);
    } finally {
      setPropLoading(false);
    }
  };

  const fetchInquiries = async () => {
    try {
      setInqLoading(true);
      const res = await API.get("/api/inquiries/my-inquiries");
      setInquiries(res.data);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setInqLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
    fetchInquiries();
  }, []);

  // Delete Handler
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        await API.delete(`/api/properties/${id}`);
        setMyProperties(myProperties.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Failed to delete property", err);
        alert("Failed to delete property.");
      }
    }
  };

  // Open View Modal
  const handleView = (property) => {
    setSelectedProperty(property);
    setViewModal(true);
  };

  // Open Edit Modal
  const handleEditOpen = (property) => {
    setSelectedProperty(property);
    setEditForm({
      title: property.title || "",
      description: property.description || "",
      city: property.city || "",
      property_type: property.property_type || "Apartment",
      price: property.price || "",
      bedrooms: property.bedrooms || "1",
      bathrooms: property.bathrooms || "1",
      parking: property.parking || "Car Parking",
      furnishing: property.furnishing || "Semi-Furnished",
      facing: property.facing || "East",
      area_sqft: property.area_sqft || "",
    });
    setEditModal(true);
  };

  // Handle Edit Input Change
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await API.put(
        `/api/properties/${selectedProperty.id}`,
        editForm,
      );

      // FIX: Backend enna thanthalum, namma old images-ah strict-ah preserve pannidrom
      const updatedData = {
        ...(res.data.property || res.data),
        images: selectedProperty.images, // Old images-ah apadiye fix pannidrom
      };

      setMyProperties(
        myProperties.map((p) =>
          p.id === selectedProperty.id ? updatedData : p,
        ),
      );
      setEditModal(false);
      alert("Property updated successfully!");
    } catch (err) {
      console.error("Failed to update property", err);
      alert("Failed to update property.");
    } finally {
      setUpdating(false);
    }
  };

  // Helper to safely extract images
  const getImagesArray = (propertyImages) => {
    if (!propertyImages) return [];
    if (Array.isArray(propertyImages)) return propertyImages;
    try {
      return JSON.parse(propertyImages);
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen text-gray-800 relative">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        User <span className="text-orange-500">Dashboard</span>
      </h1>

      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 mb-8 gap-8">
        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 font-bold text-base transition flex items-center gap-2 border-b-2 ${
            activeTab === "properties"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Building2 size={20} /> My Properties ({myProperties.length})
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-3 font-bold text-base transition flex items-center gap-2 border-b-2 ${
            activeTab === "inquiries"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageSquare size={20} /> Received Inquiries ({inquiries.length})
        </button>
      </div>

      {/* Tab 1: My Properties */}
      {activeTab === "properties" && (
        <div>
          {propLoading ? (
            <p className="text-center text-gray-500 py-10 font-medium">
              Loading your properties...
            </p>
          ) : myProperties.length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => {
                const imgs = getImagesArray(property.images);
                const firstImg =
                  imgs.length > 0
                    ? `http://localhost:5000${imgs[0]}`
                    : "/placeholder.jpg";

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

                    {/* Action Buttons: View, Edit, Delete */}
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleView(property)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Eye size={15} /> View
                      </button>
                      <button
                        onClick={() => handleEditOpen(property)}
                        className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Edit3 size={15} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Received Inquiries */}
      {activeTab === "inquiries" && (
        <div>
          {inqLoading ? (
            <p className="text-center text-gray-500 py-10 font-medium">
              Loading inquiries...
            </p>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">
                No inquiries received yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-lg text-orange-600 mb-1">
                    {inquiry.property_title || "Property Inquiry"}
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    {inquiry.message}
                  </p>
                  <div className="text-xs text-gray-400 flex justify-between font-medium">
                    <span>From User ID: {inquiry.user_id}</span>
                    <span>
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODAL */}
      {viewModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
            <button
              onClick={() => setViewModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedProperty.title}
            </h2>

            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {getImagesArray(selectedProperty.images).map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000${img}`}
                  alt="Property"
                  className="w-full h-40 object-cover rounded-xl"
                />
              ))}
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>Description:</strong> {selectedProperty.description}
              </p>
              <p>
                <strong>City:</strong> {selectedProperty.city}
              </p>
              <p>
                <strong>Type:</strong> {selectedProperty.property_type}
              </p>
              <p className="text-orange-600 text-lg font-bold">
                Price: ₹{" "}
                {Number(selectedProperty.price).toLocaleString("en-IN")}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <p>
                  <strong>Bedrooms:</strong> {selectedProperty.bedrooms} BHK
                </p>
                <p>
                  <strong>Bathrooms:</strong> {selectedProperty.bathrooms}
                </p>
                <p>
                  <strong>Parking:</strong> {selectedProperty.parking}
                </p>
                <p>
                  <strong>Furnishing:</strong> {selectedProperty.furnishing}
                </p>
                <p>
                  <strong>Facing:</strong> {selectedProperty.facing}
                </p>
                <p>
                  <strong>Area:</strong> {selectedProperty.area_sqft} Sq.Ft
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
            <button
              onClick={() => setEditModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Edit <span className="text-orange-500">Property</span>
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">
                    Property Type
                  </label>
                  <select
                    name="property_type"
                    value={editForm.property_type}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">
                    Area (Sq.Ft)
                  </label>
                  <input
                    type="number"
                    name="area_sqft"
                    value={editForm.area_sqft}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition text-sm disabled:opacity-50"
              >
                {updating ? "Saving Changes..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
