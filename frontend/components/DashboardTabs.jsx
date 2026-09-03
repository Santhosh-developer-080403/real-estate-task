"use client";

export default function DashboardTabs({
  activeTab,
  setActiveTab,
  propertiesCount,
  inquiriesCount,
}) {
  return (
    <div className="w-full border-b border-gray-200 mb-8 overflow-x-auto">
      <div className="flex justify-between sm:justify-center items-center gap-6 sm:gap-16 w-full min-w-max px-2">
        <button
          onClick={() => setActiveTab("properties")}
          className={`pb-3 font-bold text-base transition flex items-center gap-2 border-b-2 shrink-0 cursor-pointer ${
            activeTab === "properties"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          My Properties ({propertiesCount})
        </button>
        <button
          onClick={() =>
            setActiveTab.current?.("inquiries") || setActiveTab("inquiries")
          }
          className={`pb-3 font-bold text-base transition flex items-center gap-2 border-b-2 shrink-0 cursor-pointer ${
            activeTab === "inquiries"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Received Inquiries ({inquiriesCount})
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 font-bold text-base transition flex items-center gap-2 border-b-2 shrink-0 cursor-pointer ${
            activeTab === "profile"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
