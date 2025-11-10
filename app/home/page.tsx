"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Home() {
  const [email, setEmail] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState(new Set())

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

  const scrollToSection = (id) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const handleRoute = (path) => {
    console.log(`Navigating to: ${path}`)
  }

  return (
    <div className="relative bg-black text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(40px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(212, 175, 55, 0.5);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212, 175, 55, 0.1),
            transparent
          );
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #d4af37 0%, #f4e5b8 50%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrollY > 100 
            ? 'opacity-100 translate-y-0 bg-black/80 backdrop-blur-xl border-b border-[#d4af37]/20 shadow-xl' 
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-2xl font-serif font-semibold tracking-wide text-gradient hover:scale-105 transition-transform duration-300"
          >
            VERITUS
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10 text-sm tracking-widest font-light">
            {['ABOUT', 'FEATURES', 'GLOBAL', 'CONTACT'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-white/70 hover:text-[#d4af37] transition-all duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            <button
              onClick={() => handleRoute('/login')}
              className="px-6 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 rounded-sm"
            >
              SIGN IN
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#d4af37]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-[#d4af37]/20">
            <div className="flex flex-col items-center gap-6 py-8 text-sm tracking-widest">
              {['ABOUT', 'FEATURES', 'GLOBAL', 'CONTACT'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-white/70 hover:text-[#d4af37] transition-all duration-300"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => handleRoute('/login')}
                className="px-6 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 rounded-sm"
              >
                SIGN IN
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center"
      >

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 text-center space-y-12 bg-black/80 backdrop-blur-xl border border-[#d4af37]/20">
          <div className="space-y-6 animate-fadeInUp">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight">
              <span className="text-gradient">VERITUS</span>
            </h1>
            <div className="h-[2px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            <p className="text-2xl md:text-4xl font-light text-white/90 tracking-wide">
              AI You Can Swear By
            </p>
          </div>

          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            The next generation of legal intelligence. Every citation verified. Every answer trusted. 
            Built for lawyers who demand precision in an era of uncertainty.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-10 py-4 bg-[#d4af37] text-black font-medium text-lg hover:bg-[#f4e5b8] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#d4af37]/50"
            >
              Join the Beta
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-10 py-4 border border-[#d4af37] text-[#d4af37] font-medium text-lg hover:bg-[#d4af37]/10 transition-all duration-300 hover:scale-105"
            >
              Learn More
            </button>
          </div>

          <button
            onClick={() => scrollToSection('about')}
            className=" text-[#d4af37]/50 hover:text-[#d4af37] transition-all duration-300 animate-float"
          >
            <ChevronDown size={40} />
          </button>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="relative min-h-screen flex items-center justify-center py-32 px-6 lg:px-12"
      >
        {/* Marble Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/marble.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        
        <div className={`relative z-10 max-w-5xl mx-auto text-center space-y-16 transition-all duration-1000 ${
          visibleSections.has("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif font-semibold">
              Law Shouldn't Be a <br />
              <span className="text-gradient">Guessing Game</span>
            </h2>
            <div className="h-[1px] w-24 mx-auto bg-[#d4af37]" />
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 text-left items-stretch">
            {[
              {
                title: "The Problem",
                content:
                  "Every day, legal professionals waste hours verifying citations, chasing amendments, and second guessing AI hallucinations."
              },
              {
                title: "The Solution",
                content:
                  "Veritus eliminates uncertainty with source-backed answers, real-time legal updates, and zero tolerance for hallucinations."
              },
              {
                title: "The Future",
                content:
                  "A new era where lawyers trust their AI completely, focusing on strategy instead of fact-checking."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="relative overflow-hidden group flex flex-col"
                style={{
                  transitionDelay: `${i * 200}ms`
                }}
              >
                <div className="relative glass-effect p-8 space-y-4 hover:border-[#d4af37]/50 transition-all duration-500 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif text-[#d4af37]">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed flex-grow">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
            The next era of legal integrity starts here.
          </p>
        </div>
      </section>


      {/* Features Section */}
      <section
        id="features"
        className="relative min-h-screen flex items-center justify-center py-32 px-6 lg:px-12"
      >
        <div className="absolute inset-0 bg-black" />
        
        <div className={`relative z-10 max-w-7xl mx-auto space-y-20 transition-all duration-1000 ${
          visibleSections.has('features') ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-serif font-semibold">
              Precision <span className="text-gradient">Engineered</span>
            </h2>
            <div className="h-[1px] w-24 mx-auto bg-[#d4af37]" />
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Three pillars of legal AI you can trust
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Source-Backed Chat',
                desc: 'Ask any legal question and receive answers with verifiable citations from primary sources. Every claim. Every time.',
                icon: '/icons/scale2.png',
              },
              {
                title: 'Document Analysis',
                desc: 'Upload contracts, statutes, or case law. Instantly highlight key provisions, cross-reference citations, and understand context.',
                icon: '/icons/doc2.png',
              },
              {
                title: 'Jurisdiction Sync',
                desc: 'Real-time updates to federal, state, and regional law. Never miss an amendment or new precedent again.',
                icon: '/icons/globe2.png',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative glass-effect p-10 space-y-6 hover:border-[#d4af37]/50 hover:scale-105 transition-all duration-500"
                style={{
                  transitionDelay: `${i * 150}ms`
                }}
              >
              <div className="w-24 h-24 mb-6 relative">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="object-contain w-full h-full"
                />
              </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif text-[#d4af37]">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Section */}
      <section
        id="global"
        className="relative min-h-screen flex items-center justify-center py-32 px-6 lg:px-12"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0604] to-black" />
        
        <div className={`relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${
          visibleSections.has('global') ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="space-y-10 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-serif font-semibold leading-tight">
                Starting Local,<br />
                <span className="text-gradient">Scaling Global</span>
              </h2>
              <div className="h-[1px] w-24 mx-auto lg:mx-0 bg-[#d4af37]" />
            </div>

            <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
              We're mastering Utah law first—every statute, every case, every update. 
              Then expanding nationwide with the same uncompromising precision.
            </p>

            <div className="glass-effect p-8 space-y-6">
              <p className="text-[#d4af37] font-medium text-lg">Coverage Roadmap</p>
              <div className="space-y-4">
                {[
                  { text: "Utah State & Federal Law", status: "Live" },
                  { text: "All 50 States", status: "Q2 2025" },
                  { text: "International Markets", status: "2026" }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-white/10 last:border-0"
                    style={{
                      transitionDelay: `${i * 150}ms`
                    }}
                  >
                    <span className="text-white/80">{item.text}</span>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      item.status === 'Live' 
                        ? 'bg-[#d4af37]/20 text-[#d4af37]' 
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center order-1 lg:order-2">
            <img
              src="/world.png"
              alt="Global"
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="relative min-h-screen flex items-center justify-center py-32 px-6 lg:px-12"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#d4af37]/5 via-black to-black" />
        
        <div className={`relative z-10 max-w-4xl mx-auto text-center space-y-16 transition-all duration-1000 ${
          visibleSections.has('contact') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif font-semibold leading-tight">
              Join the <span className="text-gradient">Revolution</span>
            </h2>
            <div className="h-[1px] w-24 mx-auto bg-[#d4af37]" />
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Be among the first legal professionals to experience AI that never compromises on truth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { 
                title: "Existing Users", 
                desc: "Access your account", 
                buttonText: "Sign In", 
                link: "/login",
                primary: false
              },
              { 
                title: "New to Veritus?", 
                desc: "Request beta access", 
                buttonText: "Join Beta", 
                link: "/register",
                primary: true
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`glass-effect p-10 space-y-6 hover:border-[#d4af37]/50 hover:scale-105 transition-all duration-500 ${
                  card.primary ? 'ring-2 ring-[#d4af37]/30' : ''
                }`}
                style={{
                  transitionDelay: `${i * 200}ms`
                }}
              >
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif text-[#d4af37]">{card.title}</h3>
                  <p className="text-white/60">{card.desc}</p>
                </div>
                <button
                  onClick={() => handleRoute(card.link)}
                  className={`w-full py-4 font-medium transition-all duration-300 hover:scale-105 ${
                    card.primary
                      ? 'bg-[#d4af37] text-black hover:bg-[#f4e5b8] hover:shadow-2xl hover:shadow-[#d4af37]/50'
                      : 'border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10'
                  }`}
                >
                  {card.buttonText}
                </button>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-[#d4af37]/20 space-y-6">
            <p className="text-white/50 text-sm tracking-widest">EARLY ACCESS</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@firm.com"
                className="flex-1 px-6 py-4 bg-white/5 border border-[#d4af37]/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
              />
              <button className="px-8 py-4 bg-[#d4af37] text-black font-medium hover:bg-[#f4e5b8] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#d4af37]/50 whitespace-nowrap">
                Request Access
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#d4af37]/20 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
          <p className="font-serif text-[#d4af37]">VERITUS</p>
          <p>© 2025 Veritus AI. Legal intelligence redefined.</p>
          <div className="flex gap-6">
            <button className="hover:text-[#d4af37] transition-colors duration-300">Privacy</button>
            <button className="hover:text-[#d4af37] transition-colors duration-300">Terms</button>
            <button className="hover:text-[#d4af37] transition-colors duration-300">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  )
}