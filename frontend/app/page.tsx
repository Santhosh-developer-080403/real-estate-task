"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import PropertyCard from "@/components/PropertyCard";
import {
  Search,
  MapPin,
  Home as HomeIcon,
  IndianRupee,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

export default function Home() {
  const [properties, setProperties] = useState < any > ([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/properties", {
        params: {
          search,
          city,
          property_type: propertyType,
          bedrooms,
          budget_range: budgetRange,
          sort,
          page,
          limit: 6,
        },
      });

      const data = response.data;
      if (Array.isArray(data)) {
        setProperties(data);
        setTotalPages(1);
      } else if (data && Array.isArray(data.properties)) {
        setProperties(data.properties);
        setTotalPages(data.totalPages || 1);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error("Failed to fetch properties", err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [search, city, propertyType, bedrooms, budgetRange, sort, page]);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Banner with Background Image & Orange Gradient Overlay */}
      <div className="relative banner-bg text-white py-24 px-6 mb-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 z-0"
        ></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-7xl mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Find Your Dream Home <br></br> in Chennai
            </h1>
            <p className="text-white text-base md:text-lg font-medium">
              Explore exclusive properties tailored for your lifestyle.
            </p>
          </div>

          {/* Reference-matching Pill-Shaped Unified Search & Filter Bar Including Sort */}
          <div className="bg-white p-2.5 rounded-3xl lg:rounded-full shadow-2xl flex flex-col lg:flex-row items-center gap-1 max-w-6xl text-black border border-orange-100">
            {/* 1. Location / City Input */}
            <div className="flex items-center px-4 py-3 w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-gray-200">
              <MapPin size={18} className="text-orange-500 mr-2.5 shrink-0" />
              <input
                type="text"
                placeholder="Chennai, India"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent focus:outline-none text-sm text-gray-800 placeholder-gray-400 font-medium"
              />
            </div>

            {/* 2. Property Type & Bedrooms Dropdown */}
            <div className="flex items-center px-4 py-3 w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-gray-200 relative">
              <HomeIcon size={18} className="text-orange-500 mr-2.5 shrink-0" />
              <select
                value={propertyType ? `${propertyType}_${bedrooms}` : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!val) {
                    setPropertyType("");
                    setBedrooms("");
                  } else {
                    const [pType, bCount] = val.split("_");
                    setPropertyType(pType);
                    setBedrooms(bCount || "");
                  }
                  setPage(1);
                }}
                className="w-full bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer font-medium appearance-none pr-6"
              >
                <option value="">Property & BHK</option>
                <option value="Villa_1">Villa, 1 Bed</option>
                <option value="Villa_2">Villa, 2 Bed</option>
                <option value="Villa_3">Villa, 3 Bed</option>
                <option value="Villa_4">Villa, 4 Bed</option>
                <option value="Villa_5">Villa, 5 Bed</option>
                <option value="Apartment_1">Apartment, 1 Bed</option>
                <option value="Apartment_2">Apartment, 2 Bed</option>
                <option value="Apartment_3">Apartment, 3 Bed</option>
                <option value="Apartment_4">Apartment, 4 Bed</option>
                <option value="Apartment_5">Apartment, 5 Bed</option>
                <option value="House_1">House, 1 Bed</option>
                <option value="House_2">House, 2 Bed</option>
                <option value="House_3">House, 3 Bed</option>
                <option value="House_4">House, 4 Bed</option>
                <option value="House_5">House, 5 Bed</option>
                <option value="Plot_">Plot (Common)</option>
              </select>
              <ChevronDown
                size={14}
                className="text-gray-400 absolute right-4 pointer-events-none"
              />
            </div>

            {/* 3. Budget Range Dropdown */}
            <div className="flex items-center px-4 py-3 w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-gray-200 relative">
              <IndianRupee
                size={16}
                className="text-orange-500 mr-2.5 shrink-0"
              />
              <select
                value={budgetRange}
                onChange={(e) => {
                  setBudgetRange(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer font-medium appearance-none pr-6"
              >
                <option value="">Select Budget</option>
                <option value="0-5000000">₹0 - ₹50 Lac</option>
                <option value="5000000-7500000">₹50 Lac - ₹75 Lac</option>
                <option value="7500000-10000000">₹75 Lac - ₹1 Cr</option>
                <option value="10000000-20000000">₹1 Cr - ₹2 Cr</option>
                <option value="20000000-50000000">₹2 Cr - ₹5 Cr</option>
              </select>
              <ChevronDown
                size={14}
                className="text-gray-400 absolute right-4 pointer-events-none"
              />
            </div>

            {/* 4. Sort By Dropdown inside the Pill */}
            <div className="flex items-center px-4 py-3 w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-gray-200 relative">
              <ArrowUpDown
                size={16}
                className="text-orange-500 mr-2.5 shrink-0"
              />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer font-medium appearance-none pr-6"
              >
                <option value="">Sort By: Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown
                size={14}
                className="text-gray-400 absolute right-4 pointer-events-none"
              />
            </div>

            {/* 5. Keyword Search Input & Go Button wrapped together */}
            <div className="flex items-center px-4 py-2 w-full lg:w-1/5 gap-2">
              <div className="flex items-center w-full">
                <Search size={18} className="text-orange-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-transparent focus:outline-none text-sm text-gray-800 placeholder-gray-400 font-medium"
                />
              </div>
              <button
                onClick={fetchProperties}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl lg:rounded-full transition shadow-md flex items-center justify-center tracking-wider text-sm shrink-0"
              >
                GO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property List Grid Section */}
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Featured Listings
        </h2>
        {loading ? (
          <p className="text-center text-gray-500 py-10 font-medium text-gray-500">
            Loading properties...
          </p>
        ) : !Array.isArray(properties) || properties.length === 0 ? (
          <p className="text-center text-gray-500 py-10 font-medium text-gray-500">
            No properties found matching your criteria.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 font-medium"
                >
                  Previous
                </button>
                <span className="text-gray-700 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50 font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
