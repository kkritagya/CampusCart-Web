"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateProfileAction, type AuthActionState } from "@/lib/actions/authentication_action";
import { useAuth } from "@/lib/context/AuthContext";
import "../profile.css";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

export default function UpdateProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialState);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [localSuccessMsg, setLocalSuccessMsg] = useState<string | null>(null);

  // Prefill the image preview if user already has a profile picture
  useEffect(() => {
    if (user?.profilePicture) {
      // Backend returns paths like /uploads/profile_pics/xxx
      // We prepend the backend origin
      const backendUrl = "http://localhost:5000";
      setImagePreview(`${backendUrl}${user.profilePicture}`);
    }
  }, [user]);

  // Sync user state in context upon successful update
  useEffect(() => {
    if (state.success) {
      setLocalSuccessMsg("Profile updated successfully!");
      refreshUser();
      // Clear message after 4 seconds
      const timer = setTimeout(() => setLocalSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [state.success, refreshUser]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Helper to get initials
  const getInitials = () => {
    if (!user) return "U";
    const name = user.fullName || user.name || user.email;
    return name.slice(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div className="profile-page flex items-center justify-center min-h-screen">
        <div className="spinner border-4 border-blue-500 border-t-transparent w-8 h-8 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link href="/dashboard" className="profile-brand" aria-label="CampusCart dashboard">
          <Image
            src="/campuscart-logo.png"
            alt="CampusCart"
            width={48}
            height={48}
            priority
          />
          <span>CampusCart</span>
        </Link>

        <div className="profile-header-actions">
          <Link href="/dashboard" className="profile-back-btn">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <div className="profile-heading">
            <p className="eyebrow">Settings</p>
            <h1>Edit Profile</h1>
            <p>Update your personal information and profile picture.</p>
          </div>

          <form action={formAction} className="profile-form">
            {/* Profile Picture Section */}
            <div className="avatar-upload-section">
              <div 
                className="avatar-preview-container" 
                onClick={triggerFileSelect}
                title="Click to change profile picture"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Avatar" className="avatar-img" />
                ) : (
                  <span className="avatar-initials">{getInitials()}</span>
                )}
                <div className="avatar-overlay">
                  <span>Change</span>
                </div>
              </div>
              <span className="avatar-upload-label" onClick={triggerFileSelect}>
                Upload new picture
              </span>
              <input
                ref={fileInputRef}
                type="file"
                name="profilePicture"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden-file-input"
                onChange={handleFileChange}
              />
            </div>

            {/* Error or Success alerts */}
            {state.message && !state.success ? (
              <div className="form-message form-message-error" role="alert">
                {state.message}
              </div>
            ) : null}

            {localSuccessMsg ? (
              <div className="form-message form-message-success" role="alert">
                {localSuccessMsg}
              </div>
            ) : null}

            {/* Full Name */}
            <label className="field" htmlFor="fullName">
              <span>Full Name</span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={user.fullName || user.name || ""}
                placeholder="Enter your full name"
                required
                disabled={isPending}
              />
              {state.fieldErrors?.fullName ? (
                <span className="field-error">{state.fieldErrors.fullName[0]}</span>
              ) : null}
            </label>

            {/* Email (Read Only) */}
            <label className="field" htmlFor="email">
              <span>Email Address (Unmodifiable)</span>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email}
                readOnly
                disabled
              />
            </label>

            {/* Phone */}
            <label className="field" htmlFor="phone">
              <span>Phone Number</span>
              <input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={user.phone || ""}
                placeholder="Enter your phone number"
                disabled={isPending}
              />
            </label>

            {/* Address */}
            <label className="field" htmlFor="address">
              <span>Address</span>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={user.address || ""}
                placeholder="Enter your campus address"
                disabled={isPending}
              />
            </label>

            {/* Form Actions */}
            <div className="form-buttons">
              <Link href="/dashboard" className="btn-cancel">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn-submit" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <span className="spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
