import { Navbar } from "@/components/layout/Navbar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Navbar />
      {children}
    </div>
  )
}
