"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "../../components/loader";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
  customerId: string;
  memberSince: string;
  projects: number;
  gpuHours: number;
}

export default function ProfileById() {
  const params = useParams();
  const customerId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    company: "",
    bio: "",
    location: "",
    website: "",
    avatar: "",
    customerId: customerId,
    memberSince: "",
    projects: 0,
    gpuHours: 0
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/profile/${customerId}`);
        // if (!response.ok) throw new Error('Profile not found');
        // const data = await response.json();
        
        // Mock data for now - replace with actual API call
        const mockData: ProfileData = {
          fullName: customerId === "111113" ? "John Doe" : "Customer " + customerId,
          email: `customer${customerId}@operateev.ai`,
          phone: "+1 (555) 123-4567",
          jobTitle: "AI Engineer",
          company: "Operateev.ai",
          bio: `Profile for customer ${customerId}. Passionate about scaling AI infrastructure and building efficient GPU resource management systems.`,
          location: "San Francisco, CA",
          website: "https://operateev.ai",
          avatar: customerId === "111113" ? "JD" : (customerId.slice(-2) || "C"),
          customerId: customerId,
          memberSince: "Jan 2024",
          projects: Math.floor(Math.random() * 20) + 5,
          gpuHours: Math.floor(Math.random() * 2000) + 500
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProfileData(mockData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchProfileData();
    }
  }, [customerId]);

  const handleSave = async () => {
    try {
      // TODO: Implement API call to save profile data
      // const response = await fetch(`/api/profile/${customerId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profileData)
      // });
      // if (!response.ok) throw new Error('Failed to save profile');
      
      setIsEditing(false);
      // Show success message
      console.log('Profile saved successfully');
    } catch (err) {
      console.error('Error saving profile:', err);
      // Show error message
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Profile Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-sm text-gray-600">Customer ID: {customerId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Profile - Customer {customerId}
          </h1>
          <p className="text-gray-600">
            Manage personal information and account details for customer {customerId}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl font-bold mx-auto mb-4 flex items-center justify-center shadow-lg">
                  {profileData.avatar}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{profileData.fullName}</h3>
                <p className="text-gray-500 mb-2">{profileData.jobTitle}</p>
                <p className="text-sm text-gray-400 mb-4">ID: {customerId}</p>
                <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                  Change Photo
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">{profileData.memberSince}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-medium">{profileData.projects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">GPU Hours</span>
                  <span className="font-medium">{profileData.gpuHours.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-1">
                    Customer ID
                  </label>
                  <input
                    id="customerId"
                    type="text"
                    value={profileData.customerId}
                    disabled={true}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    id="jobTitle"
                    type="text"
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    id="website"
                    type="url"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                  </div>
                  <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition">
                    Change Password
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                    Enable 2FA
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-gray-900">API Keys</h3>
                    <p className="text-sm text-gray-500">Manage your API access tokens</p>
                  </div>
                  <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition">
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
