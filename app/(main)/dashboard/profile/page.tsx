"use client"

import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { BadgeCheck } from "lucide-react"

export default function DashboardProfilePage() {
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
           <Skeleton className="h-12 w-64 rounded-xl" />
           <Skeleton className="h-6 w-96 rounded-lg" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-[3rem]" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight">Identity <span className="text-gradient">Settings</span></h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            Manage your professional presence across the PasturePro ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/50 border border-white/40 shadow-sm backdrop-blur-sm">
           <BadgeCheck className="size-6 text-primary" />
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Security Level</span>
              <span className="text-xs font-black text-primary uppercase">Verified Global Seller</span>
           </div>
        </div>
      </div>

      <div className="glass p-10 lg:p-16 rounded-[3rem] border-white/60 shadow-2xl bg-white/40">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}

