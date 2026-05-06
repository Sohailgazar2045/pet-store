import Link from "next/link"
import { Camera, Mail, Play, Send } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-white/20 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
                P
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground">
                Pasture<span className="text-primary">Pro</span>
              </span>
            </Link>
            <p className="text-lg font-medium text-muted-foreground leading-relaxed max-w-sm">
              The gold standard of livestock and pet trading. Empowering verified sellers and discerning buyers worldwide.
            </p>
            <div className="flex gap-4">
               {[Camera, Send, Play, Mail].map((Icon, i) => (
                 <Link key={i} href="#" className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm border border-white/40">
                   <Icon className="size-5" />
                 </Link>
               ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Marketplace</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
              <li><Link href="/listings" className="hover:text-primary transition-colors">Global Inventory</Link></li>
              <li><Link href="/listings?category=pets" className="hover:text-primary transition-colors">Domestic Pets</Link></li>
              <li><Link href="/listings?category=cattle" className="hover:text-primary transition-colors">Commercial Livestock</Link></li>
              <li><Link href="/listings/new" className="hover:text-primary transition-colors">Asset Listing</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link href="/verification" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
              <li><Link href="/reports" className="hover:text-primary transition-colors">Market Intelligence</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Institutional Support</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground mb-8">Market Intelligence</h4>
            <p className="mb-6 text-sm font-medium text-muted-foreground">Subscribe to get live market trends and exclusive premium listings.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Institutional email" 
                className="w-full h-14 rounded-full bg-white border-white/60 px-6 pr-32 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all shadow-sm"
              />
              <button className="absolute right-1.5 top-1.5 h-11 px-6 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                Subscribe
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
               <Mail className="size-3" />
               Join 50k+ active traders
            </div>
          </div>
        </div>
        
        <div className="mt-24 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            © {new Date().getFullYear()} PasturePro Global Ltd. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
             <Link href="/terms" className="hover:text-primary">Terms</Link>
             <Link href="/privacy" className="hover:text-primary">Privacy</Link>
             <Link href="/cookies" className="hover:text-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
