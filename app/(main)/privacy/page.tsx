import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | PasturePro",
  description: "PasturePro Privacy Policy — how we collect, use, and protect your data.",
}

const sections = [
  {
    title: "Information We Collect",
    body: "We collect information you provide directly, such as your name, email address, phone number, and location when you create an account or post a listing. We also collect usage data, device information, and cookies to improve the platform experience.",
  },
  {
    title: "How We Use Your Information",
    body: "Your information is used to provide and improve our services, verify seller identity, facilitate buyer–seller communication, send transactional emails, and comply with legal obligations. We do not sell your personal data to third parties.",
  },
  {
    title: "Cookies & Tracking",
    body: "We use essential cookies to maintain your session and authentication state. We may also use analytics cookies to understand how the platform is used. You can manage cookie preferences through your browser settings.",
  },
  {
    title: "Data Sharing",
    body: "We share your data only with trusted service providers necessary to operate the platform (e.g., cloud infrastructure, image hosting via Cloudinary). All third-party providers are bound by confidentiality agreements.",
  },
  {
    title: "Data Security",
    body: "We implement industry-standard security measures including HTTPS, encrypted tokens, and hashed passwords. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    title: "Your Rights",
    body: "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@pasturepro.com. We will respond within 30 days.",
  },
  {
    title: "Contact",
    body: "If you have any questions about this Privacy Policy, please contact our Data Protection Officer at privacy@pasturepro.com.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen section-padding">
      <div className="container max-w-3xl">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Legal
          </div>
          <h1 className="mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground font-medium">Last updated: January 2025</p>
        </div>

        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title} className="glass p-10 rounded-[2rem] border-white/40 shadow-xl">
              <h2 className="text-xl font-black mb-4">{s.title}</h2>
              <p className="text-muted-foreground font-medium leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
