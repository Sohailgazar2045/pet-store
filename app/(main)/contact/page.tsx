"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="bg-muted/30 min-h-screen section-padding">
      <div className="container max-w-6xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            Institutional Support
          </div>
          <h1 className="mb-4">Get in <span className="text-gradient">Touch</span></h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl mx-auto">
            Our expert support team is available to help you with listings, verifications, and account matters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email Support", value: "support@pasturepro.com", sub: "Response within 24h" },
              { icon: Phone, label: "Phone", value: "+92 300 000 0000", sub: "Mon–Sat, 9am – 6pm" },
              { icon: MapPin, label: "Headquarters", value: "Lahore, Pakistan", sub: "Visit by appointment" },
            ].map((item) => (
              <div key={item.label} className="glass p-8 rounded-[2rem] border-white/40 shadow-xl flex gap-5">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <item.icon className="size-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-black text-base">{item.value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 glass p-10 rounded-[3rem] border-white/40 shadow-2xl">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 gap-6">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="size-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black">Message Received!</h2>
                <p className="text-muted-foreground font-medium max-w-sm">
                  Thank you for reaching out. Our team will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-black mb-8">Send a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-black text-xs uppercase tracking-widest">Full Name</Label>
                    <Input id="name" name="name" placeholder="Your name" value={form.name} onChange={handleChange}
                      className="h-12 rounded-full px-5 bg-white/60 border-white/40" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-black text-xs uppercase tracking-widest">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange}
                      className="h-12 rounded-full px-5 bg-white/60 border-white/40" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-black text-xs uppercase tracking-widest">Subject</Label>
                  <Input id="subject" name="subject" placeholder="How can we help?" value={form.subject} onChange={handleChange}
                    className="h-12 rounded-full px-5 bg-white/60 border-white/40" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="font-black text-xs uppercase tracking-widest">Message</Label>
                  <textarea
                    id="message" name="message" rows={5}
                    placeholder="Describe your enquiry in detail..."
                    value={form.message} onChange={handleChange}
                    className="w-full rounded-[1.5rem] px-5 py-4 bg-white/60 border border-white/40 focus:outline-none focus:ring-4 focus:ring-primary/10 text-sm font-medium resize-none"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-full font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
