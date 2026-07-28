import { requireAdmin, logoutAction } from "@/lib/actions/authentication_action";
import { getAdminListings } from "@/lib/actions/admin_listing_actions";
import { AdminOverview } from "../admin-overview";
import styles from "../admin.module.css";
import { redirect } from "next/navigation";

export default async function AdminListingsPage() {
  const user = await requireAdmin();
  const listings = await getAdminListings();
  if (!listings.success && listings.status === 401) {
    redirect("/admin/authenticate");
  }

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
      <main>
        <AdminOverview
          initialListings={listings.success ? listings.data : []}
          initialError={listings.success ? "" : listings.message}
        />
      </main>
    </>
  );
}
