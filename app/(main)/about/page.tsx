import type { Metadata } from "next"
import { ShieldCheck, Users, TrendingUp, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | PasturePro",
  description: "Learn about PasturePro — the world's most trusted marketplace for livestock and pets.",
}

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <section className="section-padding relative overflow-hidden">
        <div className="container max-w-5xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              Our Story
            </div>
            <h1 className="mb-6">The Gold Standard of <span className="text-gradient">Livestock Trading</span></h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              PasturePro was founded with one mission: to make livestock and pet trading safe, transparent, and accessible for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {[
              { icon: ShieldCheck, title: "Trust First", desc: "Every seller is identity-verified and every listing is manually reviewed before going live on the platform.", color: "text-primary bg-primary/10" },
              { icon: Users, title: "Community Driven", desc: "We support over 50,000 active traders globally, from family farms to commercial ranches and pet breeders.", color: "text-blue-500 bg-blue-500/10" },
              { icon: TrendingUp, title: "Market Intelligence", desc: "Real-time pricing data, demand forecasts, and trend reports to help you make smarter decisions.", color: "text-emerald-500 bg-emerald-500/10" },
              { icon: Globe, title: "Nationwide Reach", desc: "Our platform connects buyers and sellers across cities and regions, with advanced location-based search.", color: "text-amber-500 bg-amber-500/10" },
            ].map((item) => (
              <div key={item.title} className="glass p-10 rounded-[2.5rem] border-white/40 shadow-xl">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${item.color}`}>
                  <item.icon className="size-7" />
                </div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass p-16 rounded-[3rem] border-white/40 shadow-2xl text-center">
            <h2 className="mb-4">Our Numbers</h2>
            <div className="grid grid-cols-3 gap-8 mt-10">
              {[
                { label: "Active Listings", value: "12,000+" },
                { label: "Verified Sellers", value: "4,500+" },
                { label: "Successful Trades", value: "8,000+" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-4xl font-black text-primary">{s.value}</div>
                  <div className="text-xs font-black text-muted-foreground uppercase tracking-widest mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      </section>
    </div>
  )
}
