"use client"

import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations, useLocale } from "next-intl"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState(new Set<string>())
  const [email, setEmail] = useState("")
  const [waitlistStatus, setWaitlistStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    try {
      if (localStorage.getItem("veritus_waitlist")) {
        setWaitlistStatus("success")
      }
    } catch {
      /* ignore */
    }
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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
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

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    if (!valid) {
      setWaitlistStatus("error")
      return
    }

    setWaitlistStatus("loading")
    try {
      const existing = JSON.parse(
        localStorage.getItem("veritus_waitlist_emails") || "[]"
      ) as string[]
      if (!existing.includes(trimmed.toLowerCase())) {
        existing.push(trimmed.toLowerCase())
        localStorage.setItem(
          "veritus_waitlist_emails",
          JSON.stringify(existing)
        )
      }
      localStorage.setItem("veritus_waitlist", trimmed.toLowerCase())
      setWaitlistStatus("success")
      setEmail("")
    } catch {
      setWaitlistStatus("success")
    }
  }

  const navItems = ["about", "features", "product", "contact"] as const
  const navSolid = scrollY > 40

  const reveal = (id: string) =>
    visibleSections.has(id)
      ? "opacity-100 translate-y-0"
      : "opacity-0 translate-y-10"

  return (
    <div className="relative bg-[#050505] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navSolid
            ? "bg-black/70 backdrop-blur-2xl border-b border-[#d4af37]/15"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-xl md:text-2xl font-serif font-semibold tracking-[0.08em] text-gradient transition-opacity hover:opacity-80"
          >
            {t("Hero.title")}
          </button>

          <div className="hidden md:flex items-center gap-9 text-[11px] tracking-[0.22em] uppercase font-light">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-white/55 hover:text-[#d4af37] transition-colors duration-300 relative group"
              >
                {t(`Nav.${item}`)}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300" />
              </button>
            ))}

            <button
              onClick={() => scrollToSection("contact")}
              className="ml-2 px-5 py-2.5 bg-[#d4af37] text-black text-[11px] tracking-[0.18em] font-medium hover:bg-[#f4e5b8] transition-all duration-300"
            >
              {t("Nav.waitlist")}
            </button>
          </div>

          <button
            className="md:hidden text-[#d4af37]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-[#d4af37]/15">
            <div className="flex flex-col items-center gap-6 py-10 text-[12px] tracking-[0.22em] uppercase">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-white/70 hover:text-[#d4af37] transition-colors"
                >
                  {t(`Nav.${item}`)}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("contact")}
                className="mt-2 px-8 py-3 bg-[#d4af37] text-black font-medium"
              >
                {t("Nav.waitlist")}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero — full-bleed marble, brand-first */}
      <section
        id="hero"
        className="relative min-h-svh flex items-end md:items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-[url('/marble.jpg')] bg-cover bg-center scale-105 will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.18}px) scale(1.05)` }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/45 to-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-10 pb-24 pt-32 md:py-0 text-center">
          <p className="landing-fade-in mb-6 text-[11px] tracking-[0.35em] uppercase text-[#d4af37]/80">
            {t("Hero.eyebrow")}
          </p>
          <h1 className="landing-fade-in landing-delay-1 text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-serif font-bold tracking-tight leading-[0.9]">
            <span className="text-gradient">{t("Hero.title")}</span>
          </h1>
          <div className="landing-fade-in landing-delay-2 mx-auto mt-8 h-px w-20 bg-linear-to-r from-transparent via-[#d4af37] to-transparent" />
          <p className="landing-fade-in landing-delay-2 mt-8 text-xl md:text-3xl font-light text-white/85 tracking-wide">
            {t("Hero.tagline")}
          </p>
          <p className="landing-fade-in landing-delay-3 mt-6 text-base md:text-lg text-white/55 max-w-2xl mx-auto leading-relaxed">
            {t("Hero.description")}
          </p>

          <div className="landing-fade-in landing-delay-4 mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection("contact")}
              className="group inline-flex items-center gap-3 px-9 py-4 bg-[#d4af37] text-black font-medium text-base hover:bg-[#f4e5b8] transition-all duration-300"
            >
              {t("Hero.joinWaitlist")}
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={() => scrollToSection("product")}
              className="px-9 py-4 border border-white/20 text-white/80 font-medium text-base hover:border-[#d4af37]/60 hover:text-[#d4af37] transition-all duration-300"
            >
              {t("Hero.seeProduct")}
            </button>
          </div>

          <button
            onClick={() => scrollToSection("about")}
            className="landing-fade-in landing-delay-5 mt-16 md:mt-20 text-[#d4af37]/40 hover:text-[#d4af37] transition-colors animate-float mx-auto block"
            aria-label="Scroll"
          >
            <ChevronDown size={32} />
          </button>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="relative py-28 md:py-36 px-6 lg:px-10"
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: "url('/marble.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-black/80 to-[#050505]" />

        <div
          className={`relative z-10 max-w-6xl mx-auto transition-all duration-1000 ${reveal("about")}`}
        >
          <div className="max-w-3xl mb-16 md:mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-semibold leading-[1.1]">
              {t("About.title")}{" "}
              <span className="text-gradient">{t("About.titleHighlight")}</span>
            </h2>
            <div className="mt-8 h-px w-16 bg-[#d4af37]" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.28em] uppercase text-[#d4af37]">
                {t("About.problem")}
              </p>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                {t("About.problemDesc")}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-[11px] tracking-[0.28em] uppercase text-[#d4af37]">
                {t("About.solution")}
              </p>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
                {t("About.solutionDesc")}
              </p>
            </div>
          </div>

          <p className="mt-16 md:mt-20 text-2xl md:text-3xl font-serif font-light text-white/80 max-w-3xl leading-snug">
            {t("About.closing")}
          </p>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative py-28 md:py-40 px-6 lg:px-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.12),transparent_55%)]" />
        <div className="absolute -right-32 top-1/4 w-96 h-96 bg-[#d4af37]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -left-32 bottom-1/4 w-80 h-80 bg-[#d4af37]/8 blur-[90px] rounded-full pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div
          className={`relative z-10 max-w-6xl mx-auto transition-all duration-1000 ${reveal("features")}`}
        >
          <div className="mb-16 md:mb-24 max-w-3xl">
            <p className="mb-5 text-[11px] tracking-[0.35em] uppercase text-[#d4af37]/80">
              {t("Features.eyebrow")}
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold leading-[1.05]">
              {t("Features.title")}{" "}
              <span className="text-gradient">{t("Features.titleHighlight")}</span>
            </h2>
            <p className="mt-6 text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl">
              {t("Features.subtitle")}
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            {[
              {
                title: t("Features.sourceBackedTitle"),
                desc: t("Features.sourceBackedDesc"),
                tags: t("Features.sourceBackedTags"),
                icon: "/icons/scale2.png",
                num: "01",
                pipeline: ["Query", "Embed", "Retrieve", "Ground", "Stream"],
              },
              {
                title: t("Features.documentTitle"),
                desc: t("Features.documentDesc"),
                tags: t("Features.documentTags"),
                icon: "/icons/doc2.png",
                num: "02",
                pipeline: ["Upload", "Parse", "Summarize", "Index", "Attach"],
              },
              {
                title: t("Features.jurisdictionTitle"),
                desc: t("Features.jurisdictionDesc"),
                tags: t("Features.jurisdictionTags"),
                icon: "/icons/globe2.png",
                num: "03",
                pipeline: ["Scope", "Filter", "Rank", "Generate"],
              },
            ].map((feature, i) => (
              <article
                key={feature.num}
                className="group relative overflow-hidden border border-[#d4af37]/15 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:border-[#d4af37]/45 hover:bg-black/60"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-[#d4af37]/80 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-linear-to-r from-[#d4af37]/0 to-transparent group-hover:from-[#d4af37]/5 transition-all duration-700 pointer-events-none" />

                <div className="relative grid lg:grid-cols-[7rem_1fr] gap-6 lg:gap-10 p-7 md:p-10">
                  <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-6">
                    <span className="font-serif text-4xl md:text-5xl text-[#d4af37]/35 group-hover:text-[#d4af37]/70 transition-colors tabular-nums">
                      {feature.num}
                    </span>
                    <div className="w-12 h-12 md:w-14 md:h-14 opacity-80 group-hover:opacity-100 transition-opacity">
                      <img
                        src={feature.icon}
                        alt=""
                        className="object-contain w-full h-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-6 min-w-0">
                    <div className="space-y-3">
                      <h3 className="text-2xl md:text-4xl font-serif text-white group-hover:text-[#f4e5b8] transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-[15px] md:text-base text-white/55 leading-relaxed max-w-3xl">
                        {feature.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#d4af37]/70">
                      {feature.pipeline.map((step, si) => (
                        <span key={step} className="inline-flex items-center gap-2">
                          <span className="px-2.5 py-1 border border-[#d4af37]/25 bg-[#d4af37]/5 text-[#d4af37]/90 group-hover:border-[#d4af37]/50 transition-colors">
                            {step}
                          </span>
                          {si < feature.pipeline.length - 1 && (
                            <span className="text-[#d4af37]/35" aria-hidden>
                              →
                            </span>
                          )}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] md:text-xs tracking-wide text-white/35 font-mono">
                      {feature.tags}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Product demos */}
      <section
        id="product"
        className="relative py-28 md:py-36 px-6 lg:px-10"
      >
        <div className="absolute inset-0 bg-linear-to-b from-[#050505] via-[#0a0704] to-[#050505]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70vw] h-[40vw] max-w-4xl bg-[#d4af37]/5 blur-[120px] rounded-full pointer-events-none" />

        <div
          className={`relative z-10 max-w-6xl mx-auto space-y-28 transition-all duration-1000 ${reveal("product")}`}
        >
          <div className="text-center space-y-5 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif font-semibold">
              {t("Product.title")}{" "}
              <span className="text-gradient">{t("Product.titleHighlight")}</span>
            </h2>
            <p className="text-lg text-white/50">{t("Product.subtitle")}</p>
          </div>

          {[
            {
              title: t("Product.chatTitle"),
              desc: t("Product.chatDesc"),
              src: "/timeline-chat.mp4",
              reverse: false,
            },
            {
              title: t("Product.caseTitle"),
              desc: t("Product.caseDesc"),
              src: "/timeline-case.mp4",
              reverse: true,
            },
          ].map((demo) => (
            <div
              key={demo.src}
              className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div
                className={`space-y-5 text-center lg:text-left ${
                  demo.reverse ? "lg:order-2" : ""
                }`}
              >
                <h3 className="text-3xl md:text-4xl font-serif text-[#d4af37]">
                  {demo.title}
                </h3>
                <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-md mx-auto lg:mx-0">
                  {demo.desc}
                </p>
              </div>

              <div className={`relative ${demo.reverse ? "lg:order-1" : ""}`}>
                <div className="absolute -inset-px bg-linear-to-br from-[#d4af37]/35 via-[#d4af37]/10 to-transparent opacity-70 pointer-events-none" />
                <div className="relative overflow-hidden bg-black border border-[#d4af37]/20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-white/5">
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                  </div>
                  <video
                    className="w-full h-auto block bg-black"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                  >
                    <source src={demo.src} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="contact"
        className="relative py-28 md:py-40 px-6 lg:px-10"
      >
        <div className="absolute inset-0 bg-linear-to-t from-[#d4af37]/8 via-[#050505] to-[#050505]" />

        <div
          className={`relative z-10 max-w-4xl mx-auto text-center transition-all duration-1000 ${
            visibleSections.has("contact")
              ? "opacity-100 scale-100"
              : "opacity-0 scale-[0.98]"
          }`}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight">
            {t("Contact.title")}{" "}
            <span className="text-gradient">{t("Contact.titleHighlight")}</span>
          </h2>
          <div className="mx-auto mt-8 h-px w-16 bg-[#d4af37]" />
          <p className="mt-8 text-lg md:text-xl text-white/55 max-w-xl mx-auto leading-relaxed">
            {t("Contact.description")}
          </p>

          {waitlistStatus === "success" ? (
            <p className="mt-14 text-lg text-[#d4af37] font-light">
              {t("Contact.success")}
            </p>
          ) : (
            <form
              onSubmit={handleWaitlist}
              className="mt-14 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (waitlistStatus === "error") setWaitlistStatus("idle")
                }}
                placeholder={t("Contact.emailPlaceholder")}
                className="flex-1 px-6 py-4 bg-white/5 border border-[#d4af37]/30 text-white placeholder:text-white/35 focus:outline-none focus:border-[#d4af37] transition-colors"
                autoComplete="email"
                required
              />
              <button
                type="submit"
                disabled={waitlistStatus === "loading"}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#d4af37] text-black font-medium hover:bg-[#f4e5b8] transition-all duration-300 disabled:opacity-60 whitespace-nowrap"
              >
                {waitlistStatus === "loading"
                  ? t("Contact.submitting")
                  : t("Contact.submit")}
                {waitlistStatus !== "loading" && (
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>
          )}

          {waitlistStatus === "error" && (
            <p className="mt-4 text-sm text-red-400">{t("Contact.invalidEmail")}</p>
          )}
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/40">
          <p className="font-serif text-[#d4af37]/80 tracking-wide">
            {t("Hero.title")}
          </p>
          <p>{t("Footer.copyright")}</p>
          <div className="flex gap-8">
            <button
              onClick={() => handleRoute("/")}
              className="hover:text-[#d4af37] transition-colors"
            >
              {t("Footer.privacy")}
            </button>
            <button
              onClick={() => handleRoute("/")}
              className="hover:text-[#d4af37] transition-colors"
            >
              {t("Footer.terms")}
            </button>
            <button
              onClick={() => handleRoute("/")}
              className="hover:text-[#d4af37] transition-colors"
            >
              {t("Footer.contact")}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
