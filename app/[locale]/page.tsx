"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from 'next-intl'

export default function Home() {
  const [email, setEmail] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState(new Set())
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()

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

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setIsMenuOpen(false)
    }
  }

  const handleRoute = (path: string) => {
    router.push(`/${locale}${path}`)
    setIsMenuOpen(false)
  }

  const switchLocale = (newLocale: string) => {
    router.push(`/${newLocale}`)
  }

  return (
    <div className="relative bg-black text-white overflow-x-hidden">

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
            {t('Hero.title')}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10 text-sm tracking-widest font-light">
            {['about', 'features', 'global', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-white/70 hover:text-[#d4af37] transition-all duration-300 relative group"
              >
                {t(`Nav.${item}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
            
            <button
              onClick={() => handleRoute('/login')}
              className="px-6 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 rounded-sm"
            >
              {t('Nav.signIn')}
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
              {['about', 'features', 'global', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-white/70 hover:text-[#d4af37] transition-all duration-300"
                >
                  {t(`Nav.${item}`)}
                </button>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="flex gap-2">
                <button
                  onClick={() => switchLocale('en')}
                  className={`px-4 py-2 text-xs transition-all duration-300 ${
                    locale === 'en' 
                      ? 'bg-[#d4af37] text-black' 
                      : 'text-white/70 hover:text-[#d4af37]'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => switchLocale('br')}
                  className={`px-4 py-2 text-xs transition-all duration-300 ${
                    locale === 'br' 
                      ? 'bg-[#d4af37] text-black' 
                      : 'text-white/70 hover:text-[#d4af37]'
                  }`}
                >
                  PT
                </button>
              </div>

              <button
                onClick={() => handleRoute('/login')}
                className="px-6 py-2 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all duration-300 rounded-sm"
              >
                {t('Nav.signIn')}
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
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight">
              <span className="text-gradient">{t('Hero.title')}</span>
            </h1>
            <div className="h-0.5 w-32 mx-auto bg-linear-to-r from-transparent via-[#d4af37] to-transparent" />
            <p className="text-2xl md:text-4xl font-light text-white/90 tracking-wide">
              {t('Hero.tagline')}
            </p>
          </div>

          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            {t('Hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('contact')}
              className="px-10 py-4 bg-[#d4af37] text-black font-medium text-lg hover:bg-[#f4e5b8] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#d4af37]/50"
            >
              {t('Hero.joinBeta')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="px-10 py-4 border border-[#d4af37] text-[#d4af37] font-medium text-lg hover:bg-[#d4af37]/10 transition-all duration-300 hover:scale-105"
            >
              {t('Hero.learnMore')}
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
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/60 to-black/80" />
        
        <div className={`relative z-10 max-w-5xl mx-auto text-center space-y-16 transition-all duration-1000 ${
          visibleSections.has("about") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif font-semibold">
              {t('About.title')} <br />
              <span className="text-gradient">{t('About.titleHighlight')}</span>
            </h2>
            <div className="h-px w-24 mx-auto bg-[#d4af37]" />
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 text-left items-stretch">
            {[
              {
                title: t('About.problem'),
                content: t('About.problemDesc')
              },
              {
                title: t('About.solution'),
                content: t('About.solutionDesc')
              },
              {
                title: t('About.future'),
                content: t('About.futureDesc')
              }
            ].map((item, i) => (
              <div
                key={i}
                className="relative overflow-hidden group flex flex-col"
                style={{
                  transitionDelay: `${i * 200}ms`
                }}
              >
                <div className="relative glass-effect p-8 space-y-4 hover:border-[#d4af37]/50 transition-all duration-500 flex flex-col grow">
                  <h3 className="text-xl font-serif text-[#d4af37]">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed grow">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t('About.closing')}
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
              {t('Features.title')} <span className="text-gradient">{t('Features.titleHighlight')}</span>
            </h2>
            <div className="h-px w-24 mx-auto bg-[#d4af37]" />
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t('Features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('Features.sourceBackedTitle'),
                desc: t('Features.sourceBackedDesc'),
                icon: '/icons/scale2.png',
              },
              {
                title: t('Features.documentTitle'),
                desc: t('Features.documentDesc'),
                icon: '/icons/doc2.png',
              },
              {
                title: t('Features.jurisdictionTitle'),
                desc: t('Features.jurisdictionDesc'),
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
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#d4af37] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
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
        <div className="absolute inset-0 bg-linear-to-b from-black via-[#0a0604] to-black" />
        
        <div className={`relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center transition-all duration-1000 ${
          visibleSections.has('global') ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="space-y-10 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-serif font-semibold leading-tight">
                {t('Global.title')}<br />
                <span className="text-gradient">{t('Global.titleHighlight')}</span>
              </h2>
              <div className="h-px w-24 mx-auto lg:mx-0 bg-[#d4af37]" />
            </div>

            <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {t('Global.description')}
            </p>

            <div className="glass-effect p-8 space-y-6">
              <p className="text-[#d4af37] font-medium text-lg">{t('Global.roadmap')}</p>
              <div className="space-y-4">
                {[
                  { text: t('Global.brazil'), status: t('Global.live') },
                  { text: t('Global.usCanada'), status: t('Global.q2') },
                  { text: t('Global.restOfWorld'), status: t('Global.year') }
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
                      item.status === t('Global.live')
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
        <div className="absolute inset-0 bg-linear-to-t from-[#d4af37]/5 via-black to-black" />
        
        <div className={`relative z-10 max-w-4xl mx-auto text-center space-y-16 transition-all duration-1000 ${
          visibleSections.has('contact') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-serif font-semibold leading-tight">
              {t('Contact.title')} <span className="text-gradient">{t('Contact.titleHighlight')}</span>
            </h2>
            <div className="h-px w-24 mx-auto bg-[#d4af37]" />
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t('Contact.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { 
                title: t('Contact.existingTitle'),
                desc: t('Contact.existingDesc'),
                buttonText: t('Contact.existingButton'),
                link: "/login",
                primary: false
              },
              { 
                title: t('Contact.newTitle'),
                desc: t('Contact.newDesc'),
                buttonText: t('Contact.newButton'),
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
            <p className="text-white/50 text-sm tracking-widest">{t('Contact.earlyAccess')}</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('Contact.emailPlaceholder')}
                className="flex-1 px-6 py-4 bg-white/5 border border-[#d4af37]/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all duration-300"
              />
              <button className="px-8 py-4 bg-[#d4af37] text-black font-medium hover:bg-[#f4e5b8] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#d4af37]/50 whitespace-nowrap">
                {t('Contact.requestAccess')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-[#d4af37]/20 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
          <p className="font-serif text-[#d4af37]">{t('Hero.title')}</p>
          <p>{t('Footer.copyright')}</p>
          <div className="flex gap-6">
            <button onClick={()=> handleRoute("/privacy")} className="hover:text-[#d4af37] transition-colors duration-300">{t('Footer.privacy')}</button>
            <button onClick={()=> handleRoute("/terms")} className="hover:text-[#d4af37] transition-colors duration-300">{t('Footer.terms')}</button>
            <button onClick={()=> handleRoute("/contact")} className="hover:text-[#d4af37] transition-colors duration-300">{t('Footer.contact')}</button>
          </div>
        </div>
      </footer>
    </div>
  )
}