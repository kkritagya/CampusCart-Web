"use client";

import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
  type AdminUser,
  type AdminUserInput,
  type UserPage,
} from "@/lib/actions/admin_user_actions";
import { FormEvent, useCallback, useEffect, useState } from "react";
import styles from "./admin.module.css";

const emptyForm: AdminUserInput = {
  fullName: "",
  email: "",
  password: "",
  role: "user",
  status: "active",
};

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function AdminUsers({ adminId }: { adminId?: string }) {
  const [result, setResult] = useState<UserPage | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<AdminUser | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<AdminUserInput>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const response = await getAdminUsers(page, 10, search);
    if (response.success) setResult(response.data);
    else setError(response.message || "Unable to load users.");
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  function openCreate() {
    setForm(emptyForm);
    setFormError("");
    setEditing(null);
  }

  function openEdit(user: AdminUser) {
    setForm({ fullName: user.fullName, email: user.email, password: "", role: user.role, status: user.status });
    setFormError("");
    setEditing(user);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setFormError("");
    if (form.fullName.trim().length < 2) return setFormError("Name must be at least 2 characters.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setFormError("Enter a valid email address.");
    if (!editing && (!form.password || form.password.length < 6)) return setFormError("Password must be at least 6 characters.");
    if (form.password && form.password.length < 6) return setFormError("Password must be at least 6 characters.");
    setSaving(true);
    const response = editing
      ? await updateAdminUser(editing.id, form)
      : await createAdminUser(form);
    setSaving(false);
    if (!response.success) return setFormError(response.message);
    setEditing(undefined);
    setNotice(editing ? "User updated successfully." : "User created successfully.");
    await load();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setSaving(true);
    const response = await deleteAdminUser(deleting.id);
    setSaving(false);
    if (!response.success) {
      setError(response.message);
      setDeleting(null);
      return;
    }
    setNotice("User deleted successfully.");
    setDeleting(null);
    if (result?.data.length === 1 && page > 1) setPage((value) => value - 1);
    else await load();
  }

  const first = result && result.meta.total ? (result.meta.page - 1) * result.meta.limit + 1 : 0;
  const last = result ? Math.min(result.meta.page * result.meta.limit, result.meta.total) : 0;

  return (
    <section className={styles.workspace}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Administration</p>
          <h1>User management</h1>
          <p>Manage account access, roles, and status across CampusCart.</p>
        </div>
        <button className={styles.primaryButton} onClick={openCreate}>+ Add user</button>
      </div>

      {notice ? <div className={styles.notice} role="status">{notice}<button onClick={() => setNotice("")}>×</button></div> : null}

      <div className={styles.stats}>
        <article><span>Total users</span><strong>{result?.meta.total ?? "—"}</strong><small>Registered accounts</small></article>
        <article><span>Visible results</span><strong>{result?.data.length ?? "—"}</strong><small>On this page</small></article>
        <article><span>Access control</span><strong>Admin</strong><small>Protected workspace</small></article>
      </div>

      <div className={styles.panel}>
        <div className={styles.toolbar}>
          <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(query.trim()); }} className={styles.searchForm}>
            <span aria-hidden="true">⌕</span>
            <input aria-label="Search users" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email…" />
            {query ? <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setSearch(""); setPage(1); }}>×</button> : null}
          </form>
          <button className={styles.secondaryButton} onClick={() => void load()}>Refresh</button>
        </div>

        {error ? (
          <div className={styles.state}><strong>We couldn’t load users</strong><p>{error}</p><button onClick={() => void load()}>Try again</button></div>
        ) : loading ? (
          <div className={styles.skeleton} aria-label="Loading users">{[1,2,3,4,5].map((n) => <div key={n} />)}</div>
        ) : !result?.data.length ? (
          <div className={styles.state}><span className={styles.emptyIcon}>◎</span><strong>No users found</strong><p>{search ? `No accounts match “${search}”.` : "Create the first user to get started."}</p>{search ? <button onClick={() => { setQuery(""); setSearch(""); }}>Clear search</button> : null}</div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table>
                <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {result.data.map((user) => (
                    <tr key={user.id}>
                      <td><div className={styles.userCell}><span className={styles.avatar}>{initials(user.fullName)}</span><div><strong>{user.fullName}</strong><small>{user.email}</small><em title={user.id}>ID · {user.id}</em></div></div></td>
                      <td><span className={`${styles.badge} ${user.role === "admin" ? styles.adminBadge : ""}`}>{user.role}</span></td>
                      <td><span className={`${styles.status} ${user.status === "inactive" ? styles.inactive : ""}`}><i />{user.status}</span></td>
                      <td>{user.createdAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(user.createdAt)) : "—"}</td>
                      <td><div className={styles.rowActions}><button onClick={() => openEdit(user)}>Edit</button><button disabled={user.id === adminId} onClick={() => setDeleting(user)}>Delete</button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <footer className={styles.pagination}>
              <span>Showing {first}–{last} of {result.meta.total}</span>
              <div>
                <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>← Previous</button>
                <span>Page {page} of {result.meta.totalPages}</span>
                <button disabled={page >= result.meta.totalPages} onClick={() => setPage((value) => value + 1)}>Next →</button>
              </div>
            </footer>
          </>
        )}
      </div>

      {editing !== undefined ? (
        <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(undefined); }}>
          <form className={styles.modal} onSubmit={save}>
            <header><div><p className={styles.eyebrow}>{editing ? "Edit account" : "New account"}</p><h2>{editing ? "Update user" : "Create user"}</h2></div><button type="button" aria-label="Close" onClick={() => setEditing(undefined)}>×</button></header>
            <label>Full name<input autoFocus value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="e.g. Maya Shrestha" /></label>
            <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="maya@example.com" /></label>
            <label>{editing ? "New password (optional)" : "Temporary password"}<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder={editing ? "Leave blank to keep current password" : "At least 6 characters"} /></label>
            <div className={styles.formRow}>
              <label>Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as AdminUserInput["role"] })}><option value="user">User</option><option value="admin">Admin</option></select></label>
              <label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as AdminUserInput["status"] })}><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
            </div>
            {formError ? <p className={styles.formError}>{formError}</p> : null}
            <footer><button type="button" className={styles.secondaryButton} onClick={() => setEditing(undefined)}>Cancel</button><button disabled={saving} className={styles.primaryButton}>{saving ? "Saving…" : editing ? "Save changes" : "Create user"}</button></footer>
          </form>
        </div>
      ) : null}

      {deleting ? (
        <div className={styles.overlay}>
          <div className={`${styles.modal} ${styles.confirmModal}`} role="alertdialog" aria-modal="true">
            <span className={styles.warningIcon}>!</span><h2>Delete {deleting.fullName}?</h2><p>This permanently removes the account and cannot be undone.</p>
            <footer><button className={styles.secondaryButton} onClick={() => setDeleting(null)}>Keep user</button><button disabled={saving} className={styles.dangerButton} onClick={() => void confirmDelete()}>{saving ? "Deleting…" : "Delete user"}</button></footer>
          </div>
        </div>
      ) : null}
    </section>
  );
}
