import { Suspense } from "react"
import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"
import { ShieldCheck, ArrowLeft, Lock, Globe, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Left Side - Cinematic Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#050505] items-center justify-center p-24 overflow-hidden">
         <div className="relative z-10 max-w-lg">
            <Link href="/" className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-white/60 hover:text-white backdrop-blur-xl border border-white/10 mb-16 hover:bg-white/10 transition-all group">
               <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Marketplace Discovery</span>
            </Link>
            
            <div className="space-y-10">
               <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest">
                     <Lock className="size-3" /> Secure Gateway
                  </div>
                  <h1 className="text-6xl xl:text-8xl font-black text-white leading-[1.05] tracking-tighter">
                     Access the <span className="text-gradient">Hub.</span>
                  </h1>
               </div>
               
               <p className="text-white/40 text-xl font-medium leading-relaxed max-w-md">
                  Re-enter the world&apos;s most sophisticated livestock network. Your elite assets await management.
               </p>
               
               <div className="grid grid-cols-1 gap-8 pt-8">
                  {[
                    { icon: ShieldCheck, label: "Protocol Verified", desc: "Military-grade data protection." },
                    { icon: Globe, label: "Global Presence", desc: "Connect with buyers in 40+ nations." }
                  ].map((f, i) => (
                    <div key={i} className="flex gap-5 group">
                       <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all border border-white/10 group-hover:border-primary/20">
                          <f.icon className="size-6" />
                       </div>
                       <div>
                          <h4 className="text-[11px] font-black text-white uppercase tracking-[0.25em] mb-1">{f.label}</h4>
                          <p className="text-sm font-medium text-white/30">{f.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
         
         {/* Atmospheric Effects */}
         <div className="absolute top-0 right-0 h-full w-full bg-[radial-gradient(circle_at_20%_30%,_rgba(var(--primary),0.15),transparent_70%)]" />
         <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-[150px]" />
         <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
      </div>

      {/* Right Side - Authentication Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-muted/20 relative">
        <div className="w-full max-w-md space-y-12 relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-10">
               <Link href="/" className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl shadow-xl">P</div>
                  <span className="text-3xl font-black tracking-tighter">PasturePro</span>
               </Link>
            </div>
            <div className="space-y-2">
               <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground">Personnel <span className="text-gradient">Login</span></h2>
               <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                 Authenticate your identity to continue your trading operations.
               </p>
            </div>
          </div>
          
          <div className="glass p-12 rounded-[3.5rem] border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden bg-white/70">
            <Suspense
              fallback={
                <div className="space-y-6 py-10">
                  <div className="h-14 w-full bg-muted/40 rounded-2xl animate-pulse" />
                  <div className="h-14 w-full bg-muted/40 rounded-2xl animate-pulse" />
                  <div className="h-14 w-32 bg-primary/20 rounded-full animate-pulse mx-auto" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
            
            <div className="mt-10 pt-8 border-t border-muted/50 flex flex-col items-center gap-4">
               <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                  <CheckCircle2 className="size-3" /> System Status: Operational
               </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
             <p className="text-sm font-bold text-muted-foreground">
               New to the network?{" "}
               <Link href="/register" className="text-primary hover:text-emerald-600 font-black transition-colors">
                 Create Institutional Profile
               </Link>
             </p>
             <Link href="/forgot-password" title="Recover Access" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors">
                Recover Access Authority
             </Link>
          </div>
        </div>
        
        {/* Modernist Background Accent */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>
    </div>
  )
}
