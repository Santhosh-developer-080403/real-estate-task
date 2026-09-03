"use client";
import { useState, useEffect } from "react";
import API, { API_URL } from "@/services/api";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  MessageSquare,
  User,
  X,
  Edit3,
  Mail,
  Phone,
} from "lucide-react";

import MyProperties from "@/components/MyProperties";
import InquiriesList from "@/components/InquiriesList";
import EditProfile from "@/components/EditProfile";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("properties");
  const [myProperties, setMyProperties] = useState([]);
  const [propLoading, setPropLoading] = useState(true);
  const [inquiries, setInquiries] = useState([]);
  const [inqLoading, setInqLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    role: "Owner",
    password: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);

  const [viewModal, setViewModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [inquiryModal, setInquiryModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
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

  const fetchUserProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await API.get("/api/auth/profile");
      if (res.data) {
        setProfileForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          bio: res.data.bio || "",
          address: res.data.address || "",
          role: res.data.role || "Owner",
          password: "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProperties();
    fetchInquiries();
    fetchUserProfile();
  }, []);

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

  const handleView = (property) => {
    setSelectedProperty(property);
    setViewModal(true);
  };

  const handleInquiryView = (inquiry) => {
    setSelectedInquiry(inquiry);
    setInquiryModal(true);
  };

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

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

const handleProfileSubmit = async (e) => {
  e.preventDefault();
  setProfileUpdating(true);
  try {
    const payload = { ...profileForm };
    if (!payload.password) delete payload.password;

    const res = await API.put("/api/auth/profile", payload);
    alert("Profile updated successfully!");
  } catch (err) {
    // Inga backend tharura real error message-ah console-la pakalam
    console.error("Failed to update profile", err.response?.data || err);
    alert(err.response?.data?.message || "Failed to update profile.");
  } finally {
    setProfileUpdating(false);
  }
};

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const existingImages = selectedProperty.images;
      const res = await API.put(
        `/api/properties/${selectedProperty.id}`,
        editForm,
      );
      const responseData = res.data.property || res.data;

      const updatedData = {
        ...selectedProperty,
        ...responseData,
        images:
          responseData.images !== undefined && responseData.images !== null
            ? responseData.images
            : existingImages,
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

  const getImagesArray = (propertyImages) => {
    if (!propertyImages) return [];
    if (Array.isArray(propertyImages)) return propertyImages;
    try {
      return JSON.parse(propertyImages);
    } catch (e) {
      return [];
    }
  };

  // DashboardPage functionulla:
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen text-gray-800 relative">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        User <span className="text-orange-500">Dashboard</span>
      </h1>

      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 mb-8 gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 font-bold text-base transition flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === "properties"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Building2 size={20} /> My Properties ({myProperties.length})
        </button>
        <button
          onClick={() => setActiveTab("inquiries")}
          className={`pb-3 font-bold text-base transition flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === "inquiries"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageSquare size={20} /> Received Inquiries ({inquiries.length})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 font-bold text-base transition flex items-center gap-2 border-b-2 shrink-0 ${
            activeTab === "profile"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <User size={20} /> Edit Profile
        </button>
      </div>

      {/* Tab Content Render */}
      {activeTab === "properties" && (
        <MyProperties
          properties={myProperties}
          loading={propLoading}
          onView={handleView}
          onEdit={handleEditOpen}
          onDelete={handleDelete}
          API_URL={API_URL}
          getImagesArray={getImagesArray}
        />
      )}

      {activeTab === "inquiries" && (
        <InquiriesList
          inquiries={inquiries}
          loading={inqLoading}
          onInquiryView={handleInquiryView}
        />
      )}

      {activeTab === "profile" && (
        <EditProfile
          profileForm={profileForm}
          profileLoading={profileLoading}
          profileUpdating={profileUpdating}
          onChange={handleProfileChange}
          onSubmit={handleProfileSubmit}
        />
      )}

      {/* MODALS REMAINS IN PARENT CONTAINER */}
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
            <div className="grid grid-cols-2 gap-2 mb-4">
              {getImagesArray(selectedProperty.images).map((img, idx) => (
                <img
                  key={idx}
                  src={`${API_URL}${img}`}
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
            </div>
          </div>
        </div>
      )}

      {inquiryModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 relative shadow-2xl border border-gray-100">
            <button
              onClick={() => setInquiryModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
              <MessageSquare className="text-orange-500" size={22} /> Inquiry
              Details
            </h2>
            <p className="text-xs text-gray-400 mb-6">
              Received on{" "}
              {new Date(selectedInquiry.created_at).toLocaleString()}
            </p>
            <div className="space-y-4 text-sm">
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Inquired Property
                </span>
                <h3 className="font-bold text-base text-gray-900 mt-0.5">
                  {selectedInquiry.property_title ||
                    "Property Title Unavailable"}
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
                      {selectedInquiry.sender_name ||
                        selectedInquiry.user_name ||
                        selectedInquiry.name ||
                        selectedInquiry.username ||
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
                      {selectedInquiry.sender_email ||
                        selectedInquiry.email ||
                        "N/A"}
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
                      {selectedInquiry.sender_phone ||
                        selectedInquiry.phone ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                  Message
                </span>
                <p className="text-gray-700 bg-white p-3 rounded-xl border border-gray-100 mt-1 italic">
                  "{selectedInquiry.message || "No message provided."}"
                </p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setInquiryModal(false)}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition shadow-md text-sm"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl border border-gray-100">
            <button
              onClick={() => setEditModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Edit3 className="text-orange-500" size={22} /> Edit Property
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Property Title
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
                <label className="block text-gray-700 font-semibold mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={editForm.city}
                  onChange={handleEditChange}
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
                  value={editForm.price}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Property Type
                </label>
                <select
                  name="property_type"
                  value={editForm.property_type}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">House</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition shadow-md text-sm disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
