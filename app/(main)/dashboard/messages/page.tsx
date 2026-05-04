import { MessagesInbox } from "@/components/dashboard/MessagesInbox"

export default function DashboardMessagesPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight">Messages</h1>
        <p className="mt-2 text-lg text-muted-foreground font-medium">
          Manage your conversations with buyers and sellers.
        </p>
      </div>
      
      <MessagesInbox />
    </div>
  )
}
