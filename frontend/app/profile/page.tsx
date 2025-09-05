"use client";

import React, { useEffect, useState } from "react";
import Loader from "../components/loader";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Nilesh Argade",
    email: "nilesh@operateev.ai",
    phone: "+1 (555) 123-4567",
    jobTitle: "AI Infrastructure Engineer",
    company: "Operateev.ai",
    bio: "Passionate about scaling AI infrastructure and building efficient GPU resource management systems.",
    location: "San Francisco, CA",
    website: "https://operateev.ai",
    avatar: "N"
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    // TODO: Implement API call to save profile data
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Page Header */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-slate-200/60 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="relative p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">👤</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Manage your personal information and account details
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Profile Picture Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-8 hover:shadow-3xl transition-all duration-300">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white text-5xl font-bold mx-auto mb-6 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    {profileData.avatar}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white">
                    <span className="text-indigo-500 text-xl">📷</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{profileData.fullName}</h3>
                <p className="text-indigo-600 font-semibold mb-6">{profileData.jobTitle}</p>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Change Photo
                </button>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-8 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="mr-3 text-2xl">📊</span>
                Account Stats
              </h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50">
                  <span className="text-gray-600 font-medium">Member since</span>
                  <span className="font-bold text-gray-900">Jan 2024</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50">
                  <span className="text-gray-600 font-medium">Projects</span>
                  <span className="font-bold text-green-700">12</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50">
                  <span className="text-gray-600 font-medium">GPU Hours</span>
                  <span className="font-bold text-orange-700">1,247</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-8 hover:shadow-3xl transition-all duration-300">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="mr-3 text-2xl">👤</span>
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 text-indigo-600 border-2 border-indigo-600 rounded-2xl font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>✏️</span>
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-all duration-300"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Security Section */}
            <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-8 hover:shadow-3xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="mr-3 text-2xl">🔒</span>
                Security & Privacy
              </h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl hover:border-indigo-200 transition-all duration-300 hover:bg-indigo-50/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm">🔑</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Password</h3>
                      <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300">
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl hover:border-green-200 transition-all duration-300 hover:bg-green-50/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm">🛡️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                    Enable 2FA
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl hover:border-purple-200 transition-all duration-300 hover:bg-purple-50/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm">🔐</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">API Keys</h3>
                      <p className="text-sm text-gray-500">Manage your API access tokens</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-purple-600 border-2 border-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300">
                    Manage Keys
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
