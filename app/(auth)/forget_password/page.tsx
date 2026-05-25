import Image from "next/image";
import Link from "next/link";
import "../login/login.css";
import "./forgot_password.css";

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

        <form className="auth-form">
          <label className="field" htmlFor="email">
            <span>Email</span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@campus.edu"
              required
            />
          </label>

          <button type="submit" className="auth-button">
            Send reset link
          </button>
        </form>

        <p className="auth-switch">
          Remembered it? <Link href="/login">Back to login</Link>
        </p>
      </div>
    </main>
  );
}
