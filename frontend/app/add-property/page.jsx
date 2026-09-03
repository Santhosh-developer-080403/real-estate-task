"use client";
import { useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";
import {
  Building,
  IndianRupee,
  Bed,
  Bath,
  MapPin,
  Upload,
  Car,
  Compass,
  Maximize,
  CheckCircle2,
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

      // Plot-ah iruntha extra fields anuppa thevai illa
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

      await API.post("/api/properties", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create property");
      setLoading(false);
    }
  };

  const isPlot = formData.property_type === "Plot";

  return (
    <div>
      <div className="relative add-property-bg text-white py-24 px-6 mb-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mb-12">
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

          {/* Title */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Property Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Luxury Villa with Swimming Pool"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write details about the property..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
              rows="4"
              required
            />
          </div>

          {/* City & Property Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                <MapPin size={16} className="text-orange-500" /> City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Chennai"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                <Building size={16} className="text-orange-500" /> Property Type
              </label>
              <select
                className="custom-dropdown"
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="House">House</option>
                <option value="Plot">Plot</option>
              </select>
            </div>
          </div>

          {/* Price & Area (SqFt) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                <IndianRupee size={16} className="text-orange-500" /> Price (₹)
              </label>
              <input
                type="text"
                name="price"
                value={displayPrice}
                onChange={handleChange}
                placeholder="e.g. 55,00,000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
                required
              />
            </div>
            {!isPlot && (
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                  <Maximize size={16} className="text-orange-500" /> Area
                  (Sq.Ft)
                </label>
                <input
                  type="number"
                  name="area_sqft"
                  value={formData.area_sqft}
                  onChange={handleChange}
                  placeholder="e.g. 2400"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
                  required={!isPlot}
                />
              </div>
            )}
          </div>

          {/* Conditional Fields for Non-Plot Properties */}
          {!isPlot && (
            <>
              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                    <Bed size={16} className="text-orange-500" /> Bedrooms (BHK)
                  </label>
                  <select
                    className="custom-dropdown"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
                  >
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                    <Bath size={16} className="text-orange-500" /> Bathrooms
                  </label>
                  <select
                    className="custom-dropdown"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
                  >
                    <option value="1">1 Bathroom</option>
                    <option value="2">2 Bathrooms</option>
                    <option value="3">3 Bathrooms</option>
                    <option value="4">4 Bathrooms</option>
                    <option value="5">5+ Bathrooms</option>
                  </select>
                </div>
              </div>

              {/* Parking & Furnishing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                    <Car size={16} className="text-orange-500" /> Parking
                    Available
                  </label>
                  <select
                    className="custom-dropdown"
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
                  >
                    <option value="Car Parking">Car Parking</option>
                    <option value="Bike Parking">Bike Parking</option>
                    <option value="Car & Bike Parking">
                      Car & Bike Parking
                    </option>
                    <option value="None">None</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                    <CheckCircle2 size={16} className="text-orange-500" />{" "}
                    Furnishing Status
                  </label>
                  <select
                    className="custom-dropdown"
                    name="furnishing"
                    value={formData.furnishing}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
                  >
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              {/* Facing Direction */}
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
                  <Compass size={16} className="text-orange-500" /> Facing
                  Direction
                </label>
                <select
                  className="custom-dropdown"
                  name="facing"
                  value={formData.facing}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
                >
                  <option value="East">East</option>
                  <option value="North">North</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="North-East">North-East</option>
                </select>
              </div>
            </>
          )}

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
              <Upload size={16} className="text-orange-500" /> Upload Images
              from Device
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition text-sm cursor-pointer"
            />
            <p className="text-xs text-gray-400 mt-1">
              You can select multiple images at once.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 transition duration-200 uppercase tracking-wider text-sm disabled:opacity-50"
          >
            {loading ? "Posting Property..." : "Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
}
