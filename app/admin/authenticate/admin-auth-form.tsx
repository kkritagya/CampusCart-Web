"use client";

import { useActionState } from "react";
import { authenticateAdmin, type AdminAuthState } from "./actions";
import styles from "../admin.module.css";

const initialState: AdminAuthState = { error: "" };

export function AdminAuthForm({ name, email }: { name: string; email: string }) {
  const [state, action, pending] = useActionState(authenticateAdmin, initialState);

  return (
    <form action={action} className={styles.authCard}>
      <input type="hidden" name="email" value={email} />
      <span className={styles.authMark} aria-hidden="true">◆</span>
      <p className={styles.eyebrow}>Protected area</p>
      <h1>Confirm it’s you</h1>
      <p>
        Welcome back, {name}. Enter your password again to open the admin
        workspace.
      </p>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
        />
      </label>
      {state.error ? <div className={styles.authError} role="alert">{state.error}</div> : null}
      <button className={styles.primaryButton} disabled={pending}>
        {pending ? "Verifying…" : "Continue to admin"}
      </button>
      <a href="/dashboard">Return to dashboard</a>
      <small>Admin verification expires after 15 minutes.</small>
    </form>
  );
}
