"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { changePasswordAction, type AuthActionState } from "@/lib/actions/authentication_action";
import { useAuth } from "@/lib/context/AuthContext";
import "../profile.css";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

export default function ChangePasswordPage() {
  const { user } = useAuth();
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);
  const [localSuccessMsg, setLocalSuccessMsg] = useState<string | null>(null);

  // Clear form inputs and show local success message on success
  useEffect(() => {
    if (state.success) {
      setLocalSuccessMsg("Password updated successfully!");
      const timer = setTimeout(() => setLocalSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [state.success]);

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
            <p className="eyebrow">Security</p>
            <h1>Change Password</h1>
            <p>Update your password to keep your account secure.</p>
          </div>

          <form action={formAction} className="profile-form">
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

            {/* Current Password */}
            <label className="field" htmlFor="currentPassword">
              <span>Current Password</span>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                required
                disabled={isPending}
              />
              {state.fieldErrors?.currentPassword ? (
                <span className="field-error">{state.fieldErrors.currentPassword[0]}</span>
              ) : null}
            </label>

            {/* New Password */}
            <label className="field" htmlFor="newPassword">
              <span>New Password (Min. 6 characters)</span>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                required
                disabled={isPending}
              />
              {state.fieldErrors?.newPassword ? (
                <span className="field-error">{state.fieldErrors.newPassword[0]}</span>
              ) : null}
            </label>

            {/* Confirm Password */}
            <label className="field" htmlFor="confirmPassword">
              <span>Confirm New Password</span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                required
                disabled={isPending}
              />
              {state.fieldErrors?.confirmPassword ? (
                <span className="field-error">{state.fieldErrors.confirmPassword[0]}</span>
              ) : null}
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
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
