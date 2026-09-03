"use client";
import { Upload } from "lucide-react";

export default function PropertyImageUpload({ onFileChange }) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-1">
        <Upload size={16} className="text-orange-500" /> Upload Images from
        Device
      </label>
      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={onFileChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-black bg-gray-50/50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition text-sm cursor-pointer"
      />
      <p className="text-xs text-gray-400 mt-1">
        You can select multiple images at once.
      </p>
    </div>
  );
}
