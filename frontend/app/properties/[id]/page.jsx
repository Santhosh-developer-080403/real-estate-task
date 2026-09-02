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

  const scrollCarousel = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const offset = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - offset : scrollLeft + offset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (id) {
      let currentCity = "";

      axios
        .get(`http://localhost:5000/api/properties/${id}`)
        .then((res) => {
          setProperty(res.data);
          currentCity = res.data.city;
          setLoading(false);

          return axios.get(`http://localhost:5000/api/properties`);
        })
        .then((res) => {
          if (res.data && currentCity) {
            const filtered = res.data.properties
              ? res.data.properties.filter(
                  (item) =>
                    item.city?.toLowerCase() === currentCity.toLowerCase() &&
                    item.id !== Number(id),
                )
              : res.data.filter(
                  (item) =>
                    item.city?.toLowerCase() === currentCity.toLowerCase() &&
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

  // Handle Input Change
  const handleInquiryChange = (e) => {
    setInquiryForm({ ...inquiryForm, [e.target.name]: e.target.value });
  };

  // Handle Inquiry Submit
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

  // Safe images parser for details page
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

  return (
    <div>
      <div className="relative add-property-bg text-white py-24 px-6 mb-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Property Details
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen text-gray-800">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-orange-600 font-semibold mb-6 hover:underline text-sm"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              {property.title}
            </h1>
            <p className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin size={16} className="text-orange-500" /> {property.city}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-md font-semibold">
              {property.property_type || "House"}
            </span>
            <p className="text-orange-600 font-extrabold text-2xl md:text-3xl flex items-center">
              <IndianRupee size={24} />{" "}
              {property.price ? property.price.toLocaleString("en-IN") : 0}
            </p>
          </div>
        </div>

        {/* Image Gallery Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 h-[380px] bg-gray-100 rounded-2xl overflow-hidden relative shadow-md">
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700 transition"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700 transition"
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

          {/* Thumbnails Stack */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible">
            {images.slice(1, 3).map((img, idx) => {
              const actualIdx = idx + 1;
              return (
                <div
                  key={actualIdx}
                  onClick={() => setActiveImage(actualIdx)}
                  className={`h-[180px] flex-1 rounded-2xl overflow-hidden cursor-pointer border-2 shadow-sm transition ${
                    activeImage === actualIdx
                      ? "border-orange-500"
                      : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
            {images.length <= 1 && (
              <div className="h-[180px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                More images will appear here
              </div>
            )}
          </div>
        </div>

        {/* Description & Contact Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-600 text-base leading-relaxed max-w-3xl">
            {property.description || "No description available."}
          </p>
          <button
            onClick={() => setInquiryModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition duration-200 whitespace-nowrap cursor-pointer"
          >
            Contact Agent
          </button>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 font-medium">
            <Bed className="text-orange-500 shrink-0" size={20} />
            <span className="text-sm">
              {property.bedrooms !== undefined && property.bedrooms !== null
                ? property.bedrooms === 0
                  ? "Plot"
                  : `${property.bedrooms} BHK`
                : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 font-medium">
            <Bath className="text-orange-500 shrink-0" size={20} />
            <span className="text-sm">
              {property.bathrooms ? `${property.bathrooms} Baths` : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 font-medium">
            <Maximize className="text-orange-500 shrink-0" size={20} />
            <span className="text-sm">
              {property.area_sqft ? `${property.area_sqft} sq.ft` : "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 font-medium">
            <Car className="text-orange-500 shrink-0" size={20} />
            <span className="text-sm">
              {property.parking !== undefined
                ? `${property.parking} Parking`
                : "None"}
            </span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 font-medium">
            <CheckCircle2 className="text-orange-500 shrink-0" size={20} />
            <span className="text-sm">{property.furnishing || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 font-medium">
            <Compass className="text-orange-500 shrink-0" size={20} />
            <span className="text-sm">
              {property.facing ? `${property.facing} Facing` : "N/A"}
            </span>
          </div>
        </div>

        {/* Related Properties Carousel */}
        {relatedProperties.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                More Properties in {property.city}
              </h3>
              {relatedProperties.length > 3 && (
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollCarousel("left")}
                    className="p-2.5 rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 text-gray-700 transition shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => scrollCarousel("right")}
                    className="p-2.5 rounded-full border border-gray-200 hover:bg-orange-500 hover:text-white hover:border-orange-500 text-gray-700 transition shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {relatedProperties.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="min-w-[320px] md:min-w-[360px] flex-shrink-0"
                >
                  <PropertyCard property={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inquiry Modal Popup */}
      {inquiryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
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
