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
import { 
  ShieldCheck, 
  Ban, 
  Users, 
  ShoppingBag, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  MoreVertical,
  Activity,
  ArrowUpRight,
  Filter,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

type AdminListing = {
  _id: string
  title: string
  price: number
  status: string
  coverUrl: string
  category: string
  seller: { name: string }
  createdAt: string
}

type AdminListingsPayload = {
  listings: AdminListing[]
  total: number
  page: number
  pages: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

type AdminUser = {
  _id: string
  name: string
  email: string
  role: "user" | "admin"
  isVerified: boolean
  isBanned: boolean
  createdAt: string
}

type AdminUsersPayload = {
  users: AdminUser[]
}

type AdminStatsPayload = {
  usersTotal: number
  usersVerified: number
  usersBanned: number
  listingsTotal: number
  listingsPending: number
  reportsPending: number
  messages24h: number
  verificationRate: number
}

export function AdminDashboard() {
  const { accessToken } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("pending")

  const { data: listings, isLoading } = useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      const res = await apiGet<AdminListingsPayload>("/api/admin/listings", { token: accessToken })
      if (!res.success) throw new Error(res.error)
      return res.data.listings
    },
    enabled: Boolean(accessToken)
  })

  const { data: userMatrix = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await apiGet<AdminUsersPayload>("/api/admin/users", { token: accessToken })
      if (!res.success) throw new Error(res.error)
      return res.data.users
    },
    enabled: Boolean(accessToken),
  })

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await apiGet<AdminStatsPayload>("/api/admin/stats", { token: accessToken })
      if (!res.success) throw new Error(res.error)
      return res.data
    },
    enabled: Boolean(accessToken),
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
    <div className="space-y-12 animate-in fade-in duration-700">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-[2.5rem] border-white/40" />
          <Skeleton className="h-40 rounded-[2.5rem] border-white/40" />
          <Skeleton className="h-40 rounded-[2.5rem] border-white/40" />
       </div>
       <div className="space-y-6">
          <Skeleton className="h-16 w-full max-w-md rounded-full" />
          <Skeleton className="h-[600px] w-full rounded-[3rem] border-white/40" />
       </div>
    </div>
  )

  const pending = listings?.filter(l => l.status === "pending") || []
  const active = listings?.filter(l => l.status === "active") || []
  const archived = listings?.filter(l => ["rejected", "sold", "expired"].includes(l.status)) || []

  const statCards = [
    { label: "Inventory Volume", value: formatListingPrice(listings?.reduce((acc, l) => acc + l.price, 0) || 0), icon: ShoppingBag, color: "text-primary", bg: "bg-primary/10", trend: `${stats?.listingsTotal ?? 0} total listings` },
    { label: "Verification Rate", value: `${stats?.verificationRate ?? 0}%`, icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: `${stats?.usersVerified ?? 0} verified users` },
    { label: "User Accounts", value: `${stats?.usersTotal ?? 0}`, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", trend: `${stats?.usersBanned ?? 0} banned` }
  ]

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
         <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
               <Activity className="size-3" />
               Global Operations
            </div>
            <h1 className="text-6xl font-black tracking-tighter">Command <span className="text-gradient">Center</span></h1>
            <p className="mt-4 text-xl text-muted-foreground font-medium max-w-2xl">
              Centralized authority for marketplace moderation, user matrix management, and global trade oversight.
            </p>
         </div>
         <div className="flex items-center gap-4">
            <Button variant="outline" className="h-14 px-8 rounded-full border-2 border-white/60 bg-white/50 backdrop-blur-md font-black uppercase tracking-widest text-xs hover:bg-white shadow-xl">
               <Download className="mr-2 size-4" />
               Audit Report
            </Button>
            <div className="h-14 px-8 rounded-full bg-primary text-white flex items-center gap-3 shadow-2xl shadow-primary/30">
               <ShieldCheck className="size-5" />
               <span className="text-xs font-black uppercase tracking-widest">Level 5 Clearance</span>
            </div>
         </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
         {statCards.map((stat) => (
           <div key={stat.label} className="glass-card p-10 group">
             <div className="flex justify-between items-start mb-8">
               <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6", stat.bg, stat.color)}>
                 <stat.icon className="size-7" />
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg">
                 <ArrowUpRight className="size-3" />
                 {stat.trend}
               </div>
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{stat.label}</p>
                <h3 className="text-4xl font-black tracking-tight">{stat.value}</h3>
             </div>
           </div>
         ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-10" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <TabsList className="bg-muted/50 p-1.5 rounded-full h-16 border border-white/20 backdrop-blur-sm self-start">
             <TabsTrigger value="pending" className="rounded-full px-10 font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
               Queue <Badge className="ml-3 bg-white/20 text-[10px] font-black border-none">{pending.length}</Badge>
             </TabsTrigger>
             <TabsTrigger value="active" className="rounded-full px-10 font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
               Live <Badge className="ml-3 bg-white/20 text-[10px] font-black border-none">{active.length}</Badge>
             </TabsTrigger>
             <TabsTrigger value="matrix" className="rounded-full px-10 font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
               Matrix
             </TabsTrigger>
             <TabsTrigger value="logs" className="rounded-full px-10 font-black text-xs uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-xl transition-all">
               Logs
             </TabsTrigger>
           </TabsList>
           
           <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/50 border border-white/40"><Filter className="size-5" /></Button>
              <div className="relative">
                 <ShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                 <input type="text" placeholder="Filter by ID..." className="h-12 w-64 pl-11 pr-4 rounded-full bg-white/50 border border-white/40 focus:ring-4 focus:ring-primary/5 outline-none text-xs font-black uppercase tracking-widest placeholder:text-muted-foreground/40 transition-all" />
              </div>
           </div>
        </div>

        <TabsContent value="pending" className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
           {pending.length === 0 ? (
             <div className="glass p-32 text-center rounded-[4rem] border-dashed border-white/60 shadow-2xl">
                <div className="h-24 w-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-white">
                   <CheckCircle2 className="size-12 text-primary/30" />
                </div>
                <h3 className="text-3xl font-black mb-4">Authority Queue Clear</h3>
                <p className="text-muted-foreground/60 font-medium text-lg max-w-sm mx-auto">
                   All global submissions have been reviewed and successfully indexed in the marketplace.
                </p>
             </div>
           ) : (
             <div className="grid gap-8">
                {pending.map(l => (
                   <div key={l._id} className="glass p-10 rounded-[3.5rem] flex flex-col lg:flex-row items-center gap-10 border-white/60 shadow-2xl group relative overflow-hidden transition-all hover:bg-white/80">
                      <div className="h-48 w-48 rounded-[2.5rem] overflow-hidden relative border-8 border-white flex-shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                         <Image src={l.coverUrl} alt={l.title} fill className="object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                         <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                            <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] text-[9px] px-4 py-1.5">{l.category}</Badge>
                            <span className="text-[10px] font-black text-muted-foreground/40 tracking-tighter uppercase">INDEX_REF: {l._id.slice(-8).toUpperCase()}</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{new Date(l.createdAt).toLocaleDateString()}</span>
                         </div>
                         <h3 className="text-4xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors leading-tight">{l.title}</h3>
                         <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8">
                            <div>
                               <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Valuation</p>
                               <p className="text-3xl font-black text-primary">{formatListingPrice(l.price)}</p>
                            </div>
                            <div className="h-12 w-px bg-muted/50 hidden sm:block" />
                            <div>
                               <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Entity Authority</p>
                               <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                                     {l.seller.name[0]}
                                  </div>
                                  <p className="text-sm font-black uppercase tracking-widest">{l.seller.name}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                         <Button 
                            className="rounded-full h-16 px-10 font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-emerald-600 shadow-2xl shadow-primary/30 text-white min-w-[180px]"
                            onClick={() => updateStatus.mutate({ id: l._id, status: "active" })}
                         >
                            <CheckCircle2 className="mr-3 size-5" />
                            Authorize
                         </Button>
                         <Button 
                            variant="outline" 
                            className="rounded-full h-16 px-10 font-black uppercase tracking-widest text-[10px] border-2 border-rose-500 text-rose-600 hover:bg-rose-50 min-w-[180px]"
                            onClick={() => updateStatus.mutate({ id: l._id, status: "rejected" })}
                         >
                            <XCircle className="mr-3 size-5" />
                            Deny
                         </Button>
                         <div className="h-px w-full sm:h-12 sm:w-px bg-muted mx-2"></div>
                         <Button 
                            variant="ghost" 
                            className="rounded-full h-16 w-16 p-0 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-all"
                            onClick={() => deleteListing.mutate(l._id)}
                         >
                            <Trash2 className="size-6" />
                         </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 h-1.5 w-full bg-primary/20">
                         <div className="h-full bg-primary animate-[shimmer_2s_infinite]" style={{ width: '100%' }} />
                      </div>
                   </div>
                ))}
             </div>
           )}
        </TabsContent>

        <TabsContent value="active" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="grid gap-4">
              {active.map(l => (
                 <div key={l._id} className="glass p-6 rounded-[3rem] flex items-center gap-8 border-white/40 shadow-xl group hover:bg-white/80 transition-all">
                    <div className="h-24 w-24 rounded-[1.5rem] overflow-hidden relative border-4 border-white flex-shrink-0 shadow-xl">
                       <Image src={l.coverUrl} alt={l.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                       <h3 className="text-xl font-black mb-2 group-hover:text-primary transition-colors tracking-tight">{l.title}</h3>
                       <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          <span className="text-primary">{l.category}</span>
                          <span className="h-1 w-1 rounded-full bg-muted"></span>
                          <span>{l.seller.name}</span>
                          <span className="h-1 w-1 rounded-full bg-muted"></span>
                          <span className="text-emerald-500 flex items-center gap-1.5">
                             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                             Live Network
                          </span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Market Value</p>
                          <p className="font-black text-lg">{formatListingPrice(l.price)}</p>
                       </div>
                       <div className="h-12 w-px bg-muted mx-2"></div>
                       <Button 
                          variant="secondary" 
                          className="rounded-full h-12 px-8 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                          onClick={() => updateStatus.mutate({ id: l._id, status: "sold" })}
                       >
                          Mark Sold
                       </Button>
                       <Button 
                          variant="ghost" 
                          className="rounded-full h-12 w-12 p-0 text-muted-foreground hover:text-rose-500 transition-all"
                          onClick={() => deleteListing.mutate(l._id)}
                       >
                          <Trash2 className="size-5" />
                       </Button>
                    </div>
                 </div>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="matrix" className="animate-in zoom-in-95 duration-500">
           <div className="glass p-12 rounded-[4rem] border-white/60 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                 <div>
                    <h3 className="text-3xl font-black tracking-tight">User Matrix</h3>
                    <p className="text-muted-foreground font-medium mt-1">Cross-reference verified traders and identity statuses.</p>
                 </div>
                 <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-8 rounded-full font-black text-[10px] uppercase tracking-widest border-2">Export CSV</Button>
                    <Button className="h-12 px-8 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">Manual Audit</Button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-white/20">
                          <th className="pb-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Entity Profile</th>
                          <th className="pb-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocol Status</th>
                          <th className="pb-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reputation</th>
                          <th className="pb-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Node Activity</th>
                          <th className="pb-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {userMatrix.map((user) => (
                          <tr key={user._id} className="group hover:bg-white/30 transition-all">
                             <td className="py-8">
                                <div className="flex items-center gap-4">
                                   <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary border border-white/60 shadow-sm group-hover:scale-110 transition-transform">
                                      {user.name[0]}
                                   </div>
                                   <div>
                                      <p className="font-black text-base">{user.name}</p>
                                      <p className="text-xs font-medium text-muted-foreground">{user.email}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="py-8">
                                <Badge className={cn("px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-none", 
                                   user.role === "admin"
                                     ? "bg-primary/10 text-primary"
                                     : user.isBanned
                                       ? "bg-rose-500/10 text-rose-600"
                                       : user.isVerified
                                         ? "bg-emerald-500/10 text-emerald-600"
                                         : "bg-amber-500/10 text-amber-600"
                                )}>
                                   {user.role === "admin"
                                     ? "System"
                                     : user.isBanned
                                       ? "Banned"
                                       : user.isVerified
                                         ? "Verified"
                                         : "Pending"}
                                </Badge>
                             </td>
                             <td className="py-8">
                                <div className="flex items-center gap-3">
                                   <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className={cn(
                                          "h-full transition-all duration-1000",
                                          user.role === "admin" || user.isVerified ? "bg-emerald-500" : "bg-primary"
                                        )}
                                        style={{ width: `${user.role === "admin" ? 100 : user.isVerified ? 90 : 45}%` }}
                                      ></div>
                                   </div>
                                   <span className="text-[10px] font-black">
                                     {user.role === "admin" ? "100%" : user.isVerified ? "90%" : "45%"}
                                   </span>
                                </div>
                             </td>
                             <td className="py-8">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                   <span className={cn("h-2 w-2 rounded-full", user.isBanned ? "bg-rose-500" : "bg-emerald-500 animate-pulse")}></span>
                                   {user.isBanned ? "Restricted" : "Active"}
                                </p>
                             </td>
                             <td className="py-8 text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="logs" className="animate-in zoom-in-95 duration-500">
          <div className="glass p-12 rounded-[4rem] border-white/60 shadow-2xl">
            <h3 className="text-3xl font-black tracking-tight mb-8">Activity Logs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-3xl bg-white/60 border border-white/40 p-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Reviews</p>
                <p className="text-4xl font-black mt-2">{stats?.listingsPending ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-white/60 border border-white/40 p-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pending Reports</p>
                <p className="text-4xl font-black mt-2">{stats?.reportsPending ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-white/60 border border-white/40 p-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Messages (24h)</p>
                <p className="text-4xl font-black mt-2">{stats?.messages24h ?? 0}</p>
              </div>
              <div className="rounded-3xl bg-white/60 border border-white/40 p-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Banned Users</p>
                <p className="text-4xl font-black mt-2">{stats?.usersBanned ?? 0}</p>
              </div>
            </div>
            <p className="mt-6 text-xs font-bold text-muted-foreground">
              Logs are currently aggregated. Detailed per-event audit history can be added next.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

