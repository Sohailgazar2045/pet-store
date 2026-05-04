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

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>

  const pending = listings?.filter(l => l.status === "pending") || []
  const active = listings?.filter(l => l.status === "active") || []

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
         <h1 className="text-4xl font-black tracking-tight">Admin <span className="text-gradient">Console</span></h1>
         <Badge variant="outline" className="px-4 py-1 font-bold">Secure Access</Badge>
      </div>

      <Tabs defaultValue="pending" className="space-y-8">
        <TabsList className="bg-muted p-1 rounded-2xl h-14">
          <TabsTrigger value="pending" className="rounded-xl px-8 font-black">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="active" className="rounded-xl px-8 font-black">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl px-8 font-black">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
           {pending.length === 0 ? (
             <div className="glass p-12 text-center rounded-[2.5rem] border-dashed border-white/40">
                <p className="text-muted-foreground font-bold">No pending listings to review.</p>
             </div>
           ) : (
             <div className="grid gap-6">
                {pending.map(l => (
                   <div key={l._id} className="glass p-6 rounded-[2.5rem] flex items-center gap-6 border-white/40 shadow-lg group">
                      <div className="h-24 w-24 rounded-3xl overflow-hidden relative border-2 border-white flex-shrink-0">
                         <Image src={l.coverUrl} alt={l.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="uppercase text-[10px] font-black">{l.category}</Badge>
                            <span className="text-xs font-bold text-muted-foreground">ID: {l._id.slice(-6)}</span>
                         </div>
                         <h3 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">{l.title}</h3>
                         <p className="text-sm font-bold text-primary">{formatListingPrice(l.price)}</p>
                      </div>
                      <div className="flex gap-3">
                         <Button 
                            variant="outline" 
                            className="rounded-full h-11 px-6 font-black border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                            onClick={() => updateStatus.mutate({ id: l._id, status: "active" })}
                         >
                            Approve
                         </Button>
                         <Button 
                            variant="outline" 
                            className="rounded-full h-11 px-6 font-black border-rose-500 text-rose-600 hover:bg-rose-50"
                            onClick={() => updateStatus.mutate({ id: l._id, status: "rejected" })}
                         >
                            Reject
                         </Button>
                         <Button 
                            variant="ghost" 
                            className="rounded-full h-11 w-11 p-0 text-muted-foreground hover:text-rose-500"
                            onClick={() => deleteListing.mutate(l._id)}
                         >
                            🗑
                         </Button>
                      </div>
                   </div>
                ))}
             </div>
           )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
           <div className="grid gap-6">
              {active.map(l => (
                 <div key={l._id} className="glass p-6 rounded-[2.5rem] flex items-center gap-6 border-white/40 shadow-lg group opacity-80 hover:opacity-100 transition-opacity">
                    <div className="h-20 w-20 rounded-2xl overflow-hidden relative border-2 border-white flex-shrink-0">
                       <Image src={l.coverUrl} alt={l.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                       <h3 className="text-lg font-black mb-1">{l.title}</h3>
                       <p className="text-xs font-bold text-muted-foreground">Seller: {l.seller.name}</p>
                    </div>
                    <div className="flex gap-3">
                       <Button 
                          variant="outline" 
                          className="rounded-full h-10 px-5 font-black text-xs"
                          onClick={() => updateStatus.mutate({ id: l._id, status: "sold" })}
                       >
                          Mark Sold
                       </Button>
                       <Button 
                          variant="ghost" 
                          className="rounded-full h-10 w-10 p-0 text-muted-foreground hover:text-rose-500"
                          onClick={() => deleteListing.mutate(l._id)}
                       >
                          🗑
                       </Button>
                    </div>
                 </div>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="users">
           <div className="glass p-12 text-center rounded-[2.5rem] border-dashed border-white/40">
              <h3 className="text-xl font-black mb-2">User Management</h3>
              <p className="text-muted-foreground font-medium">Coming in the next module upgrade.</p>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
