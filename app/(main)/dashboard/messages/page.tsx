import { MessagesInbox } from "@/components/dashboard/MessagesInbox"
import { ShieldCheck } from "lucide-react"

export default function DashboardMessagesPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight">Secure <span className="text-gradient">Inbox</span></h1>
          <p className="mt-2 text-lg text-muted-foreground font-medium">
            Manage your high-stakes negotiations and trade discussions.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm backdrop-blur-sm">
           <ShieldCheck className="size-5 text-emerald-600" />
           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">End-to-End Encrypted</span>
        </div>
      </div>
      
      <MessagesInbox />
    </div>
  )
}

