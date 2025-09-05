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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Page Header */}
        <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl border border-slate-200/60 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-2xl font-bold text-white">👤</span>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                  Profile
                </h1>
                <p className="text-base sm:text-lg text-slate-600 mt-2">
                  Manage your personal information and account details
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Enhanced Profile Picture Section */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-6 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white text-2xl lg:text-3xl font-bold mx-auto flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <span className="relative z-10">{profileData.avatar}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-3 border-white cursor-pointer hover:scale-110 transition-transform duration-200">
                    <span className="text-indigo-500 text-sm lg:text-base">📷</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight">{profileData.fullName}</h3>
                  <p className="text-indigo-600 font-semibold text-sm">{profileData.jobTitle}</p>
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs">
                    <span>📍</span>
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-gray-500 text-xs">
                    <span>🏢</span>
                    <span>{profileData.company}</span>
                  </div>
                </div>

                <button className="w-full px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm">
                  Change Photo
                </button>
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-6 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2 text-lg">📊</span>
                Account Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">📅</span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">Member since</span>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">Jan 2024</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">🚀</span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">Projects</span>
                  </div>
                  <span className="font-bold text-green-700 text-sm">12</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">GPU Hours</span>
                  </div>
                  <span className="font-bold text-orange-700 text-sm">1,247</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xs">⭐</span>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">Rating</span>
                  </div>
                  <span className="font-bold text-blue-700 text-sm">4.9/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Profile Information */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-6 hover:shadow-3xl transition-all duration-300">
              <div className="flex flex-col space-y-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <span className="mr-2 text-lg">👤</span>
                  Personal Info
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="self-start px-4 py-2 text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300 flex items-center space-x-2 text-sm"
                  >
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-y-2 flex-col">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Second Row - Additional Information */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Company & Location */}
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-6 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2 text-lg">🏢</span>
                Work Info
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-300 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-6 hover:shadow-3xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2 text-lg">📝</span>
                About Me
              </h3>
              <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={6}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none transition-all duration-300 text-sm"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Enhanced Security Section */}
            <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200/60 p-6 hover:shadow-3xl transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2 text-lg">🔒</span>
                Security
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col space-y-3 p-3 border-2 border-gray-100 rounded-xl hover:border-indigo-200 transition-all duration-300 hover:bg-indigo-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">🔑</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">Password</h3>
                      <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 text-indigo-600 border-2 border-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-all duration-300 text-sm">
                    Change Password
                  </button>
                </div>

                <div className="flex flex-col space-y-3 p-3 border-2 border-gray-100 rounded-xl hover:border-green-200 transition-all duration-300 hover:bg-green-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">🛡️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">Two-Factor Auth</h3>
                      <p className="text-xs text-gray-500">Extra security layer</p>
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm">
                    Enable 2FA
                  </button>
                </div>

                <div className="flex flex-col space-y-3 p-3 border-2 border-gray-100 rounded-xl hover:border-purple-200 transition-all duration-300 hover:bg-purple-50/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">🔐</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">API Keys</h3>
                      <p className="text-xs text-gray-500">Manage access tokens</p>
                    </div>
                  </div>
                  <button className="w-full px-3 py-2 text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-300 text-sm">
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

