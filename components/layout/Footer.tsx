import Link from "next/link"
import { Mail, Send, Camera, Play, ShieldCheck } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-muted/50 pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-12 mb-24">
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-black text-2xl shadow-[0_10px_20px_rgba(var(--primary),0.3)] transition-transform group-hover:rotate-6">
                P
              </div>
              <span className="text-2xl font-black tracking-tighter text-foreground">
                Pasture<span className="text-primary">Pro</span>
              </span>
            </Link>
            <p className="text-lg font-medium text-muted-foreground leading-relaxed max-w-sm">
              The premier digital destination for high-value livestock and elite companion assets. Built on trust, verified by science.
            </p>
            <div className="flex gap-4">
               {[Camera, Send, Play, Mail].map((Icon, i) => (
                 <Link key={i} href="#" className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm border border-white/40">
                   <Icon className="size-5" />
                 </Link>
               ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground mb-10">Marketplace</h4>
            <ul className="space-y-5 text-[13px] font-black text-muted-foreground uppercase tracking-widest">
              <li><Link href="/listings" className="hover:text-primary transition-colors">Global Catalog</Link></li>
              <li><Link href="/listings?category=pets" className="hover:text-primary transition-colors">Elite Pets</Link></li>
              <li><Link href="/listings?category=cattle" className="hover:text-primary transition-colors">Premium Cattle</Link></li>
              <li><Link href="/listings/new" className="hover:text-primary transition-colors">List Asset</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground mb-10">Ecosystem</h4>
            <ul className="space-y-5 text-[13px] font-black text-muted-foreground uppercase tracking-widest">
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Protocol</Link></li>
              <li><Link href="/verification" className="hover:text-primary transition-colors">Verification</Link></li>
              <li><Link href="/reports" className="hover:text-primary transition-colors">Intelligence</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Institutional</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground mb-10">Market Intelligence</h4>
            <p className="mb-8 text-sm font-medium text-muted-foreground leading-relaxed">Join our institutional network for weekly market analysis and exclusive asset opportunities.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Institutional email" 
                className="w-full h-16 rounded-[1.5rem] bg-muted/40 border-none px-8 pr-32 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner"
              />
              <button className="absolute right-2 top-2 h-12 px-8 rounded-[1rem] bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                Join Network
              </button>
            </div>
            <div className="mt-6 flex items-center gap-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
               <ShieldCheck className="size-4" />
               Join 50k+ Active Professional Traders
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-muted/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
             <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
               © {new Date().getFullYear()} PasturePro Global Trading Ltd.
             </p>
             <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                Registered Institutional Marketplace • Islamabad • London • Dubai
             </p>
          </div>
          <div className="flex gap-10 text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
             <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
             <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
             <Link href="/cookies" className="hover:text-primary transition-colors">Licensing</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

