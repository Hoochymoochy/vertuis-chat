export function CaseCardSkeleton() {
    return (
      <div className="relative flex h-full min-h-50 flex-col border border-white/10 bg-black/80 p-5 backdrop-blur-md overflow-hidden group">
        {/* Animated gradient shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] ease-in-out animate-[shimmer_3s_ease-in-out_infinite]" />
        
        {/* Header skeleton */}
        <div className="mb-3 flex items-start justify-between gap-3 relative z-10">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded w-3/4 animate-[pulse_1.5s_ease-in-out_infinite]" />
            <div className="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded w-1/2 animate-[pulse_1.5s_ease-in-out_infinite]" 
                 style={{ animationDelay: '0.2s' }} />
          </div>
          <div className="h-6 w-16 bg-gradient-to-r from-white/10 to-white/5 rounded shrink-0 animate-[pulse_1.5s_ease-in-out_infinite]" 
               style={{ animationDelay: '0.4s' }} />
        </div>
  
        {/* Description skeleton */}
        <div className="mb-4 flex-1 space-y-2 relative z-10">
          <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-full animate-[pulse_1.5s_ease-in-out_infinite]" 
               style={{ animationDelay: '0.6s' }} />
          <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-5/6 animate-[pulse_1.5s_ease-in-out_infinite]" 
               style={{ animationDelay: '0.8s' }} />
          <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-4/6 animate-[pulse_1.5s_ease-in-out_infinite]" 
               style={{ animationDelay: '1s' }} />
        </div>
  
        {/* Footer skeleton */}
        <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-32 animate-[pulse_1.5s_ease-in-out_infinite] relative z-10" 
             style={{ animationDelay: '1.2s' }} />
        
        {/* Subtle border glow animation */}
        <div className="absolute inset-0 border border-[#d4af37]/0 animate-[borderGlow_3s_ease-in-out_infinite] rounded pointer-events-none" />
      </div>
    )
  }
  
  export function CaseListSkeleton({ count = 8 }: { count?: number }) {
    return (
      <>
        <style jsx global>{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          @keyframes borderGlow {
            0%, 100% {
              border-color: rgba(212, 175, 55, 0);
            }
            50% {
              border-color: rgba(212, 175, 55, 0.1);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: count }).map((_, i) => (
            <div 
              key={i}
              className="animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <CaseCardSkeleton />
            </div>
          ))}
        </div>
      </>
    )
  }