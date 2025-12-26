"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSave, FaSignOutAlt, FaEdit } from "react-icons/fa";
import Cookies from "js-cookie";
import { updateUser, getCurrentUserProfile } from "@/services/userApi";
import { logout } from "@/services/authService";
import PhoneInput from "@/components/ui/PhoneInput";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("DE");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!token) {
        router.push('/user/signin?returnUrl=/user/profile');
        return;
      }

      const response = await getCurrentUserProfile(token);
      const userData = response.data;
      setProfile({
        name: userData.name,
        email: userData.email,
        phone: userData.phoneNo || '',
      });
      setName(userData.name);
      setEmail(userData.email);
      setPhone((userData.phoneNo || '').replace('+49', ''));
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err instanceof Error && err.message.includes('401')) {
        router.push('/user/signin?returnUrl=/user/profile');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!token) {
        router.push('/user/signin?returnUrl=/user/profile');
        return;
      }

      const updateData: {
        name?: string;
        phoneNo?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        name,
        phoneNo: `+49${phone}`,
      };

      // Only include password if user wants to change it
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError("New passwords do not match");
          setSaving(false);
          return;
        }
        if (newPassword.length < 8) {
          setError("Password must be at least 8 characters");
          setSaving(false);
          return;
        }
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const response = await updateUser(updateData, token);
      
      if (response.success) {
        setProfile({
          name,
          email,
          phone: `+49${phone}`,
        });
        setSuccess("Profile updated successfully!");
        setEditMode(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleCancel = () => {
    setEditMode(false);
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone.replace('+49', ''));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e30232] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#e30232] rounded-full flex items-center justify-center">
                <FaUser className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                <p className="text-sm text-gray-600">Manage your account settings</p>
              </div>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#e30232] text-white rounded-lg hover:bg-[#c40228] transition"
              >
                <FaEdit />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                <FaUser className="text-[#e30232]" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] disabled:bg-gray-100 disabled:text-gray-600"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                <FaEnvelope className="text-[#e30232]" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] disabled:bg-gray-100 disabled:text-gray-600"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
                <FaPhone className="text-[#e30232]" />
                Phone Number
              </label>
              {editMode ? (
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  country={country}
                  setCountry={setCountry}
                />
              ) : (
                <input
                  type="text"
                  value={`+49${phone}`}
                  disabled
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
              )}
            </div>

            {/* Password Change Section (only in edit mode) */}
            {editMode && (
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaLock className="text-[#e30232]" />
                  Change Password
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Leave blank if you don't want to change your password
                </p>

                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="font-semibold text-gray-800 mb-2 block">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232]"
                      placeholder="Enter current password"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="font-semibold text-gray-800 mb-2 block">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232]"
                      placeholder="Enter new password (min 8 characters)"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="font-semibold text-gray-800 mb-2 block">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232]"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {editMode && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#e30232] text-white rounded-lg hover:bg-[#c40228] transition disabled:opacity-50 font-semibold"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => router.push('/user/orders')}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-2 border-transparent hover:border-[#e30232] text-left"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">Order History</h3>
            <p className="text-sm text-gray-600">View all your past orders</p>
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition border-2 border-transparent hover:border-red-500 text-left"
          >
            <div className="flex items-center gap-3">
              <FaSignOutAlt className="text-2xl text-red-500" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Logout</h3>
                <p className="text-sm text-gray-600">Sign out of your account</p>
              </div>
            </div>
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="btn bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
