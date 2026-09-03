"use client";
import { useState, useEffect } from "react";
import API from "@/services/api";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilterBar from "@/components/PropertyFilterBar";

export default function Home() {
  const [properties, setProperties] = useState([]);
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
        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-7xl mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              Find Your Dream Home <br /> in Chennai
            </h1>
            <p className="text-white text-base md:text-lg font-medium">
              Explore exclusive properties tailored for your lifestyle.
            </p>
          </div>

          {/* Extracted Filter Component */}
          <PropertyFilterBar
            city={city}
            setCity={setCity}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            budgetRange={budgetRange}
            setBudgetRange={setBudgetRange}
            sort={sort}
            setSort={setSort}
            search={search}
            setSearch={setSearch}
            setPage={setPage}
            onSearchClick={fetchProperties}
          />
        </div>
      </div>

      {/* Property List Grid Section */}
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Featured Listings
        </h2>
        {loading ? (
          <p className="text-center text-gray-500 py-10 font-medium">
            Loading properties...
          </p>
        ) : !Array.isArray(properties) || properties.length === 0 ? (
          <p className="text-center text-gray-500 py-10 font-medium">
            No properties found matching your criteria.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property) => (
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
