import { Suspense } from "react"
import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ShieldCheck, ArrowLeft, TrendingUp, Users } from "lucide-react"

/**
 * Login page — form submits to POST /api/auth/login.
 */
export default function LoginPage() {
  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      {/* Left Side - Cinematic Content */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center p-20">
         <div className="relative z-10 max-w-lg">
            <Link href="/" className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 mb-12 hover:bg-white/20 transition-all group">
               <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
               <span className="text-[10px] font-black uppercase tracking-widest">Back to Marketplace</span>
            </Link>
            <h1 className="text-7xl font-black text-white leading-tight mb-8">Secure Access to <span className="text-emerald-300">PasturePro.</span></h1>
            <p className="text-primary-foreground/80 text-xl font-medium mb-12 leading-relaxed">
               Welcome back to the global hub of livestock and pet trading. Manage your assets and connect with verified buyers in one secure environment.
            </p>
            
            <div className="space-y-6">
               {[
                 { icon: ShieldCheck, label: "Bank-Grade Encryption", desc: "Your data is protected by the highest security protocols." },
                 { icon: Users, label: "Verified Network", desc: "Connect with a global community of trusted traders." }
               ].map((f, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 border border-white/20">
                       <f.icon className="size-5" />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{f.label}</h4>
                       <p className="text-xs font-medium text-primary-foreground/60">{f.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
         {/* Decorative Gradients */}
         <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
         <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-[120px]" />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-muted/30 relative">
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="space-y-4 text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
               <Link href="/" className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">P</div>
                  <span className="text-2xl font-black">PasturePro</span>
               </Link>
            </div>
            <h2 className="text-4xl font-black tracking-tight">Identity <span className="text-gradient">Verification</span></h2>
            <p className="text-lg text-muted-foreground font-medium">
              Enter your credentials to access the command center.
            </p>
          </div>
          
          <div className="glass p-10 rounded-[3rem] border-white/60 shadow-2xl relative overflow-hidden bg-white/80">
            <Suspense
              fallback={
                <div className="space-y-4 py-8">
                  <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
                  <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
                </div>
              }
            >
              <LoginForm />
            </Suspense>
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-bl-full pointer-events-none" />
          </div>

          <p className="text-center text-sm font-bold text-muted-foreground">
            New to the network?{" "}
            <Link href="/register" className="text-primary hover:underline font-black">
              Create an Identity Profile
            </Link>
          </p>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 h-full w-full pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>
    </div>
  )
}
