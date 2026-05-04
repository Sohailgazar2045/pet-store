import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Hero } from "@/components/sections/Hero"
import { cn } from "@/lib/utils"
import { CheckCircle2, ShieldCheck } from "lucide-react"

/**
 * PasturePro marketing homepage.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Market Overview Section */}
      <section className="bg-background section-padding relative overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="mb-4">Market <span className="text-gradient">Insights</span></h2>
              <p className="text-lg">Real-time data and trends for the livestock and pet marketplace. Stay informed and make better decisions.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="glass px-6 py-3 rounded-full text-sm font-black flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE UPDATES
              </div>
              <button className="h-12 px-8 rounded-full border border-primary text-primary text-sm font-black hover:bg-primary hover:text-white transition-all">
                View Reports
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Cow Market Index", value: "+2.4%", status: "up", trend: "Strong Demand" },
              { label: "Pet Adoption Rate", value: "+15.8%", status: "up", trend: "High Growth" },
              { label: "Avg. Sale Price", value: "$1,240", status: "stable", trend: "Stable" },
              { label: "Active Buyers", value: "4.2k", status: "up", trend: "Rising" }
            ].map((stat) => (
              <div key={stat.label} className="glass p-8 rounded-[2rem] border border-white/20 hover:scale-105 transition-all">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">{stat.label}</p>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-black">{stat.value}</span>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-lg",
                    stat.status === "up" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                  )}>
                    {stat.status === "up" ? "↑" : "→"}
                  </span>
                </div>
                <p className="text-sm font-bold text-muted-foreground">{stat.trend}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-20">
            <div className="lg:col-span-2">
              <div className="glass rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl">
                <div className="p-8 border-b border-white/10 flex items-center justify-between">
                   <h3 className="text-xl font-black">Breed Price Index</h3>
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Updated 5m ago</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-primary/5">
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Breed</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Market Price</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground">Change</th>
                        <th className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { breed: "Sahiwal Cow", price: "$1,800 - $2,400", change: "+4.2%", trend: "Upward" },
                        { breed: "Brahman Bull", price: "$3,500 - $5,000", change: "-1.5%", trend: "Stable" },
                        { breed: "Dorset Sheep", price: "$400 - $650", change: "+12.0%", trend: "High" },
                        { breed: "Golden Retriever", price: "$800 - $1,500", change: "+0.5%", trend: "Stable" }
                      ].map((item) => (
                        <tr key={item.breed} className="hover:bg-white/5 transition-colors">
                          <td className="p-6 font-bold">{item.breed}</td>
                          <td className="p-6 font-medium text-muted-foreground">{item.price}</td>
                          <td className={cn("p-6 font-black", item.change.startsWith('+') ? "text-emerald-500" : "text-primary")}>
                            {item.change}
                          </td>
                          <td className="p-6 text-right">
                             <div className="inline-flex h-2 w-12 bg-muted rounded-full overflow-hidden">
                                <div className={cn("h-full", item.change.startsWith('+') ? "bg-emerald-500 w-3/4" : "bg-primary w-1/2")}></div>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
               <div className="glass p-10 rounded-[2.5rem] bg-primary text-white border-none shadow-2xl shadow-primary/30 relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-4 text-white">Join the Elite <br />Seller Program</h3>
                    <p className="text-primary-foreground/80 mb-8 font-medium">Get lower transaction fees, priority listing placement, and a verified badge.</p>
                    <button className="h-12 px-8 rounded-full bg-white text-primary text-sm font-black hover:scale-105 transition-all">
                      Apply Now
                    </button>
                  </div>
                  <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-1000"></div>
               </div>
               <div className="glass p-10 rounded-[2.5rem] border border-white/20 shadow-xl">
                  <h4 className="text-lg font-black mb-4">Market News</h4>
                  <div className="space-y-6">
                    {[
                      { title: "New livestock regulations for 2024", time: "2h ago" },
                      { title: "Top 5 pet health tips for summer", time: "5h ago" }
                    ].map((news) => (
                      <div key={news.title} className="group cursor-pointer">
                        <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">{news.time}</p>
                        <p className="font-bold group-hover:text-primary transition-colors">{news.title}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] -z-10"></div>
      </section>

      {/* Featured Categories Section */}
      <section className="bg-muted/30 section-padding">
        <div className="container">
          <div className="mb-16 text-center lg:text-left">
            <h2 className="mb-4">Explore by <span className="text-gradient">Categories</span></h2>
            <p className="max-w-2xl text-lg">Find exactly what you're looking for with our curated categories.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Dogs", icon: "🐕", count: "1,200+" },
              { name: "Cats", icon: "🐈", count: "800+" },
              { name: "Birds", icon: "🦜", count: "450+" },
              { name: "Livestock", icon: "🐄", count: "2,500+" }
            ].map((cat) => (
              <div key={cat.name} className="group relative overflow-hidden rounded-[2.5rem] bg-card p-10 shadow-sm border border-transparent hover:border-primary/20 transition-all hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:-translate-y-2">
                <div className="mb-8 h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-4xl group-hover:bg-primary group-hover:scale-110 transition-all">
                  {cat.icon}
                </div>
                <h3 className="text-2xl font-black mb-2">{cat.name}</h3>
                <p className="text-sm font-bold text-muted-foreground mb-8 uppercase tracking-widest">{cat.count} listings</p>
                <div className="inline-flex items-center text-sm font-black text-primary group-hover:translate-x-2 transition-transform">
                  Browse Now <span className="ml-2">→</span>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Level Feature Section: Verification */}
      <section className="section-padding bg-background relative overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                 <div className="absolute inset-0 bg-primary/10 rounded-[3rem] rotate-6 animate-pulse"></div>
                 <div className="absolute inset-0 glass rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-12 text-center border border-white/50">
                    <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white mb-8 shadow-2xl shadow-primary/40">
                       <CheckCircle2 className="size-12" />
                    </div>
                    <h3 className="text-3xl font-black mb-4">Certified Safe</h3>
                    <p className="text-lg font-medium text-muted-foreground leading-relaxed">Our multi-layer verification system ensures every animal is healthy and every seller is legitimate.</p>
                 </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary mb-6">
                Premium Feature
              </div>
              <h2 className="mb-8 leading-[1.1]">The Safest Way to <br /><span className="text-gradient">Buy and Sell</span></h2>
              <div className="space-y-10">
                {[
                  { title: "Health Records", desc: "Every premium listing comes with verified veterinary health certificates." },
                  { title: "Verified Identity", desc: "Sellers are identity-verified to prevent fraud and ensure high-quality livestock." },
                  { title: "Inspection Service", desc: "Book a professional inspector to check the animal before you close the deal." }
                ].map((f) => (
                  <div key={f.title} className="flex gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary shadow-xl shadow-primary/20 flex-shrink-0 flex items-center justify-center text-white">
                       <ShieldCheck className="size-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black mb-2">{f.title}</h4>
                      <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Recommended for You Section */}
      <section className="bg-muted/30 section-padding">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="mb-4">Recommended <br /><span className="text-gradient">for You</span></h2>
              <p className="text-lg">Personalized picks based on the latest activity in the marketplace.</p>
            </div>
            <Link 
              href="/listings" 
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-8 font-black border-primary text-primary hover:bg-primary hover:text-white transition-all")}
            >
              See All Listings
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {/* Note: In a real app, this would be fetched from the API. 
                 Using ListingCard with simulated data or just a message if no data. */}
             <div className="col-span-full py-20 text-center glass rounded-[3rem] border-dashed border-white/40">
                <p className="text-muted-foreground font-medium text-lg">
                  Sign in to see personalized recommendations or browse all listings.
                </p>
                <Link href="/listings" className="text-primary font-black mt-4 inline-block hover:underline">Explore Marketplace →</Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
