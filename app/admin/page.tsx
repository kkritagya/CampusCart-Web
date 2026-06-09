import { logoutAction, requireAdmin } from "@/lib/actions/authentication_action";

export default async function AdminPage() {
  const user = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#f5f9ff] px-6 py-10 text-[#071a3d]">
      <h1>Admin Dashboard</h1>
      <p>Authenticated as {user.fullName ?? user.name ?? user.email}.</p>

      <section className="mt-6 grid gap-2 rounded-lg border border-[#d8dee8] bg-white p-5">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.role ? (
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        ) : null}
      </section>

      <form action={logoutAction} className="mt-6">
        <button
          type="submit"
          className="rounded-lg bg-[#092452] px-5 py-3 font-bold text-white"
        >
          Logout
        </button>
      </form>
    </main>
  );
}
