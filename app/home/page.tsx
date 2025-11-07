"use client"

import { Button } from "@/app/component/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from 'next/image';

export default function Home() {
  const [email, setEmail] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="relative bg-[#1a1410] text-white">
      {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#1a1410]/80 backdrop-blur-sm border-b border-[#d4af37]/20 transition-all duration-300">
      <a
        onClick={() => scrollToSection("top")}
        className="cursor-pointer text-sm font-light tracking-widest text-[#d4af37] hover:text-[#d4af37]/80 transition"
      >
        VERITUS
      </a>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-[#d4af37]/70 hover:text-[#d4af37] transition"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className="hidden md:flex gap-12 text-xs tracking-widest">
        <button onClick={() => scrollToSection("about")} className="text-white/70 hover:text-[#d4af37] transition duration-300">
          ABOUT
        </button>
        <button onClick={() => scrollToSection("features")} className="text-white/70 hover:text-[#d4af37] transition duration-300">
          FEATURES
        </button>
        <button onClick={() => scrollToSection("contact")} className="text-white/70 hover:text-[#d4af37] transition duration-300">
          CONTACT
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#1a1410]/95 backdrop-blur-md border-b border-[#d4af37]/20 md:hidden">
          <div className="flex flex-col gap-4 px-6 py-4 text-xs tracking-widest">
            <button
              onClick={() => scrollToSection("about")}
              className="text-white/70 hover:text-[#d4af37] transition"
            >
              ABOUT
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-white/70 hover:text-[#d4af37] transition"
            >
              FEATURES
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-white/70 hover:text-[#d4af37] transition"
            >
              CONTACT
            </button>
          </div>
        </div>
      )}
    </nav>


      {/* Panel 1: Logo Full View */}
      <section className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <Image
          src="/icon.png"
          alt="Veritus Logo"
          width={300}
          height={120}
          className="mb-6"
        />
        <p className="text-gray-400 text-sm uppercase tracking-widest">
          Scroll to discover
        </p>
      </section>

      {/* Panel 2: Brand Story */}
      <section id="about" className="h-screen w-full flex flex-col items-center justify-center bg-black text-center text-white px-6">
        <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6">
          <span className="text-gold">Veritus</span>
          <br />
          AI You Can Swear By
        </h2>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-8">
          Law shouldn’t be a guessing game. Every day, lawyers waste hours verifying
          citations, chasing amendments, and second-guessing if AI might be right.
          Veritus ends that.
        </p>

        <p className="text-gold text-base md:text-lg font-light">
          The next era of legal integrity starts here.
        </p>
      </section>




      {/* Panel 3: The Why - Hero Features */}
      <section id="features" className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white px-8 py-20">
        <h2 className="text-4xl md:text-6xl font-light text-center mb-16">
          Why <span className="text-gold">Veritus</span>?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl w-full">
          {[
            {
              title: "Source-Backed Chat",
              desc: "Ask any legal question and get answers with verifiable citations. No hallucinations. No guessing.",
              icon: "💬",
            },
            {
              title: "Document Analysis",
              desc: "Upload contracts, statutes, or case law. Highlight. Cross-reference. Understand instantly.",
              icon: "📄",
            },
            {
              title: "Jurisdiction Sync",
              desc: "Stay ahead of changes with real-time updates to federal, state, and regional law.",
              icon: "🗺",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-8 border border-[#d4af37]/40 rounded-xl hover:border-[#d4af37] transition duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-light text-[#d4af37] mb-2">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>


        {/* Panel 4: Global Reach */}
        <section className="min-h-screen w-full flex items-center justify-center bg-black text-white px-8 py-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Text */}
            <div className="space-y-8 text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-light leading-tight">
                Starting Local,
                <br />
                <span className="text-gold">Scaling Global</span>
              </h2>

              <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
                We're starting with Utah law, inside and out — with federal coverage expanding soon. 
                Every new region we add strengthens the network — a smarter, cleaner, citation-first web of law.
              </p>

              <div>
                <p className="text-gold font-light mb-3">Currently Supporting:</p>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-center gap-2 justify-center lg:justify-start">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    Utah State & Federal Law
                  </li>
                  <li className="flex items-center gap-2 justify-center lg:justify-start">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    Multi-State Coverage (Coming Soon)
                  </li>
                  <li className="flex items-center gap-2 justify-center lg:justify-start">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    International Markets (2025)
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side: Visual */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-64 h-64 text-gold opacity-70">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
                <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <g opacity="0.6">
                  <polygon points="100,40 120,60 110,85 90,85 80,60" />
                  <polygon points="100,40 140,50 135,80 105,75" />
                  <polygon points="100,40 80,50 75,80 95,75" />
                </g>
              </svg>
            </div>
          </div>
        </section>


      {/* Panel 5: CTA - Join the Beta */}
      <section id="contact" className="min-h-screen w-full flex items-center justify-center bg-black text-white px-8 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-light leading-tight">
              Join the <span className="text-gold">Future</span>
              <br />
              of Legal AI
            </h2>
            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              Be part of the first generation of lawyers who trust their AI. 
              Join the Veritus Beta — exclusive access for legal professionals, students, and firms building the future of law.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-8">
            <div className="group bg-[#d4af37]/10 border border-[#d4af37]/30 p-8 rounded-xl hover:border-[#d4af37]/60 transition duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-gold">For Existing Users</h3>
                <p className="text-white/70">Sign in to access your account</p>
                <Button className="w-full bg-gold text-black hover:bg-[#d4af37]/80 font-medium transition">
                  Sign In
                </Button>
              </div>
            </div>

            <div className="group bg-[#d4af37]/10 border border-[#d4af37]/30 p-8 rounded-xl hover:border-[#d4af37]/60 transition duration-300">
              <div className="space-y-4">
                <h3 className="text-lg font-light text-gold">New to Veritus?</h3>
                <p className="text-white/70">Join our beta program</p>
                <Button className="w-full bg-gold text-black hover:bg-[#d4af37]/80 font-medium transition">
                  Join Beta
                </Button>
              </div>
            </div>
          </div>

          {/* Email Access */}
          <div className="pt-12 border-t border-[#d4af37]/20">
            <p className="text-gold/70 text-sm mb-4">or get early access via email</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl text-white placeholder:text-[#d4af37]/60 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition"
              />
              <Button className="bg-gold text-black hover:bg-[#d4af37]/80 px-6 font-medium transition">
                Join
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}