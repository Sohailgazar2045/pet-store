import Link from "next/link"
import { ListingForm } from "@/components/listings/ListingForm"
import { PostListingAuthBanner } from "@/components/listings/PostListingAuthBanner"
import { ShieldCheck, Camera, FileText, CheckCircle2 } from "lucide-react"

/**
 * Create listing — page is public; upload/submit require sign-in (API + form checks).
 */
export default function NewListingPage() {
  return (
    <div className="bg-muted/30 py-16 min-h-screen">
      <main className="container max-w-6xl px-4">
        <div className="mb-16 text-center lg:text-left">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <CheckCircle2 className="size-3" />
              Seller Protocol
           </div>
          <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">Post Your <span className="text-gradient">Asset</span></h1>
          <p className="max-w-2xl text-lg text-muted-foreground font-medium">
            Join the most trusted livestock and pet marketplace. Reach thousands of verified buyers and get the best market value for your assets.
          </p>
        </div>
        
        <div className="grid gap-10 lg:grid-cols-12 items-start">
           <div className="lg:col-span-8 space-y-8">
              <PostListingAuthBanner />
              <div className="glass rounded-[3rem] p-10 shadow-2xl border-white/60">
                 <ListingForm />
              </div>
           </div>

           <aside className="lg:col-span-4 space-y-8 sticky top-24">
              <div className="glass p-10 rounded-[3rem] shadow-xl border-white/40 bg-white/80">
                 <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <ShieldCheck className="size-6 text-primary" />
                    Seller Tips
                 </h3>
                 <div className="space-y-10">
                    <div className="flex gap-5">
                       <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <Camera className="size-6" />
                       </div>
                       <div>
                          <h4 className="font-black mb-2 uppercase text-[10px] tracking-widest text-primary">Visual Impact</h4>
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed">High-quality photos from multiple angles increase conversion by up to 40%.</p>
                       </div>
                    </div>
                    <div className="flex gap-5">
                       <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                          <FileText className="size-6" />
                       </div>
                       <div>
                          <h4 className="font-black mb-2 uppercase text-[10px] tracking-widest text-amber-600">Details Matter</h4>
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed">Mention health history, vaccinations, and temperament clearly in the description.</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 pt-8 border-t border-white/20">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Verification Flow</h4>
                    <ul className="space-y-3">
                       <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          Identity Verified
                       </li>
                       <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                          Secure Messaging
                       </li>
                       <li className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                          <div className="h-2 w-2 rounded-full bg-muted"></div>
                          Health Certification
                       </li>
                    </ul>
                 </div>
              </div>

              <div className="glass p-10 rounded-[3rem] shadow-xl border-white/40 bg-primary text-white overflow-hidden relative group">
                 <h4 className="text-xl font-black mb-4 relative z-10">Need Help?</h4>
                 <p className="text-primary-foreground/90 font-medium mb-8 relative z-10 text-sm">Our expert listing consultants are available to help you craft the perfect ad.</p>
                 <Link href="/contact" className="block w-full h-14 bg-white text-primary rounded-full font-black hover:scale-105 transition-all shadow-2xl relative z-10 flex items-center justify-center">
                    Talk to an Expert
                 </Link>
                 <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-1000"></div>
              </div>
           </aside>
        </div>
        
        <div className="mt-20 text-center py-12 border-t border-white/20">
          <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em]">
            Safety Protocol: All new listings are <span className="text-primary">reviewed manually</span> for quality assurance.
          </p>
        </div>
      </main>
    </div>
  )
}

