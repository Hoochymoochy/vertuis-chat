"use client";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation"




export default function Home() {
    const locale = useLocale();
    const router = useRouter()

    const handleRoute = (path: string) => {
      router.push(`/${locale}${path}`)
    }

    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/marble.jpg')] bg-cover bg-center">
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
  
        {/* Content */}
        <div className="relative z-10 max-w-7xl w-full px-6 py-12">
          
          {/* Top Section - Welcome + Veritus Brand */}
          <div className="flex flex-col items-center text-center mb-16">
            
            {/* Welcome */}
            <div className="mb-8">
              <p className="text-gold/60 uppercase tracking-[0.3em] text-sm font-light mb-3">
                Welcome Back
              </p>
            </div>
  
            {/* Veritus Brand - Center */}
            <div className="mb-4">
              <h1 className="text-7xl md:text-8xl font-bold text-gold tracking-tight mb-4">
                Veritus
              </h1>
              <p className="text-xl md:text-2xl uppercase tracking-[0.4em] text-gold/70 font-light mb-6">
                AI You Can Swear By
              </p>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-6" />
              <p className="text-gray-300 text-base max-w-xl mx-auto leading-relaxed">
                Source-verified legal intelligence, grounded in real law.
              </p>
            </div>
  
          </div>
  
          {/* Feature Cards - Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
  
            {/* Legal Chat */}
            <button className="group cursor-pointer relative bg-gradient-to-br from-black/80 to-black/60 p-8 rounded-2xl border border-gold/30 hover:border-gold hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handleRoute("/chat")}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all duration-300" />
              <div className="relative">
                <h3 className="text-2xl font-semibold text-gold mb-3">
                  Jurisdiction-Based Legal Chat
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Ask legal questions with answers grounded in verified statutes and cases.
                </p>
                <div className="flex items-center text-gold text-sm font-medium opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <span>Enter Legal Chat</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </button>
  
            {/* Case Summary */}
            <button className="group cursor-pointer relative bg-gradient-to-br from-black/80 to-black/60 p-8 rounded-2xl border border-gold/30 hover:border-gold hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handleRoute('/case')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-all duration-300" />
              <div className="relative">
                <h3 className="text-2xl font-semibold text-gold mb-3">
                  Document & Case Summary
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Upload documents, build cases, and generate clear, source-aware summaries.
                </p>
                <div className="flex items-center text-gold text-sm font-medium opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <span>View Cases</span>
                  <span className="ml-2">→</span>
                </div>
              </div>
            </button>
  
          </div>
  
          {/* Coming Soon - Full Width */}
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-linear-to-br from-black/50 to-black/30 p-8 rounded-2xl border border-gold/10">
              <div className="absolute top-4 right-4 px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
                <span className="text-xs text-gold/60 uppercase tracking-wider">Coming Soon</span>
              </div>
              <div className="max-w-2xl">
                <h3 className="text-2xl font-semibold text-gold/60 mb-3">
                  Advanced Legal Insights
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Cross-jurisdiction comparison, amendment tracking, and deeper analysis.
                </p>
              </div>
            </div>
          </div>
  
          {/* Footer */}
          <div className="text-center mt-16">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mb-4" />
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Built for Precision · Designed for Trust
            </p>
          </div>
  
        </div>
      </div>
    );
  }
