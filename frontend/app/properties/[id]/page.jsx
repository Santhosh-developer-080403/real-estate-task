"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  MapPin,
  IndianRupee,
  ArrowLeft,
  Bed,
  Bath,
  Car,
  Maximize,
  Compass,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";

// இந்திய முறைப்படி (Indian Numbering System) பிரைஸை மாற்ற Helper Function
const formatIndianCurrency = (num) => {
  if (!num) return "0";
  return Number(num).toLocaleString("en-IN");
};

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  // Inquiry Modal States
  const [inquiryModal, setInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (id) {
      let currentCity = "";
      let currentType = "";

      axios
        .get(`http://localhost:5000/api/properties/${id}`)
        .then((res) => {
          setProperty(res.data);
          currentCity = res.data.city;
          currentType = res.data.property_type;
          setLoading(false);

          return axios.get(`http://localhost:5000/api/properties`);
        })
        .then((res) => {
          if (res.data && currentCity) {
            const propertiesList = res.data.properties
              ? res.data.properties
              : res.data;

            // Filter by BOTH same City AND same Property Type
            const filtered = propertiesList.filter(
              (item) =>
                item.city?.toLowerCase() === currentCity.toLowerCase() &&
                item.property_type?.toLowerCase() ===
                  currentType?.toLowerCase() &&
                item.id !== Number(id),
            );
            setRelatedProperties(filtered);
          }
        })
        .catch((err) => {
          console.error("Error fetching details:", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleInquiryChange = (e) => {
    setInquiryForm({ ...inquiryForm, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/inquiries",
        {
          property_id: property.id,
          ...inquiryForm,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      alert("Inquiry sent successfully to the agent!");
      setInquiryModal(false);
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        location: "",
        message: "",
      });
    } catch (err) {
      console.error("Failed to send inquiry", err);
      alert("Failed to send inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-semibold text-gray-600">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-20 text-lg font-semibold text-red-500">
        Property not found!
      </div>
    );
  }

  let images = [];
  if (property && property.images) {
    let imgs = property.images;
    if (typeof imgs === "string") {
      try {
        imgs = JSON.parse(imgs);
      } catch (e) {
        imgs = [imgs];
      }
    }
    if (Array.isArray(imgs)) {
      images = imgs.map((img) =>
        img.startsWith("http")
          ? img
          : `http://localhost:5000${img.startsWith("/") ? "" : "/"}${img}`,
      );
    }
  }

  const handleNextImage = () => {
    if (images.length > 0) {
      setActiveImage((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images.length > 0) {
      setActiveImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const isPlot = property.property_type?.toLowerCase() === "plot";

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 pb-16">
      {/* Banner Section */}
      <div className="relative add-property-bg text-white py-20 px-6 mb-8 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 shadow-sm">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white-400 font-medium mb-3 hover:underline text-sm bg-white/10 px-3 py-1.5 rounded-lg w-fit backdrop-blur-sm"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Property Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery Layout */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="h-[380px] md:h-[450px] bg-gray-100 rounded-xl overflow-hidden relative shadow-inner mb-4">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[activeImage] || images[0]}
                      alt="Property View"
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg text-gray-700 transition cursor-pointer"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2.5 rounded-full shadow-lg text-gray-700 transition cursor-pointer"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`h-20 w-28 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                        activeImage === idx
                          ? "border-orange-500 shadow-md ring-2 ring-orange-500/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Price Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-md font-semibold inline-block mb-2">
                  {property.property_type || "House"}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
                  {property.title}
                </h1>
                <p className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                  <MapPin size={16} className="text-orange-500" />{" "}
                  {property.city}
                </p>
              </div>
              <div className="text-left md:text-right">
                <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">
                  Price
                </span>
                <p className="text-orange-600 font-extrabold text-2xl md:text-3xl flex items-center md:justify-end">
                  <IndianRupee size={24} />
                  {formatIndianCurrency(property.price)}
                </p>
              </div>
            </div>

            {/* Specifications Grid - Hidden for Plots */}
            {!isPlot && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-gray-700 font-medium">
                  <Bed className="text-orange-500 shrink-0" size={20} />
                  <span className="text-sm">
                    {property.bedrooms ? `${property.bedrooms} BHK` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-gray-700 font-medium">
                  <Bath className="text-orange-500 shrink-0" size={20} />
                  <span className="text-sm">
                    {property.bathrooms ? `${property.bathrooms} Baths` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-gray-700 font-medium">
                  <Maximize className="text-orange-500 shrink-0" size={20} />
                  <span className="text-sm">
                    {property.area_sqft ? `${property.area_sqft} sq.ft` : "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-gray-700 font-medium">
                  <Car className="text-orange-500 shrink-0" size={20} />
                  <span className="text-sm">
                    {property.parking ? `${property.parking}` : "None"}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-gray-700 font-medium">
                  <CheckCircle2
                    className="text-orange-500 shrink-0"
                    size={20}
                  />
                  <span className="text-sm">
                    {property.furnishing || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-gray-700 font-medium">
                  <Compass className="text-orange-500 shrink-0" size={20} />
                  <span className="text-sm">
                    {property.facing ? `${property.facing} Facing` : "N/A"}
                  </span>
                </div>
              </div>
            )}

            {/* Description Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-3">
                Description
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {property.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Right Column (Agent Contact & Similar Properties Nearby) */}
          <div className="space-y-6">
            {/* Agent Contact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl uppercase">
                  {property.agent_name ? property.agent_name[0] : "A"}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {property.agent_name || "Agent Name"}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Real Estate Agent
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInquiryModal(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                Contact Agent
              </button>
            </div>

            {/* Properties Nearby Section (Filtered by Same Type) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-3">
                Similar in {property.city}
              </h3>

              {relatedProperties.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {relatedProperties.slice(0, 4).map((item) => {
                    let itemImg = "/placeholder.jpg";
                    if (item.images) {
                      try {
                        const parsed =
                          typeof item.images === "string"
                            ? JSON.parse(item.images)
                            : item.images;
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          itemImg = parsed[0].startsWith("http")
                            ? parsed[0]
                            : `http://localhost:5000${parsed[0].startsWith("/") ? "" : "/"}${parsed[0]}`;
                        }
                      } catch (e) {}
                    }

                    const isItemPlot =
                      item.property_type?.toLowerCase() === "plot";

                    return (
                      <Link
                        key={item.id}
                        href={`/properties/${item.id}`}
                        className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition group block"
                      >
                        <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={itemImg}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <span className="text-orange-600 font-extrabold text-base flex items-center">
                              <IndianRupee size={14} />
                              {formatIndianCurrency(item.price)}
                            </span>
                            <h4 className="text-xs font-semibold text-gray-800 line-clamp-1 mt-0.5">
                              {item.title}
                            </h4>
                          </div>
                          {!isItemPlot ? (
                            <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                              <span className="flex items-center gap-1">
                                <Bed size={12} className="text-orange-500" />{" "}
                                {item.bedrooms ?? 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath size={12} className="text-orange-500" />{" "}
                                {item.bathrooms ?? 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Maximize
                                  size={12}
                                  className="text-orange-500"
                                />{" "}
                                {item.area_sqft ?? 0}ft²
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs text-orange-500 font-semibold">
                              Plot Property
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No similar properties found in this city.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal Popup */}
      {inquiryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInquiryModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full transition cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Contact <span className="text-orange-500">Agent</span>
            </h3>
            <form onSubmit={handleInquirySubmit} className="space-y-3">
              <div>
                <label className="block text-gray-700 text-xs font-semibold mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={inquiryForm.name}
                  onChange={handleInquiryChange}
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
                    onChange={handleInquiryChange}
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
                    onChange={handleInquiryChange}
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
                  onChange={handleInquiryChange}
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
                  onChange={handleInquiryChange}
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
      )}
    </div>
  );
}
