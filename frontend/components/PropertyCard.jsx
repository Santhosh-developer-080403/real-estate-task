// import Link from "next/link";
// import API, { API_URL } from "@/services/api";
// import {
//   Home,
//   MapPin,
//   IndianRupee,
//   Bed,
//   Bath,
//   Maximize,
//   ArrowRight,
// } from "lucide-react";

// export default function PropertyCard({ property }) {
//   let imageUrl = "https://via.placeholder.com/400x300?text=No+Image";

//   if (property && property.images) {
//     let imgs = property.images;
//     if (typeof imgs === "string") {
//       try {
//         imgs = JSON.parse(imgs);
//       } catch (e) {
//         imgs = [imgs];
//       }
//     }
//     const imgPath = imgs[0];

//     if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
//       imageUrl = imgPath;
//     } else {
//       imageUrl = `${API_URL}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
//     }
//   }

//   const formatIndianCurrency = (amount) => {
//     if (!amount) return "0";
//     return new Intl.NumberFormat("en-IN", {
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   return (
//     <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-3 flex flex-col justify-between group">
//       <div>
//         <div className="h-52 rounded-2xl bg-gray-100 relative overflow-hidden">
//           {imageUrl && !imageUrl.includes("placeholder") ? (
//             <img
//               src={imageUrl}
//               alt={property.title || "Property Image"}
//               className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
//             />
//           ) : (
//             <div className="flex items-center justify-center h-full text-gray-400">
//               No Image Available
//             </div>
//           )}

//           <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md z-10">
//             {property.property_type || "FEATURED"}
//           </span>

//           {/* Bottom-Left: Price Tag Overlay with Indian Formatting */}
//           <div className="absolute bottom-3 left-3 bg-orange-600/90 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-xl font-extrabold shadow-md flex items-center z-10">
//             <IndianRupee size={14} />
//             {formatIndianCurrency(property.price)}
//           </div>
//         </div>

//         <div className="p-3">
//           <h3 className="text-lg font-bold text-gray-900 truncate">
//             {property.title}
//           </h3>
//           <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
//             <MapPin size={15} className="text-orange-500 shrink-0" />{" "}
//             {property.city}
//           </p>

//           {/* Specs Row: Beds, Baths, SqFt */}
//           <div className="flex items-center justify-between text-gray-600 text-xs font-medium my-4 py-2 border-y border-gray-100">
//             <div className="flex items-center gap-1.5">
//               <Bed size={15} className="text-orange-500" />
//               <span>{property.bedrooms || 1} Beds</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Bath size={15} className="text-orange-500" />
//               <span>{property.bathrooms || 1} Baths</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <Maximize size={15} className="text-orange-500" />
//               <span>{property.area_sqft || 0} SqFt</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="px-3 pb-2">
//         <Link
//           href={`/properties/${property.id}`}
//           className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl transition shadow-lg shadow-orange-500/20 text-sm"
//         >
//           View Property <ArrowRight size={16} />
//         </Link>
//       </div>
//     </div>
//   );
// }


import Link from "next/link";
import {
  MapPin,
  IndianRupee,
  Bed,
  Bath,
  Maximize,
  ArrowRight,
} from "lucide-react";

import { API_URL } from "@/services/api";

export default function PropertyCard({ property }) {
  let imageUrl = "https://via.placeholder.com/400x300?text=No+Image";


  if (property && property.images) {
    let imgs = property.images;

    if (typeof imgs === "string") {
      try {
        imgs = JSON.parse(imgs);
      } catch (e) {
        imgs = [imgs];
      }
    }

    if (!Array.isArray(imgs)) {
      imgs = [imgs];
    }

    imgs = imgs.filter(
      (img) => typeof img === "string" && img.trim().length > 0
    );

    if (imgs.length > 0) {
      const imgPath = imgs[0].trim();

      if (
        imgPath.startsWith("http://") ||
        imgPath.startsWith("https://")
      ) {
        imageUrl = imgPath;
      } else {
        imageUrl = `${API_URL}${
          imgPath.startsWith("/") ? "" : "/"
        }${imgPath}`;
      }
    }
  }


  const formatIndianCurrency = (amount) => {
    if (!amount) return "0";

    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 p-3 flex flex-col justify-between group">
      <div>

        <div className="h-52 rounded-2xl bg-gray-100 relative overflow-hidden">
          {imageUrl && !imageUrl.includes("placeholder") ? (
            <img
              src={imageUrl}
              alt={property?.title || "Property Image"}
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              onError={(e) => {
                // If image fails, show placeholder
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.innerHTML = `
                  <div class="flex items-center justify-center h-full text-gray-400">
                    No Image Available
                  </div>
                `;
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No Image Available
            </div>
          )}

          {/* Property Type */}
          <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md z-10">
            {property?.property_type || "FEATURED"}
          </span>

          {/* Price */}
          <div className="absolute bottom-3 left-3 bg-orange-600/90 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-xl font-extrabold shadow-md flex items-center z-10">
            <IndianRupee size={14} />
            {formatIndianCurrency(property?.price)}
          </div>
        </div>


        <div className="p-3">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {property?.title || "Untitled Property"}
          </h3>

          <p className="flex items-center gap-1 text-gray-500 text-sm mt-1">
            <MapPin size={15} className="text-orange-500 shrink-0" />
            {property?.city || "Location unavailable"}
          </p>

          {/* Specs Row */}
          <div className="flex items-center justify-between text-gray-600 text-xs font-medium my-4 py-2 border-y border-gray-100">
            <div className="flex items-center gap-1.5">
              <Bed size={15} className="text-orange-500" />
              <span>{property?.bedrooms || 1} Beds</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Bath size={15} className="text-orange-500" />
              <span>{property?.bathrooms || 1} Baths</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Maximize size={15} className="text-orange-500" />
              <span>{property?.area_sqft || 0} SqFt</span>
            </div>
          </div>
        </div>
      </div>


      <div className="px-3 pb-2">
        <Link
          href={`/properties/${property?.id}`}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl transition shadow-lg shadow-orange-500/20 text-sm"
        >
          View Property
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
