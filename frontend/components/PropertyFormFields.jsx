"use client";

export default function PropertyFormFields({
  formData,
  displayPrice,
  handleChange,
}) {
  const isPlot = formData.property_type === "Plot";

  return (
    <>
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
          <label className="block text-gray-700 text-base font-semibold mb-2">
            City
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
          <label className="block text-gray-700 text-base font-semibold mb-2">
            Property Type
          </label>
          <select
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

      {/* Price & Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-gray-700 text-base font-semibold mb-2">
            Price (₹)
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
            <label className="block text-gray-700 text-base font-semibold mb-2">
              Area (Sq.Ft)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-gray-700 text-base font-semibold mb-2">
                Bedrooms (BHK)
              </label>
              <select
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
              <label className="block text-gray-700 text-base font-semibold mb-2">
                Bathrooms
              </label>
              <select
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-gray-700 text-base font-semibold mb-2">
                Parking Available
              </label>
              <select
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition text-sm"
              >
                <option value="Car Parking">Car Parking</option>
                <option value="Bike Parking">Bike Parking</option>
                <option value="Car & Bike Parking">Car & Bike Parking</option>
                <option value="None">None</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-base font-semibold mb-2">
                Furnishing Status
              </label>
              <select
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

          <div className="mb-5">
            <label className="block text-gray-700 text-base font-semibold mb-2">
              Facing Direction
            </label>
            <select
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
    </>
  );
}
