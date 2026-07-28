"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthActionState } from "@/lib/actions/authentication_action";
import "./login.css";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

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

            <form className="auth-form" action={formAction}>
              <label className="field" htmlFor="email">
                <span>Email</span>
                <input
                  suppressHydrationWarning
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@gmail.com"
                  required
                />
                {state.fieldErrors?.email ? (
                  <span className="field-error">{state.fieldErrors.email[0]}</span>
                ) : null}
              </label>

              <label className="field" htmlFor="password">
                <span>Password</span>
                <input
                  suppressHydrationWarning
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                />
                {state.fieldErrors?.password ? (
                  <span className="field-error">{state.fieldErrors.password[0]}</span>
                ) : null}
              </label>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <Link href="/forget_password">Forgot password?</Link>
              </div>

              {state.message ? (
                <p className="form-message form-message-error" role="alert">
                  {state.message}
                </p>
              ) : null}

              <button
                suppressHydrationWarning
                type="submit"
                className="auth-button"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign in"}
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
