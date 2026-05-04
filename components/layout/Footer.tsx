import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Pasture<span className="text-primary">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The premier marketplace for premium pets and livestock. Connecting animal lovers and verified sellers since 2024.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/listings" className="hover:text-primary transition-colors">All Listings</Link></li>
              <li><Link href="/listings?category=pets" className="hover:text-primary transition-colors">Pets</Link></li>
              <li><Link href="/listings?category=cattle" className="hover:text-primary transition-colors">Livestock</Link></li>
              <li><Link href="/listings/new" className="hover:text-primary transition-colors">Post an Ad</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/safety" className="hover:text-primary transition-colors">Safety Tips</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold">Newsletter</h4>
            <p className="mb-4 text-sm text-muted-foreground">Get the latest pet listings and news delivered to your inbox.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 rounded-full border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PasturePro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
