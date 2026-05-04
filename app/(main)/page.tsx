import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * PasturePro marketing homepage (hero placeholder until full homepage is built).
 */
export default function HomePage() {
  return (
    <main className="container flex flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Cattle & pets marketplace
      </p>
      <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Buy and sell livestock & pets near you
      </h1>
      <p className="max-w-lg text-muted-foreground">
        Browse verified listings, chat with sellers, and close deals locally.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/listings"
          className={cn(buttonVariants({ size: "lg" }))}
        >
          Browse listings
        </Link>
        <Link
          href="/listings/new"
          className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
        >
          Post an ad
        </Link>
      </div>
    </main>
  )
}
