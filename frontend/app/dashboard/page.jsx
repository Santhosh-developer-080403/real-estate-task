"use client";
import { useState, useEffect, Suspense } from "react";
import API, { API_URL } from "@/services/api";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
} from "lucide-react";

import MyProperties from "@/components/MyProperties";
import InquiriesList from "@/components/InquiriesList";
import EditProfile from "@/components/EditProfile";
import DashboardTabs from "@/components/DashboardTabs";
import ViewPropertyModal from "@/components/ViewPropertyModal";
import InquiryModal from "@/components/InquiryModal";
import EditPropertyModal from "@/components/EditPropertyModal";

function DashboardContent() {
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
    const loadDashboardData = async () => {
      try {
        await Promise.all([
          fetchMyProperties(),
          fetchInquiries(),
          fetchUserProfile(),
        ]);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();
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
      existingImages: getImagesArray(property.images), // ஏற்கனவே இருக்கிற இமேஜ்கள்
      newImages: [], // புதுசா அப்லோடு பண்றதுக்கு
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

      await API.put("/api/auth/profile", payload);
      alert("Profile updated successfully!");
    } catch (err) {
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
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("city", editForm.city);
      formData.append("property_type", editForm.property_type);
      formData.append("price", editForm.price);

      formData.append("existingImages", JSON.stringify(editForm.existingImages));

      if (editForm.newImages && editForm.newImages.length > 0) {
        for (let i = 0; i < editForm.newImages.length; i++) {
          formData.append("images", editForm.newImages[i]);
        }
      }

      const res = await API.put(
        `/api/properties/${selectedProperty.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const responseData = res.data.property || res.data;

      const updatedData = {
        ...selectedProperty,
        ...responseData,
        images:
          responseData.images !== undefined
            ? responseData.images
            : editForm.existingImages,
      };

      setMyProperties(
        myProperties.map((p) => (p.id === selectedProperty.id ? updatedData : p)),
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

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // useEffect(() => {
  //   if (tabParam) {
  //     setActiveTab(tabParam);
  //   }
  // }, [tabParam]);

  return (

    <div>
      <div className="relative our-dashboard-bg  text-white py-24 px-6 overflow-hidden bg-orange-600">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white font-medium mb-3 hover:underline text-sm bg-black/20 px-3 py-1.5 rounded-lg w-fit backdrop-blur-sm transition"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Our Dashboard
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen text-gray-800 relative">


        <h1 className="text-3xl text-center font-extrabold mb-20 text-gray-900 mb-6">
          User <span className="text-orange-500">Dashboard</span>
        </h1>

        {/* Tabs Component */}
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          propertiesCount={myProperties.length}
          inquiriesCount={inquiries.length}
        />

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

        {/* Modals */}
        <ViewPropertyModal
          property={selectedProperty}
          API_URL={API_URL}
          getImagesArray={getImagesArray}
          onClose={() => setViewModal(false)}
          isOpen={viewModal && selectedProperty}
        />

        <InquiryModal
          inquiry={selectedInquiry}
          onClose={() => setInquiryModal(false)}
          isOpen={inquiryModal && selectedInquiry}
        />

        <EditPropertyModal
          editForm={editForm}
          updating={updating}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          onClose={() => setEditModal(false)}
          isOpen={editModal && selectedProperty}
        />
      </div>
    </div>

  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 font-semibold text-gray-500">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
