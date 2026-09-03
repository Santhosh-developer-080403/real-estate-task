import { Save } from "lucide-react";

export default function EditProfile({
  profileForm,
  profileLoading,
  profileUpdating,
  onChange,
  onSubmit,
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Edit Your <span className="text-orange-500">Profile</span>
      </h2>
      {profileLoading ? (
        <p className="text-center text-gray-500 py-6">Loading profile...</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profileForm.name}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={profileForm.phone}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={profileForm.address}
              onChange={onChange}
              placeholder="Enter your address..."
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Are you an Owner or Agent?
            </label>
            <select
              name="role"
              value={profileForm.role}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="Owner">Owner</option>
              <option value="Agent">Agent</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={profileForm.password}
              onChange={onChange}
              placeholder="Enter new password if you want to change"
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Bio / About You
            </label>
            <textarea
              name="bio"
              value={profileForm.bio}
              onChange={onChange}
              rows="3"
              placeholder="Tell clients about yourself or your agency..."
              className="w-full px-4 py-2 border rounded-xl text-black bg-gray-50 focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={profileUpdating}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {profileUpdating ? "Saving Profile..." : "Save Profile Details"}
          </button>
        </form>
      )}
    </div>
  );
}
