import { ListingForm } from "@/components/listings/ListingForm"
import { PostListingAuthBanner } from "@/components/listings/PostListingAuthBanner"

/**
 * Create listing — page is public; upload/submit require sign-in (API + form checks).
 */
export default function NewListingPage() {
  return (
    <div className="bg-muted/30 py-12 min-h-full">
      <main className="container max-w-3xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">Post Your Listing</h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Connect with thousands of buyers. Add clear photos and details to get the best offers.
          </p>
        </div>
        
        <div className="glass rounded-3xl p-8 shadow-xl">
          <PostListingAuthBanner />
          <div className="mt-8">
            <ListingForm />
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            New ads are <strong>pending</strong> until an admin approves them for safety.
          </p>
        </div>
      </main>
    </div>
  )
}
