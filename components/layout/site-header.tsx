"use client";

import { useAuth } from "@/lib/context";
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/lib/actions/social_actions";
import type { ApiNotification } from "@/lib/api/social_api";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { PageContainer } from "./page-container";
import styles from "./site-header.module.css";

const publicNavigation = [{ label: "Marketplace", href: "/marketplace" }];
const privateNavigation = [
  { label: "Sell", href: "/sell" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Cart", href: "/cart" },
];

function Icon({ name }: { name: "bell" | "message" | "profile" }) {
  if (name === "bell") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>;
  }
  if (name === "message") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H8l-4 3V5Z" /><path d="M8 9h8M8 13h6" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /><circle cx="12" cy="12" r="10" /></svg>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const displayName = user?.fullName ?? user?.name ?? user?.email?.split("@")[0] ?? "Profile";
  const navItems = [...publicNavigation, ...(isAuthenticated ? privateNavigation : [])];
  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    if (!notificationsOpen) return;
    const close = (event: MouseEvent) => {
      if (!notificationRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [notificationsOpen]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    void getNotificationsAction().then((result) => {
      if (!cancelled && result.success) setNotifications(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, pathname]);

  async function toggleNotifications() {
    const nextOpen = !notificationsOpen;
    setNotificationsOpen(nextOpen);
    if (!nextOpen) return;
    setNotificationsLoading(true);
    const result = await getNotificationsAction();
    if (result.success) setNotifications(result.data);
    setNotificationsLoading(false);
  }

  async function openNotification(notification: ApiNotification) {
    setNotificationsOpen(false);
    if (!notification.read) {
      setNotifications((items) =>
        items.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item
        )
      );
      await markNotificationReadAction(notification.id);
    }
  }

  async function markAllRead() {
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    await markAllNotificationsReadAction();
  }

  return (
    <header className={styles.header}>
      <PageContainer>
        <div className={styles.bar}>
          <Link href="/" className={styles.brand} aria-label="CampusCart home">
            <span className={styles.brandLogo} aria-hidden="true">
              <Image src="/campuscart-logo.png" alt="" width={64} height={64} priority />
            </span>
            <span>CampusCart</span>
          </Link>

          <nav className={styles.navigation} aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`${styles.navLink} ${active(item.href) ? styles.active : ""}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <div className={styles.iconActions}>
                <div className={styles.notifications} ref={notificationRef}>
                  <button
                    type="button"
                    className={styles.iconLink}
                    aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"}
                    aria-expanded={notificationsOpen}
                    aria-haspopup="menu"
                    onClick={() => void toggleNotifications()}
                  >
                    <Icon name="bell" />
                    {unreadCount > 0 ? <span className={styles.notificationBadge}>{unreadCount > 9 ? "9+" : unreadCount}</span> : null}
                  </button>
                  {notificationsOpen ? (
                    <div className={styles.notificationMenu} role="menu">
                      <div className={styles.notificationHeading}>
                        <strong>Notifications</strong>
                        {unreadCount > 0 ? (
                          <button type="button" onClick={() => void markAllRead()}>
                            Mark all read
                          </button>
                        ) : null}
                      </div>
                      <div className={styles.notificationList}>
                        {notificationsLoading ? (
                          <p className={styles.notificationEmpty}>Loading notifications…</p>
                        ) : notifications.length ? (
                          notifications.slice(0, 5).map((notification) => (
                            <Link
                              key={notification.id}
                              href={notification.href}
                              role="menuitem"
                              className={notification.read ? "" : styles.notificationUnread}
                              onClick={() => void openNotification(notification)}
                            >
                              <strong>{notification.title}</strong>
                              <span>{notification.body}</span>
                              {!notification.read ? <small>New</small> : null}
                            </Link>
                          ))
                        ) : (
                          <p className={styles.notificationEmpty}>You&apos;re all caught up.</p>
                        )}
                      </div>
                      <Link className={styles.notificationFooter} href="/messages" onClick={() => setNotificationsOpen(false)}>
                        View all messages
                      </Link>
                    </div>
                  ) : null}
                </div>
                <Link href="/messages" className={`${styles.iconLink} ${active("/messages") ? styles.iconActive : ""}`} aria-label="Messages">
                  <Icon name="message" />
                </Link>
                <details className={styles.account}>
                  <summary aria-label="Open profile menu">
                    <Icon name="profile" />
                    <span>{displayName}</span>
                  </summary>
                  <div className={styles.accountMenu}>
                    <Link href="/user/update">Profile settings</Link>
                    <Link href="/saved">Saved items</Link>
                    {user?.role?.toLowerCase() === "admin" ? <Link href="/admin">Admin overview</Link> : null}
                    <button type="button" disabled={isLoading} onClick={() => void logout()}>
                      {isLoading ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                </details>
              </div>
            ) : (
              <div className={styles.guestActions}>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </div>
            )}
            <button type="button" className={styles.menuButton} aria-expanded={isOpen} aria-controls={menuId} aria-label="Toggle navigation" onClick={() => setIsOpen((value) => !value)}>
              <span />
            </button>
          </div>
        </div>

        <nav id={menuId} className={styles.mobilePanel} hidden={!isOpen} aria-label="Mobile navigation">
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>{item.label}</Link>)}
          {isAuthenticated ? <>
            <Link href="/messages">Notifications</Link>
            <Link href="/messages">Messages</Link>
            <Link href="/saved">Saved items</Link>
            <Link href="/user/update">Profile settings</Link>
            <button type="button" onClick={() => void logout()}>Sign out</button>
          </> : <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>}
        </nav>
      </PageContainer>
    </header>
  );
}
