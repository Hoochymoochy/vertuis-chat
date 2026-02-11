// ChatSkeleton.tsx
export function ChatItemSkeleton() {
    return (
      <div className="relative p-3 border border-transparent overflow-hidden group">
        {/* Animated gradient shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Chat title skeleton */}
            <div className="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded w-3/4 animate-[pulse_1.5s_ease-in-out_infinite]" />
            {/* Optional subtitle/preview skeleton */}
            <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-1/2 animate-[pulse_1.5s_ease-in-out_infinite]" 
                 style={{ animationDelay: '0.2s' }} />
          </div>
          
          {/* Icon skeleton */}
          <div className="h-4 w-4 bg-gradient-to-r from-white/10 to-white/5 rounded shrink-0 ml-2 animate-[pulse_1.5s_ease-in-out_infinite]" 
               style={{ animationDelay: '0.4s' }} />
        </div>
        
        {/* Subtle border glow animation */}
        <div className="absolute inset-0 border border-[#d4af37]/0 animate-[borderGlow_3s_ease-in-out_infinite] pointer-events-none" />
      </div>
    );
  }
  
  export function ChatListSkeleton({ count = 5 }: { count?: number }) {
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
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        
        <div className="space-y-1">
          {Array.from({ length: count }).map((_, i) => (
            <div 
              key={i}
              className="animate-[fadeInUp_0.6s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <ChatItemSkeleton />
            </div>
          ))}
        </div>
      </>
    );
  }