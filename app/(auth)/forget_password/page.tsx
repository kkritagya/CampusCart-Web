import Image from "next/image";
import Link from "next/link";
import "../login/login.css";
import "./forgot_password.css";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgetPasswordPage() {
  return (
    <main className="auth-shell">
      <div className="password-card">
        <Link href="/" className="brand-lockup" aria-label="CampusCart home">
          <Image src="/campuscart-logo.png" alt="CampusCart" width={180} height={180} className="brand-logo" priority />
        </Link>

        <div className="auth-heading">
          <p className="eyebrow">Password help</p>
          <h1>Forgot your password?</h1>
          <p>Enter your email and we&apos;ll send reset instructions for your CampusCart account.</p>
        </div>

        <ForgotPasswordForm />

        <p className="auth-switch">
          Remembered it? <Link href="/login">Back to login</Link>
        </p>
      </div>
    </main>
  );
}
