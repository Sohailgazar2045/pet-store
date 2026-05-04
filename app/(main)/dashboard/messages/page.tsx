import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function DashboardMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="mt-1 text-muted-foreground">
          Chat with buyers and sellers after you connect on a listing.
        </p>
      </div>
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>
            Inbox and real-time chat will plug in here once the messaging API and Socket.io layer are
            wired up. You’ll get buyer–seller threads tied to each listing.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
