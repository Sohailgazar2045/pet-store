/**
 * Admin home — tables for listings/users/reports are added in the admin build step.
 * Route is protected by middleware (admin role + JWT).
 */
export default function AdminHomePage() {
  return (
    <div className="container max-w-6xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Approve listings, manage users, and review reports from here once those
        modules are wired up.
      </p>
    </div>
  )
}
