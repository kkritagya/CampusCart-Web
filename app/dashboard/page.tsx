import Image from "next/image";
import Link from "next/link";
import {
  logoutAction,
  requireCurrentUser,
} from "@/lib/actions/authentication_action";
import "./dashboard.css";

const recentListings = [
  { title: "Psychology textbook", meta: "Posted 2 hours ago", price: "Rs. 2,800" },
  { title: "USB-C charger", meta: "Posted yesterday", price: "Rs. 800" },
  { title: "Office chair", meta: "Posted 3 days ago", price: "Rs. 3,500" },
];

const stats = [
  { label: "Active listings", value: "12" },
  { label: "Messages", value: "5" },
  { label: "Saved items", value: "8" },
  { label: "Completed deals", value: "3" },
];

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const displayName = user.fullName ?? user.name ?? user.email.split("@")[0];
  const isAdmin = user.role?.toLowerCase() === "admin";

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <Link href="/dashboard" className="dashboard-brand" aria-label="CampusCart dashboard">
          <Image
            src="/campuscart-logo.png"
            alt="CampusCart"
            width={52}
            height={52}
            priority
          />
          <span>CampusCart</span>
        </Link>

        <div className="dashboard-header-actions">
          <span className="dashboard-user-chip">{user.email}</span>
          <form action={logoutAction}>
            <button type="submit" className="dashboard-logout">
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <p className="eyebrow">Your dashboard</p>
          <h1>Welcome back, {displayName}.</h1>
          <p>
            This is a placeholder dashboard. Browse listings, manage your items, and
            keep track of campus deals from here.
          </p>
        </section>

        <section className="dashboard-stats" aria-label="Dashboard summary">
          {stats.map((stat) => (
            <article key={stat.label} className="dashboard-stat-card">
              <p className="label">{stat.label}</p>
              <p className="value">{stat.value}</p>
            </article>
          ))}
        </section>

        <div className="dashboard-grid">
          <section className="dashboard-panel">
            <h2>Recent activity</h2>
            <ul className="dashboard-list">
              {recentListings.map((listing) => (
                <li key={listing.title}>
                  <div>
                    <p className="item-title">{listing.title}</p>
                    <p className="item-meta">{listing.meta}</p>
                  </div>
                  <span className="item-price">{listing.price}</span>
                </li>
              ))}
            </ul>
          </section>

          <aside className="dashboard-panel">
            <h2>Quick actions</h2>
            <div className="dashboard-actions">
              <span className="dashboard-action dashboard-action-primary">
                Post a listing
              </span>
              <span className="dashboard-action">View messages</span>
              <span className="dashboard-action">Edit profile</span>
              {isAdmin ? (
                <Link href="/admin" className="dashboard-action">
                  Admin panel
                </Link>
              ) : null}
            </div>

            <div className="dashboard-profile">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {user.role ? (
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
              ) : null}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
