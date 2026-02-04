export function CaseSummarySkeleton() {
    return (
        <div className="mt-6 bg-black/50 border border-[#d4af37]/20 p-5 overflow-hidden relative">
            {/* Animated gradient shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
            
            <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className="w-4 h-4 bg-gradient-to-r from-[#d4af37]/30 to-[#d4af37]/10 rounded animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded w-48 animate-pulse" />
            </div>
            
            <div className="space-y-3 relative z-10">
                <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-full animate-pulse" 
                     style={{ animationDelay: '0.1s' }} />
                <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-11/12 animate-pulse" 
                     style={{ animationDelay: '0.2s' }} />
                <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-10/12 animate-pulse" 
                     style={{ animationDelay: '0.3s' }} />
                <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-9/12 animate-pulse" 
                     style={{ animationDelay: '0.4s' }} />
                <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-full animate-pulse" 
                     style={{ animationDelay: '0.5s' }} />
                <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-8/12 animate-pulse" 
                     style={{ animationDelay: '0.6s' }} />
            </div>
            
            <div className="mt-4 h-3 bg-gradient-to-r from-[#d4af37]/20 to-[#d4af37]/10 rounded w-40 animate-pulse relative z-10" 
                 style={{ animationDelay: '0.7s' }} />
        </div>
    )
}
