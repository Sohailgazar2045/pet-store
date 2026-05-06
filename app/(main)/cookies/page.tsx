import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | PasturePro",
  description: "Learn how PasturePro uses cookies and how you can control them.",
}

const cookieTypes = [
  {
    name: "Essential Cookies",
    purpose: "Required for the platform to function correctly. These include authentication session cookies and CSRF protection tokens.",
    canDisable: false,
  },
  {
    name: "Preference Cookies",
    purpose: "Store your settings and preferences such as theme (light/dark mode) and regional options to personalise your experience.",
    canDisable: true,
  },
  {
    name: "Analytics Cookies",
    purpose: "Help us understand how visitors use PasturePro so we can improve performance and content. Data is anonymised and aggregated.",
    canDisable: true,
  },
]

export default function CookiesPage() {
  return (
    <div className="bg-background min-h-screen section-padding">
      <div className="container max-w-3xl">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Legal
          </div>
          <h1 className="mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground font-medium">Last updated: January 2025</p>
        </div>

        <div className="glass p-10 rounded-[2rem] border-white/40 shadow-xl mb-10">
          <h2 className="text-xl font-black mb-4">What Are Cookies?</h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help us remember your preferences, keep you logged in, and understand how our platform is used so we can make it better.
          </p>
        </div>

        <div className="space-y-6 mb-10">
          {cookieTypes.map((ct) => (
            <div key={ct.name} className="glass p-10 rounded-[2rem] border-white/40 shadow-xl">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="text-xl font-black">{ct.name}</h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ct.canDisable ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}`}>
                  {ct.canDisable ? "Optional" : "Required"}
                </span>
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed">{ct.purpose}</p>
            </div>
          ))}
        </div>

        <div className="glass p-10 rounded-[2rem] border-white/40 shadow-xl">
          <h2 className="text-xl font-black mb-4">Managing Cookies</h2>
          <p className="text-muted-foreground font-medium leading-relaxed">
            You can control cookies through your browser settings. Note that disabling essential cookies may prevent the platform from working correctly. For questions, contact us at privacy@pasturepro.com.
          </p>
        </div>
      </div>
    </div>
  )
}
