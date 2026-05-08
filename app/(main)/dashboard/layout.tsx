import { AuthGuard } from "@/components/auth/AuthGuard"
import { DashboardNav } from "@/components/dashboard/DashboardNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="bg-muted/10 min-h-screen">
        <div className="container max-w-7xl px-4 py-16 lg:py-24">
          <div className="flex flex-col gap-12 md:flex-row md:items-start">
            <DashboardNav />
            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

