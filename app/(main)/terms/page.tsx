import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | PasturePro",
  description: "PasturePro Terms of Service — understand your rights and responsibilities when using our platform.",
}

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using PasturePro, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.",
  },
  {
    title: "2. Use of the Platform",
    body: "PasturePro grants you a limited, non-exclusive, non-transferable licence to access and use the platform for lawful purposes only. You may not use the platform to post false, misleading, or fraudulent listings, or to engage in any activity that violates applicable law.",
  },
  {
    title: "3. Listings & Content",
    body: "Sellers are solely responsible for the accuracy of their listings, including animal health status, vaccinations, and ownership. PasturePro manually reviews all new listings for quality assurance but does not guarantee the accuracy of seller-provided information.",
  },
  {
    title: "4. Account Responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify PasturePro immediately of any unauthorised access to your account. PasturePro is not liable for any loss or damage arising from your failure to secure your account.",
  },
  {
    title: "5. Payments & Transactions",
    body: "PasturePro facilitates the discovery and communication between buyers and sellers. All financial transactions are conducted directly between parties. PasturePro is not a party to any transaction and accepts no liability for disputes arising from buyer–seller interactions.",
  },
  {
    title: "6. Prohibited Activities",
    body: "You may not use PasturePro to conduct fraudulent transactions, post endangered species, violate animal welfare laws, harvest user data, or engage in spamming or phishing. Violations will result in immediate account termination.",
  },
  {
    title: "7. Termination",
    body: "PasturePro reserves the right to suspend or terminate your account at any time, with or without notice, for conduct that violates these Terms or is otherwise harmful to other users, the platform, or third parties.",
  },
  {
    title: "8. Changes to Terms",
    body: "PasturePro reserves the right to modify these Terms at any time. Changes will be effective upon posting to the platform. Continued use of PasturePro after any changes constitutes acceptance of the new Terms.",
  },
]

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen section-padding">
      <div className="container max-w-3xl">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Legal
          </div>
          <h1 className="mb-4">Terms of Service</h1>
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
