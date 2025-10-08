"use client";

import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db, doc, getDoc, setDoc, updateDoc } from "../lib/firebase";

const UserProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    address: "",
    location: {
      latitude: "",
      longitude: "",
    },
  });

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          setLoading(true);
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            // Create initial user document if it doesn't exist
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              name: "",
              phone: "",
              address: "",
              location: {
                latitude: "",
                longitude: "",
              },
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setUserData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      await updateDoc(doc(db, "users", user.uid), userData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserData((prev) => ({
            ...prev,
            location: {
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
            },
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your current location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-2">
                Manage your personal information
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={user?.uid || "N/A"}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Address
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <textarea
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                placeholder="Enter your complete address"
              />
            </div>
          </div>

          {/* Location (Optional) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              {isEditing && (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium"
                >
                  📍 Get Current Location
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your GPS coordinates (optional)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  name="location.latitude"
                  value={userData.location.latitude}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="e.g., 40.7128"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  name="location.longitude"
                  value={userData.location.longitude}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 text-black border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="e.g., -74.0060"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile Completion Status */}
        {!isEditing && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Completion
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (userData.name ? 25 : 0) +
                      (userData.phone ? 25 : 0) +
                      (userData.address ? 25 : 0) +
                      (userData.location.latitude && userData.location.longitude
                        ? 25
                        : 0)
                    }%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                {(userData.name ? 25 : 0) +
                  (userData.phone ? 25 : 0) +
                  (userData.address ? 25 : 0) +
                  (userData.location.latitude && userData.location.longitude
                    ? 25
                    : 0)}
                %
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
              <div
                className={`flex items-center space-x-2 ${
                  userData.name ? "text-green-600" : "text-gray-400"
                }`}
              >
                <span>{userData.name ? "✓" : "○"}</span>
                <span>Name</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  userData.phone ? "text-green-600" : "text-gray-400"
                }`}
              >
                <span>{userData.phone ? "✓" : "○"}</span>
                <span>Phone</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  userData.address ? "text-green-600" : "text-gray-400"
                }`}
              >
                <span>{userData.address ? "✓" : "○"}</span>
                <span>Address</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${
                  userData.location.latitude && userData.location.longitude
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <span>
                  {userData.location.latitude && userData.location.longitude
                    ? "✓"
                    : "○"}
                </span>
                <span>Location</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
