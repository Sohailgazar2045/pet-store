"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Heart,
  MessageSquare
} from "lucide-react"

export function UserNav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all">
          <span className="font-black text-primary">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-[2rem] p-4 glass shadow-2xl" align="end" forceMount>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 py-2">
              <p className="text-sm font-black leading-none">{user?.name}</p>
              <p className="text-xs font-medium leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuGroup className="py-2">
          <DropdownMenuItem 
            className="rounded-xl font-bold py-3 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="rounded-xl font-bold py-3 cursor-pointer"
            onClick={() => router.push("/dashboard/messages")}
          >
            <MessageSquare className="mr-3 h-4 w-4 text-primary" />
            <span>Messages</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="rounded-xl font-bold py-3 cursor-pointer"
            onClick={() => router.push("/dashboard/favorites")}
          >
            <Heart className="mr-3 h-4 w-4 text-primary" />
            <span>Favorites</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="rounded-xl font-bold py-3 cursor-pointer"
            onClick={() => router.push("/dashboard/profile")}
          >
            <Settings className="mr-3 h-4 w-4 text-primary" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {user?.role === "admin" && (
          <>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem 
              className="rounded-xl font-bold py-3 cursor-pointer text-primary"
              onClick={() => router.push("/admin")}
            >
              <ShieldCheck className="mr-3 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem 
          className="rounded-xl font-bold py-3 cursor-pointer text-rose-500 hover:text-rose-600 hover:bg-rose-50/50"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
