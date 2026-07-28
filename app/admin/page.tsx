import { requireAdmin } from "@/lib/actions/authentication_action";
import { logoutAction } from "@/lib/actions/authentication_action";
import { AdminUsers } from "./admin-users";
import styles from "./admin.module.css";

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <>
      <header className={styles.adminHeader}>
        <a className={styles.adminBrand} href="/admin">
          <span>CampusCart</span>
          <small>Admin</small>
        </a>
        <nav className={styles.adminNav} aria-label="Admin sections">
          <a href="/admin">Users</a>
          <a href="/admin/listings">Listing review</a>
        </nav>
        <div className={styles.adminAccount}>
          <span>{user.fullName ?? user.name ?? user.email}</span>
          <form action={logoutAction}>
            <button type="submit">Sign out</button>
          </form>
        </div>
      </header>
      <main><AdminUsers adminId={user.id} /></main>
    </>
  );
}
