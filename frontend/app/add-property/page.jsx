"use client";
import { useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import PropertyFormFields from "@/components/PropertyFormFields";
import PropertyImageUpload from "@/components/PropertyImageUpload";
import Link from "next/link";
import {
  ArrowLeft,
} from "lucide-react";
export default function AddPropertyPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    property_type: "Apartment",
    price: "",
    bedrooms: "1",
    bathrooms: "1",
    parking: "Car Parking",
    furnishing: "Semi-Furnished",
    facing: "East",
    area_sqft: "",
  });
  const [displayPrice, setDisplayPrice] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Indian Currency Formatter Function
  const formatIndianCurrency = (value) => {
    if (!value) return "";
    const cleanNum = value.toString().replace(/[^0-9]/g, "");
    if (!cleanNum) return "";
    const lastThree = cleanNum.substring(cleanNum.length - 3);
    const otherNumbers = cleanNum.substring(0, cleanNum.length - 3);
    if (otherNumbers !== "") {
      return (
        otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      );
    }
    return lastThree;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const rawValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, price: rawValue });
      setDisplayPrice(formatIndianCurrency(rawValue));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("city", formData.city);
      data.append("property_type", formData.property_type);
      data.append("price", Number(formData.price));

      if (formData.property_type !== "Plot") {
        data.append("bedrooms", Number(formData.bedrooms));
        data.append("bathrooms", Number(formData.bathrooms));
        data.append("parking", formData.parking);
        data.append("furnishing", formData.furnishing);
        data.append("facing", formData.facing);
        data.append("area_sqft", Number(formData.area_sqft));
      }

      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      await API.post("/api/properties", data);

      router.push("/");
    } catch (err) {
      console.error("Property creation error:", err.response || err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to create property. Please check all fields.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>


      <div className="relative add-property-bg text-white py-24 px-6 mb-10 overflow-hidden bg-orange-600">
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
              Add New Property
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-10 rounded-2xl shadow-md border border-gray-100"
        >
          <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">
            Add New <span className="text-orange-500">Property Details</span>
          </h2>

          {error && (
            <p className="bg-red-50 text-red-500 border border-red-200 p-3 rounded-xl mb-6 text-sm text-center font-medium">
              {error}
            </p>
          )}

          {/* Form Fields Component */}
          <PropertyFormFields
            formData={formData}
            displayPrice={displayPrice}
            handleChange={handleChange}
          />

          {/* Image Upload Component */}
          <PropertyImageUpload onFileChange={handleFileChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition duration-200 uppercase tracking-wider text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Posting Property..." : "Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
}
