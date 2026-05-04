import { AdminDashboard } from "@/components/admin/AdminDashboard"

export default function AdminHomePage() {
  return (
    <div className="bg-muted/30 min-h-screen py-16">
      <div className="container max-w-7xl">
        <AdminDashboard />
      </div>
    </div>
  )
}
