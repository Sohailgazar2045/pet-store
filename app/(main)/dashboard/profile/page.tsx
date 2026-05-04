"use client"

import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardProfilePage() {
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-64 max-w-md rounded-lg" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-muted-foreground">
          Update how buyers see you on listings and in chat.
        </p>
      </div>
      <ProfileForm user={user} />
    </div>
  )
}
