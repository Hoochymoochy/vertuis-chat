"use client"

import { Button } from "@/app/component/button"
import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import Image from 'next/image';
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [route, setRoute] = useState("")
/**
 * Smoothly scrolls to the given HTML element with the given id.
 * Closes the navigation menu if it is open.
 * @param {string} id - The id of the HTML element to scroll to.
 */

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.2 }
    )

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  const handleRoute = (path: string) => {
    router.push(path); // simple push
  }

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="relative bg-[#1a1410] text-white">
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.5s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-rotate-slow {
          animation: rotate 20s linear infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#1a1410]/80 backdrop-blur-sm border-b border-[#d4af37]/20 transition-all duration-300">
        <a
          onClick={() => scrollToSection("top")}
          className="cursor-pointer text-sm font-light tracking-widest text-[#d4af37] hover:text-[#d4af37]/80 transition-all duration-300 hover:scale-110"
        >
          VERITUS
        </a>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-[#d4af37]/70 hover:text-[#d4af37] transition-all duration-300 hover:rotate-90"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
          <div className="hidden md:flex gap-12 text-xs tracking-widest">
            <button onClick={() => scrollToSection("about")} className="text-white/70 hover:text-[#d4af37] transition duration-300 hover:scale-110">
              ABOUT
            </button>
            <button onClick={() => scrollToSection("features")} className="text-white/70 hover:text-[#d4af37] transition duration-300 hover:scale-110">
              FEATURES
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-white/70 hover:text-[#d4af37] transition duration-300 hover:scale-110">
              CONTACT
            </button>
          </div>

        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#1a1410]/95 backdrop-blur-md border-b border-[#d4af37]/20 md:hidden animate-fadeIn">
            <div className="flex flex-col gap-4 px-6 py-4 text-xs tracking-widest">
              <button
                onClick={() => scrollToSection("about")}
                className="text-white/70 hover:text-[#d4af37] transition hover:translate-x-2"
              >
                ABOUT
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-white/70 hover:text-[#d4af37] transition hover:translate-x-2"
              >
                FEATURES
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-white/70 hover:text-[#d4af37] transition hover:translate-x-2"
              >
                CONTACT
              </button>
            </div>
          </div>
        )}
      </nav>


      {/* Panel 1: Logo Full View */}
      <section className="h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        <div 
          className="relative z-10 animate-fadeInUp"
          style={{
            opacity: Math.max(0, 1 - scrollY / 500),
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        >
          <Image
            src="/icon.png"
            alt="Veritus Logo"
            width={600}
            height={120}
            className="animate-fadeIn"
          />
          <p className="text-gray-400 text-sm uppercase tracking-widest mt-8 text-center animate-pulse">
            Scroll to discover
          </p>
        </div>
      </section>

{/* Panel 2: Brand Story */}
<section
  id="about"
  className="h-[66vh] w-full flex flex-col items-center justify-center bg-black text-center text-white px-6"
>
  <div
    className={`transition-all duration-1000 ${
      visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <h2 className="text-4xl md:text-6xl font-light leading-tight mb-6">
      <span className="text-gold inline-block hover:scale-110 transition-transform duration-300">Veritus</span>
      <br />
      AI You Can Swear By
    </h2>

    <p
      className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-8 transition-all duration-700 delay-200"
      style={{
        opacity: visibleSections.has('about') ? 1 : 0,
        transform: visibleSections.has('about') ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      Law shouldn't be a guessing game. Every day, lawyers waste hours verifying
      citations, chasing amendments, and second-guessing if AI might be right.
      Veritus ends that.
    </p>

    <p
      className="text-gold text-base md:text-lg font-light transition-all duration-700 delay-400"
      style={{
        opacity: visibleSections.has('about') ? 1 : 0,
        transform: visibleSections.has('about') ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      The next era of legal integrity starts here.
    </p>
  </div>
</section>


{/* Panel 3: The Why - Hero Features */}
<section
  id="features"
  className="min-h-[66vh] w-full flex flex-col items-center justify-center bg-black text-white px-8 py-20"
>
  <h2
    className={`text-4xl md:text-6xl font-light text-center mb-16 transition-all duration-1000 ${
      visibleSections.has('features') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
    }`}
  >
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
        className="flex flex-col items-center text-center p-8 border border-[#d4af37]/40 rounded-xl hover:border-[#d4af37] hover:scale-105 hover:shadow-2xl hover:shadow-[#d4af37]/20 transition-all duration-500 cursor-pointer group"
        style={{
          opacity: visibleSections.has('features') ? 1 : 0,
          transform: visibleSections.has('features') ? 'translateY(0)' : 'translateY(40px)',
          transitionDelay: `${i * 200}ms`,
        }}
      >
        <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-125 group-hover:animate-float">{feature.icon}</div>
        <h3 className="text-2xl font-light text-[#d4af37] mb-2">{feature.title}</h3>
        <p className="text-white/70 leading-relaxed">{feature.desc}</p>
      </div>
    ))}
  </div>
</section>



        {/* Panel 4: Global Reach */}
        <section id="global" className="min-h-screen w-full flex items-center justify-center bg-black text-white px-8 py-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side: Text */}
            <div className={`space-y-8 text-center lg:text-left transition-all duration-1000 ${visibleSections.has('global') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
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
                  {[
                    "Utah State & Federal Law",
                    "Multi-State Coverage (Coming Soon)",
                    "International Markets (2025)"
                  ].map((item, i) => (
                    <li 
                      key={i}
                      className="flex items-center gap-2 justify-center lg:justify-start transition-all duration-500"
                      style={{
                        opacity: visibleSections.has('global') ? 1 : 0,
                        transform: visibleSections.has('global') ? 'translateX(0)' : 'translateX(-20px)',
                        transitionDelay: `${(i + 2) * 200}ms`
                      }}
                    >
                      <span className="w-2 h-2 rounded-full bg-gold animate-pulse" style={{ animationDelay: `${i * 300}ms` }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side: Visual */}
            <div className={`flex items-center justify-center transition-all duration-1000 ${visibleSections.has('global') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <svg viewBox="0 0 200 200" className="w-64 h-64 text-gold opacity-70">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" className="animate-rotate-slow origin-center" />
                <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <g opacity="0.6" className="animate-float">
                  <polygon points="100,40 120,60 110,85 90,85 80,60" fill="currentColor" />
                  <polygon points="100,40 140,50 135,80 105,75" fill="currentColor" />
                  <polygon points="100,40 80,50 75,80 95,75" fill="currentColor" />
                </g>
              </svg>
            </div>
          </div>
        </section>


      {/* Panel 5: CTA - Join the Beta */}
      <section id="contact" className="min-h-screen w-full flex items-center justify-center bg-black text-white px-8 py-20 relative overflow-hidden">

        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          {/* Header */}
          <div className={`space-y-6 transition-all duration-1000 ${visibleSections.has('contact') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
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
            {[
              { title: "For Existing Users", desc: "Sign in to access your account", buttonText: "Sign In", routerLink: "/login" },
              { title: "New to Veritus?", desc: "Join our beta program", buttonText: "Join Beta", routerLink: "/register" },
            ].map((card, i) => (
              <div 
                key={i}
                className="group bg-[#d4af37]/10 border border-[#d4af37]/30 p-8 rounded-xl hover:border-[#d4af37]/60 hover:scale-105 hover:shadow-2xl hover:shadow-[#d4af37]/20 transition-all duration-500 cursor-pointer"
                style={{
                  opacity: visibleSections.has('contact') ? 1 : 0,
                  transform: visibleSections.has('contact') ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${(i + 1) * 200}ms`
                }}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-light text-gold">{card.title}</h3>
                  <p className="text-white/70">{card.desc}</p>
                  <Button 
                    className="w-full bg-gold text-black hover:bg-[#d4af37]/80 font-medium transition-all duration-300 hover:scale-105"
                    onClick={() => handleRoute(card.routerLink)} // <-- Push route here
                  >
                    {card.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Email Access */}
          <div 
            className="pt-12 border-t border-[#d4af37]/20 transition-all duration-1000"
            style={{
              opacity: visibleSections.has('contact') ? 1 : 0,
              transform: visibleSections.has('contact') ? 'translateY(0)' : 'translateY(30px)',
              transitionDelay: '600ms'
            }}
          >
            <p className="text-gold/70 text-sm mb-4">or get early access via email</p>
            <div className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl text-white placeholder:text-[#d4af37]/60 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300 focus:scale-105"
              />
              <Button className="bg-gold text-black hover:bg-[#d4af37]/80 px-6 font-medium transition-all duration-300 hover:scale-110">
                Join
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}