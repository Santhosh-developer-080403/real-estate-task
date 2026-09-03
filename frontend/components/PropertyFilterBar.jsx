"use client";
import {
  Search,
  MapPin,
  Home as HomeIcon,
  IndianRupee,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";

export default function PropertyFilterBar({
  city,
  setCity,
  propertyType,
  setPropertyType,
  bedrooms,
  setBedrooms,
  budgetRange,
  setBudgetRange,
  sort,
  setSort,
  search,
  setSearch,
  setPage,
  onSearchClick,
}) {
  return (
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
          className="w-full bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:outline-none text-sm text-gray-800 placeholder-gray-400 font-medium transition"
        />
      </div>

      {/* 2. Property Type & Bedrooms Dropdown */}
      <div className="flex items-center px-4 py-3 w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-gray-200 relative">
        <HomeIcon size={18} className="text-orange-500 mr-2.5 shrink-0" />
        <div className="relative w-full">
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
            className="w-full bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:outline-none text-sm text-gray-800 cursor-pointer font-medium appearance-none pr-8"
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
            className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {/* 3. Budget Range Dropdown */}
      <div className="flex items-center px-4 py-3 w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-gray-200 relative">
        <IndianRupee size={16} className="text-orange-500 mr-2.5 shrink-0" />
        <div className="relative w-full">
          <select
            value={budgetRange}
            onChange={(e) => {
              setBudgetRange(e.target.value);
              setPage(1);
            }}
            className="w-full bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:outline-none text-sm text-gray-800 cursor-pointer font-medium appearance-none pr-8"
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
            className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {/* 4. Sort By Dropdown inside the Pill */}
      <div className="flex items-center px-4 py-3 w-full lg:w-1/5 border-b lg:border-b-0 lg:border-r border-gray-200 relative">
        <ArrowUpDown size={16} className="text-orange-500 mr-2.5 shrink-0" />
        <div className="relative w-full">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="w-full bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:outline-none text-sm text-gray-800 cursor-pointer font-medium appearance-none pr-8"
          >
            <option value="">Sort By: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
          <ChevronDown
            size={14}
            className="text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>
      </div>

      {/* 5. Keyword Search Input & Go Button */}
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
            className="w-full bg-gray-50/80 px-3 py-1.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:outline-none text-sm text-gray-800 placeholder-gray-400 font-medium transition"
          />
        </div>
        <button
          onClick={onSearchClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl lg:rounded-full transition shadow-md flex items-center justify-center tracking-wider text-sm shrink-0"
        >
          GO
        </button>
      </div>
    </div>
  );
}
