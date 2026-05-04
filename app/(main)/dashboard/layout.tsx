import { AuthGuard } from "@/components/auth/AuthGuard"
import { DashboardNav } from "@/components/dashboard/DashboardNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="container max-w-6xl flex-1 px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <DashboardNav />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </AuthGuard>
  )
}
