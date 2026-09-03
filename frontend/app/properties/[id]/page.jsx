"use client";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import InquiryModal from "@/components/InquiryModal"; // தனி ஃபார்ம் காம்போனென்ட் இறக்குமதி

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

  const [inquiryModal, setInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleContactAgentClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login or register first to contact the agent!");
      return;
    }
    setInquiryModal(true);
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

  const isPlot = property.property_type?.toLowerCase() === "plot";
  const agentDisplayName =
    property.agent_name || property.user_name || "Agent Name";

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-800 pb-16">
      {/* Banner */}
      <div className="relative add-property-bg text-white py-20 px-6 mb-8 overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 shadow-sm">
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
            {/* Image Gallery */}
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
                          onClick={() =>
                            setActiveImage(
                              (prev) =>
                                (prev - 1 + images.length) % images.length,
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 p-2.5 rounded-full shadow-lg text-gray-700 cursor-pointer"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() =>
                            setActiveImage((prev) => (prev + 1) % images.length)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 p-2.5 rounded-full shadow-lg text-gray-700 cursor-pointer"
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

            {/* Specs Grid */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              {/* Title & Price */}
              <div className="bg-white p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                      {property.bathrooms
                        ? `${property.bathrooms} Baths`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-gray-700 font-medium">
                    <Maximize className="text-orange-500 shrink-0" size={20} />
                    <span className="text-sm">
                      {property.area_sqft
                        ? `${property.area_sqft} sq.ft`
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-gray-700 font-medium">
                    <Car className="text-orange-500 shrink-0" size={20} />
                    <span className="text-sm">
                      {property.parking || "None"}
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

              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 border-b pb-3">
                  Description
                </h3>
                <p className="text-gray-600 text-base leading-relaxed">
                  {property.description || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Agent Contact Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xl uppercase">
                  {agentDisplayName[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {agentDisplayName}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Real Estate Agent / Owner
                  </p>
                </div>
              </div>

              <button
                onClick={handleContactAgentClick}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                Contact Agent
              </button>
            </div>

            {/* Similar Properties */}
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
                            className="w-full h-full object-cover"
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
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-4 text-center">
                  No similar properties found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* தனியாக பிரிக்கப்பட்ட Inquiry Modal Component இங்கே கால் செய்யப்பட்டுள்ளது */}
      <InquiryModal
        isOpen={inquiryModal}
        onClose={() => setInquiryModal(false)}
        inquiryForm={inquiryForm}
        onChange={handleInquiryChange}
        onSubmit={handleInquirySubmit}
        submitting={submitting}
      />
    </div>
  );
}
