"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/hooks/useAuth"
import { apiGet, apiPut, apiDelete } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatListingPrice } from "@/lib/utils"
import Image from "next/image"
import { ShieldCheck, TrendingUp, Users, ShoppingBag, Trash2, CheckCircle2, XCircle, MoreVertical } from "lucide-react"

type AdminListing = {
  _id: string
  title: string
  price: number
  status: string
  coverUrl: string
  category: string
  seller: { name: string }
}

export function AdminDashboard() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()

  const { data: listings, isLoading } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      const res = await apiGet<AdminListing[]>("/api/admin/listings", { token: accessToken })
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    enabled: Boolean(accessToken)
  })

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return apiPut(`/api/admin/listings/${id}`, { status }, { token: accessToken })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] })
    }
  })

  const deleteListing = useMutation({
    mutationFn: async (id: string) => {
      return apiDelete(`/api/admin/listings/${id}`, { token: accessToken })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] })
    }
  })

  if (isLoading) return (
    <div className="space-y-8">
       <div className="flex gap-4">
          <Skeleton className="h-32 flex-1 rounded-[2rem]" />
          <Skeleton className="h-32 flex-1 rounded-[2rem]" />
          <Skeleton className="h-32 flex-1 rounded-[2rem]" />
       </div>
       <Skeleton className="h-[500px] w-full rounded-[3rem]" />
    </div>
  )

  const pending = listings?.filter(l => l.status === "pending") || []
  const active = listings?.filter(l => l.status === "active") || []
  const rejected = listings?.filter(l => l.status === "rejected") || []

  const stats = [
    { label: "Total Listings", value: listings?.length || 0, icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10" },
    { label: "Active Users", value: "1,240", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Market Growth", value: "+12.4%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" }
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
         <div>
            <h1 className="text-5xl font-black tracking-tight">Admin <span className="text-gradient">Console</span></h1>
            <p className="mt-2 text-lg text-muted-foreground font-medium">Global marketplace management & oversight.</p>
         </div>
         <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 border border-white/40 shadow-sm backdrop-blur-sm">
            <ShieldCheck className="size-5 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Admin Authority Level 4</span>
         </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
         {stats.map((stat) => (
           <div key={stat.label} className="glass p-8 rounded-[2.5rem] border-white/40 shadow-xl group hover:-translate-y-1 transition-all">
             <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm", stat.bg, stat.color)}>
               <stat.icon className="size-6" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black">{stat.value}</h3>
             </div>
           </div>
         ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-10">
        <TabsList className="bg-muted p-1.5 rounded-[2rem] h-16 border border-white/20">
          <TabsTrigger value="pending" className="rounded-full px-10 font-black text-sm data-[state=active]:shadow-lg">
            Review Queue <Badge className="ml-2 bg-amber-500">{pending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-full px-10 font-black text-sm data-[state=active]:shadow-lg">
            Live Market <Badge className="ml-2 bg-emerald-500">{active.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-full px-10 font-black text-sm data-[state=active]:shadow-lg">
            User Matrix
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
           {pending.length === 0 ? (
             <div className="glass p-20 text-center rounded-[3rem] border-dashed border-white/40 shadow-inner">
                <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="size-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-black mb-2 text-muted-foreground">Review Queue Empty</h3>
                <p className="text-muted-foreground/60 font-medium max-w-xs mx-auto">All recent submissions have been processed and indexed.</p>
             </div>
           ) : (
             <div className="grid gap-6">
                {pending.map(l => (
                   <div key={l._id} className="glass p-8 rounded-[3rem] flex items-center gap-8 border-white/40 shadow-2xl group relative overflow-hidden">
                      <div className="h-32 w-32 rounded-[2rem] overflow-hidden relative border-4 border-white flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                         <Image src={l.coverUrl} alt={l.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-3">
                            <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[9px] px-3 py-1">{l.category}</Badge>
                            <span className="text-[10px] font-black text-muted-foreground tracking-tighter uppercase">Submission ID: {l._id.toUpperCase()}</span>
                         </div>
                         <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:text-primary transition-colors">{l.title}</h3>
                         <div className="flex items-center gap-4">
                            <p className="text-xl font-black text-primary">{formatListingPrice(l.price)}</p>
                            <span className="h-4 w-px bg-muted"></span>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                               By <span className="text-foreground">{l.seller.name}</span>
                            </p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <Button 
                            className="rounded-full h-14 px-10 font-black bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white"
                            onClick={() => updateStatus.mutate({ id: l._id, status: "active" })}
                         >
                            <CheckCircle2 className="mr-2 size-5" />
                            Approve
                         </Button>
                         <Button 
                            variant="outline" 
                            className="rounded-full h-14 px-10 font-black border-2 border-rose-500 text-rose-600 hover:bg-rose-50"
                            onClick={() => updateStatus.mutate({ id: l._id, status: "rejected" })}
                         >
                            <XCircle className="mr-2 size-5" />
                            Reject
                         </Button>
                         <div className="h-14 w-px bg-muted mx-2"></div>
                         <Button 
                            variant="ghost" 
                            className="rounded-full h-14 w-14 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-all"
                            onClick={() => deleteListing.mutate(l._id)}
                         >
                            <Trash2 className="size-6" />
                         </Button>
                      </div>
                      <div className="absolute top-0 right-0 h-2 w-full bg-amber-500/20"></div>
                   </div>
                ))}
             </div>
           )}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
           <div className="grid gap-4">
              {active.map(l => (
                 <div key={l._id} className="glass p-6 rounded-[2.5rem] flex items-center gap-8 border-white/40 shadow-xl group opacity-80 hover:opacity-100 transition-all hover:shadow-2xl">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden relative border-2 border-white flex-shrink-0 shadow-md">
                       <Image src={l.coverUrl} alt={l.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                       <h3 className="text-lg font-black mb-1 group-hover:text-primary transition-colors">{l.title}</h3>
                       <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <span>{l.seller.name}</span>
                          <span className="h-1 w-1 rounded-full bg-muted"></span>
                          <span>{l.category}</span>
                          <span className="h-1 w-1 rounded-full bg-muted"></span>
                          <span className="text-emerald-500 flex items-center gap-1">
                             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                             Live
                          </span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <Button 
                          variant="secondary" 
                          className="rounded-full h-11 px-8 font-black text-xs hover:bg-primary hover:text-white transition-all shadow-sm"
                          onClick={() => updateStatus.mutate({ id: l._id, status: "sold" })}
                       >
                          Sold
                       </Button>
                       <Button 
                          variant="ghost" 
                          className="rounded-full h-11 w-11 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-all"
                          onClick={() => deleteListing.mutate(l._id)}
                       >
                          <Trash2 className="size-5" />
                       </Button>
                    </div>
                 </div>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="users">
           <div className="glass p-10 rounded-[3rem] border-white/40 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-black">User Management Matrix</h3>
                 <div className="flex gap-2">
                    <Button variant="outline" className="rounded-full font-black text-xs h-10 px-6">Export Data</Button>
                    <Button className="rounded-full font-black text-xs h-10 px-6">Invite User</Button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-white/20">
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User Profile</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reputation</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Activity</th>
                          <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {[
                          { name: "Sohail Gazar", email: "sohail@example.com", role: "Seller", status: "Verified", rep: 98, activity: "Active Now" },
                          { name: "Jane Smith", email: "jane@example.com", role: "Buyer", status: "Verified", rep: 100, activity: "2h ago" },
                          { name: "Mike Ross", email: "mike@example.com", role: "Admin", status: "System", rep: 100, activity: "Online" },
                          { name: "Alex Johnson", email: "alex@example.com", role: "Seller", status: "Pending", rep: 0, activity: "Yesterday" }
                       ].map((user, i) => (
                          <tr key={i} className="group hover:bg-white/5 transition-all">
                             <td className="py-6">
                                <div className="flex items-center gap-3">
                                   <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary border border-white/40">
                                      {user.name[0]}
                                   </div>
                                   <div>
                                      <p className="font-black text-sm">{user.name}</p>
                                      <p className="text-xs font-medium text-muted-foreground">{user.email}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="py-6">
                                <Badge className={cn("px-3 py-0.5 text-[9px] font-black uppercase tracking-widest", 
                                   user.status === "Verified" ? "bg-emerald-500/10 text-emerald-600" : 
                                   user.status === "System" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"
                                )}>
                                   {user.status}
                                </Badge>
                             </td>
                             <td className="py-6">
                                <div className="flex items-center gap-2">
                                   <div className="h-1 w-12 bg-muted rounded-full overflow-hidden">
                                      <div className="h-full bg-primary" style={{ width: `${user.rep}%` }}></div>
                                   </div>
                                   <span className="text-[10px] font-black">{user.rep}%</span>
                                </div>
                             </td>
                             <td className="py-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{user.activity}</p>
                             </td>
                             <td className="py-6 text-right">
                                <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                   <MoreVertical className="size-4" />
                                </Button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

