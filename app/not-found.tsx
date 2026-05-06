import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="glass max-w-2xl w-full p-16 rounded-[4rem] text-center border-white/60 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="text-[12rem] font-black leading-none text-primary/10 select-none mb-4">404</div>
          <h1 className="text-5xl font-black mb-6 tracking-tight">Lost in the <br /><span className="text-gradient">Pasture?</span></h1>
          <p className="text-muted-foreground font-medium text-xl mb-12 leading-relaxed max-w-md mx-auto">
            The page you are looking for has migrated or doesn't exist. Let's get you back to the main marketplace.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/listings">
              <Button className="h-16 px-10 rounded-full bg-primary font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20">
                <Search className="mr-3 size-5" />
                Browse Listings
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="h-16 px-10 rounded-full border-2 border-primary text-primary font-black uppercase tracking-widest text-xs">
                <Home className="mr-3 size-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 left-0 h-full w-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      </div>
    </div>
  )
}
