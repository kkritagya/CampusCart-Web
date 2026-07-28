import { requireAdmin } from "@/lib/actions/authentication_action";
import { AdminAuthForm } from "./admin-auth-form";
import styles from "../admin.module.css";

export default async function AdminAuthenticatePage() {
  const user = await requireAdmin();

  return (
    <main className={styles.authShell}>
      <AdminAuthForm
        name={user.fullName ?? user.name ?? user.email}
        email={user.email}
      />
    </main>
  );
}
