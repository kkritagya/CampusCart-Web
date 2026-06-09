"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import "../login/login.css";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState("");

  function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormMessage("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setFormMessage("Passwords do not match.");
      return;
    }

    router.push("/login");
  }

  return (
    <main className="auth-shell">
      <div className="auth-card auth-card-register">
        <section className="auth-panel" aria-labelledby="register-heading">
          <div className="auth-panel-inner">
            <Link href="/" className="brand-lockup auth-mobile-brand" aria-label="CampusCart home">
              <Image src="/campuscart-logo.png" alt="CampusCart" width={180} height={180} className="brand-logo" priority />
            </Link>

            <div className="auth-heading">
              <p className="eyebrow">Create account</p>
              <h2 id="register-heading">Join CampusCart</h2>
              <p>Set up your student marketplace account in under a minute.</p>
            </div>

            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <label className="field" htmlFor="fullName">
                <span>Full name</span>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Morgan"
                  required
                />
              </label>

              <label className="field" htmlFor="email">
                <span>Email</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  required
                />
              </label>

              <label className="field" htmlFor="password">
                <span>Password</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  required
                />
              </label>

              <label className="field" htmlFor="confirmPassword">
                <span>Confirm password</span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  required
                />
              </label>

              {formMessage ? (
                <p className="form-message" role="alert">
                  {formMessage}
                </p>
              ) : null}

              <button type="submit" className="auth-button">
                Create account
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </div>
        </section>

        <section className="auth-showcase register-showcase" aria-label="CampusCart benefits">
          <div>
            <Link href="/" className="brand-lockup" aria-label="CampusCart home">
              <Image src="/campuscart-logo.png" alt="CampusCart" width={180} height={180} className="brand-logo" priority />
            </Link>

            <div className="showcase-copy">
              <p className="eyebrow">Verified campus community</p>
              <h1>Start buying and selling where students already are.</h1>
              <p>
                Keep deals local, discover useful listings, and message students you can trust.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
