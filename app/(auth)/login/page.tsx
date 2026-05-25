"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";
import "./login.css";

export default function LoginPage() {
  function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.alert("Login successful!");
    event.currentTarget.reset();
  }

  return (
    <main className="auth-shell">
      <div className="auth-card auth-card-login">
        <section className="auth-showcase" aria-label="CampusCart highlights">
          <div>
            <Link href="/" className="brand-lockup" aria-label="CampusCart home">
              <Image src="/campuscart-logo.png" alt="CampusCart" width={180} height={180} className="brand-logo" priority />
            </Link>

            <div className="showcase-copy">
              <p className="eyebrow">Student marketplace</p>
              <h1>Welcome back to your campus exchange.</h1>
              <p>
                Buy, sell, rent, and trade with verified students around your school.
              </p>
            </div>
          </div>
        </section>

        <section className="auth-panel" aria-labelledby="login-heading">
          <div className="auth-panel-inner">
            <Link href="/" className="brand-lockup auth-mobile-brand" aria-label="CampusCart home">
              <Image src="/campuscart-logo.png" alt="CampusCart" width={180} height={180} className="brand-logo" priority />
            </Link>

            <div className="auth-heading">
              <p className="eyebrow">Sign in</p>
              <h2 id="login-heading">Login to CampusCart</h2>
              <p>Enter your details to continue trading with students near you.</p>
            </div>

            <form className="auth-form" onSubmit={handleLoginSubmit}>
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
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
              </label>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <Link href="/forget_password">Forgot password?</Link>
              </div>

              <button type="submit" className="auth-button">
                Sign in
              </button>
            </form>

            <p className="auth-switch">
              Don&apos;t have an account? <Link href="/register">Register</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
