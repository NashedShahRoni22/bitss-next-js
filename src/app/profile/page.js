"use client";
import { useEffect, useState } from "react";
import {
  Globe,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Save,
  Settings,
  User,
  X,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import PrivateRoute from "@/components/shared/PrivateRoute";
import SectionContainer from "@/components/shared/SectionContainer";

export default function Profile() {
  const { authInfo } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: authInfo?.user?.name,
    email: authInfo?.user?.email,
    personal_email: authInfo?.user?.personal_email,
    address: authInfo?.user?.address,
    country: authInfo?.user?.country,
    username: authInfo?.user?.username,
  });

  // update formData on component mount with authInfo
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: authInfo?.user?.name,
      email: authInfo?.user?.email,
      personal_email: authInfo?.user?.personal_email,
      address: authInfo?.user?.address,
      country: authInfo?.user?.country,
      username: authInfo?.user?.username,
    }));
  }, [authInfo]);

  const getInitials = (name) => {
    if (name) {
      return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would call your API to update user data
    // console.log("Saving profile data:", formData);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      name: authInfo?.user?.name,
      email: authInfo?.user?.email,
      personal_email: authInfo?.user?.personal_email,
      address: authInfo?.user?.address,
      country: authInfo?.user?.country,
      username: authInfo?.user?.username,
    });
    setIsEditing(false);
  };

  return (
    <PrivateRoute>
      <SectionContainer>
        {/* Header Section */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div className="flex items-center space-x-4">
              {/* Profile Avatar */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-2xl font-bold text-white">
                {getInitials(authInfo?.user?.name)}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {authInfo?.user?.name}
                </h1>
                <p className="text-gray-600">@{authInfo?.user?.username}</p>
                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      authInfo?.user?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        authInfo?.user?.status === "active"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      }`}
                    ></span>
                    {authInfo?.user?.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-700"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center rounded-md bg-gray-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center text-lg font-semibold text-gray-900">
                <User className="mr-2 h-5 w-5 text-red-600" />
                Profile Information
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">{authInfo?.user?.name}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">
                      @{authInfo?.user?.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <Mail className="mr-1 inline h-4 w-4" />
                    Primary Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">
                      {authInfo?.user?.email}
                    </p>
                  )}
                </div>

                {/* Personal Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Personal Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="personal_email"
                      value={formData.personal_email}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">
                      {authInfo?.user?.personal_email}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <MapPin className="mr-1 inline h-4 w-4" />
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">
                      {authInfo?.user?.address}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    <Globe className="mr-1 inline h-4 w-4" />
                    Country
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  ) : (
                    <p className="py-2 text-gray-900">
                      {authInfo?.user?.country}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Details & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                <Settings className="mr-2 h-5 w-5 text-red-600" />
                Quick Actions
              </h2>

              <div className="space-y-3">
                <button className="flex w-full items-center rounded-md px-4 py-3 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50">
                  <Lock className="mr-3 h-4 w-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </PrivateRoute>
  );
}
