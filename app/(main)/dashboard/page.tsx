import { AuthGuard } from "@/components/auth/AuthGuard"

/**
 * User dashboard shell — stats and sub-pages will be filled in a later step.
 */
export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          You’re signed in. Listing management, messages, and profile will appear
          here as we continue the build.
        </p>
        <ul className="mt-8 list-inside list-disc text-sm text-muted-foreground">
          <li>My listings</li>
          <li>Messages</li>
          <li>Favorites</li>
          <li>Profile</li>
        </ul>
      </div>
    </AuthGuard>
  )
}
