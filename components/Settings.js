"use client";

import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { db, auth, doc, getDoc, setDoc, updateDoc } from "../lib/firebase";
import { sendPasswordResetEmail, signOut } from "../lib/firebase";
import { useRouter } from "next/navigation";

const Settings = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    },
    preferences: {
      theme: "system",
      language: "en",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currency: "USD",
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false,
      searchVisibility: false,
    },
  });

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        try {
          const settingsDoc = await getDoc(doc(db, "userSettings", user.uid));
          if (settingsDoc.exists()) {
            setSettings((prev) => ({ ...prev, ...settingsDoc.data() }));
          }
        } catch (error) {
          console.error("Error fetching settings:", error);
        }
      }
    };

    fetchSettings();
  }, [user]);

  const handleSettingChange = (category, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await setDoc(doc(db, "userSettings", user.uid), settings, {
        merge: true,
      });
      // Show success feedback
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, user.email);
      alert(
        "Password reset email sent! Check your inbox for further instructions."
      );
    } catch (error) {
      console.error("Error sending reset email:", error);
      alert("Error sending reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Note: In a real app, you'd need to implement proper account deletion
      // This would involve deleting user data and then the auth account
      alert(
        "Account deletion feature would be implemented here with proper backend setup."
      );
    }
  };

  const tabs = [
    { id: "account", name: "Account", },
    { id: "notifications", name: "Notifications",},
    { id: "preferences", name: "Preferences", },
    { id: "privacy", name: "Privacy", },
    { id: "danger", name: "Danger Zone", },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>

              {/* Save Button */}
              <button
                onClick={saveSettings}
                disabled={loading}
                className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Account Settings
                </h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Email Address
                      </h3>
                      <p className="text-gray-600 text-sm">{user?.email}</p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                      Primary
                    </span>
                  </div>

                  {/* Password */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">Password</h3>
                      <p className="text-gray-600 text-sm">
                        Last changed: Recently
                      </p>
                    </div>
                    <button
                      onClick={handlePasswordReset}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Reset Password
                    </button>
                  </div>

                  {/* Account Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Account Created
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {user?.metadata?.creationTime
                          ? new Date(
                              user.metadata.creationTime
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Last Sign In
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {user?.metadata?.lastSignInTime
                          ? new Date(
                              user.metadata.lastSignInTime
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  {Object.entries(settings.notifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900 capitalize">
                            {key === "push"
                              ? "Push Notifications"
                              : key === "sms"
                              ? "SMS Alerts"
                              : key === "marketing"
                              ? "Marketing Emails"
                              : `${key} Notifications`}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {key === "email" &&
                              "Receive important updates via email"}
                            {key === "push" &&
                              "Get real-time notifications in your browser"}
                            {key === "sms" && "Receive text message alerts"}
                            {key === "marketing" &&
                              "Get updates about new features and promotions"}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              handleSettingChange(
                                "notifications",
                                key,
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  App Preferences
                </h2>

                <div className="space-y-6">
                  {/* Theme */}
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {["light", "dark", "system"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() =>
                            handleSettingChange("preferences", "theme", theme)
                          }
                          className={`p-3 border-2 rounded-lg text-center capitalize transition-all ${
                            settings.preferences.theme === theme
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language */}
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Language
                    </h3>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) =>
                        handleSettingChange(
                          "preferences",
                          "language",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Timezone
                    </h3>
                    <select
                      value={settings.preferences.timezone}
                      onChange={(e) =>
                        handleSettingChange(
                          "preferences",
                          "timezone",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="America/New_York">
                        Eastern Time (ET)
                      </option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">
                        Pacific Time (PT)
                      </option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === "privacy" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Privacy & Security
                </h2>

                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Profile Visibility
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          value: "public",
                          label: "Public",
                          desc: "Anyone can see your profile",
                        },
                        {
                          value: "private",
                          label: "Private",
                          desc: "Only you can see your profile",
                        },
                        {
                          value: "friends",
                          label: "Friends Only",
                          desc: "Only approved friends can see your profile",
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className="flex items-start space-x-3 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="visibility"
                            value={option.value}
                            checked={
                              settings.privacy.profileVisibility ===
                              option.value
                            }
                            onChange={(e) =>
                              handleSettingChange(
                                "privacy",
                                "profileVisibility",
                                e.target.value
                              )
                            }
                            className="mt-1 text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600">
                              {option.desc}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Data Sharing */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Data Sharing
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Allow anonymous usage data to help improve our service
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.dataSharing}
                        onChange={(e) =>
                          handleSettingChange(
                            "privacy",
                            "dataSharing",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Search Visibility */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Search Engine Visibility
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Allow search engines to index your profile
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.privacy.searchVisibility}
                        onChange={(e) =>
                          handleSettingChange(
                            "privacy",
                            "searchVisibility",
                            e.target.checked
                          )
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            {activeTab === "danger" && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-red-200">
                <h2 className="text-2xl font-bold text-red-700 mb-2">
                  Danger Zone
                </h2>
                <p className="text-red-600 mb-6">
                  Irreversible and destructive actions
                </p>

                <div className="space-y-6">
                  {/* Sign Out */}
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50">
                    <div>
                      <h3 className="font-semibold text-red-700">Sign Out</h3>
                      <p className="text-red-600 text-sm">
                        Sign out from all devices
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        signOut().then(() => router.push("/login"))
                      }
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </div>

                  {/* Delete Account */}
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-red-50">
                    <div>
                      <h3 className="font-semibold text-red-700">
                        Delete Account
                      </h3>
                      <p className="text-red-600 text-sm">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Delete Account
                    </button>
                  </div>

                  {/* Export Data */}
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Export Data
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Download all your personal data
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        alert("Data export feature would be implemented here.")
                      }
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
