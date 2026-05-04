import { ListingForm } from "@/components/listings/ListingForm"
import { PostListingAuthBanner } from "@/components/listings/PostListingAuthBanner"

/**
 * Create listing — page is public; upload/submit require sign-in (API + form checks).
 */
export default function NewListingPage() {
  return (
    <main className="container max-w-2xl flex-1 px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Post a listing</h1>
        <p className="mt-2 text-muted-foreground">
          Add photos, set your price, and submit. New ads are <strong>pending</strong> until
          an admin approves them. You can still open your ad from the link after submit.
        </p>
      </div>
      <PostListingAuthBanner />
      <ListingForm />
    </main>
  )
}
