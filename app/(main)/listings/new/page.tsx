import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Create listing — multi-step form and upload will be added with listings API.
 */
export default function NewListingPage() {
  return (
    <div className="container max-w-2xl flex-1 px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Post a listing</h1>
      <p className="mt-2 text-muted-foreground">
        You’ll need to be signed in to publish. The full step-by-step form and
        image upload will ship with the listings CRUD feature.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/login" className={cn(buttonVariants())}>
          Log in to continue
        </Link>
        <Link
          href="/listings"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Back to browse
        </Link>
      </div>
    </div>
  )
}
