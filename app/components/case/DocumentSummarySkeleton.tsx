export function DocumentSummarySkeleton() {
    return (
        <div className="prose prose-invert max-w-none overflow-hidden relative">
            {/* Animated gradient shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
            
            <div className="space-y-4 relative z-10">
                {/* Title skeleton */}
                <div className="h-6 bg-gradient-to-r from-white/10 to-white/5 rounded w-3/4 animate-pulse" />
                
                {/* Paragraph skeletons */}
                <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-full animate-pulse" 
                         style={{ animationDelay: '0.1s' }} />
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-11/12 animate-pulse" 
                         style={{ animationDelay: '0.2s' }} />
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-10/12 animate-pulse" 
                         style={{ animationDelay: '0.3s' }} />
                </div>
                
                <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-full animate-pulse" 
                         style={{ animationDelay: '0.4s' }} />
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-9/12 animate-pulse" 
                         style={{ animationDelay: '0.5s' }} />
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-full animate-pulse" 
                         style={{ animationDelay: '0.6s' }} />
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-8/12 animate-pulse" 
                         style={{ animationDelay: '0.7s' }} />
                </div>
                
                {/* List skeleton */}
                <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse" />
                        <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-10/12 animate-pulse" 
                             style={{ animationDelay: '0.8s' }} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse" />
                        <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-11/12 animate-pulse" 
                             style={{ animationDelay: '0.9s' }} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-pulse" />
                        <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-9/12 animate-pulse" 
                             style={{ animationDelay: '1s' }} />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-full animate-pulse" 
                         style={{ animationDelay: '1.1s' }} />
                    <div className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded w-10/12 animate-pulse" 
                         style={{ animationDelay: '1.2s' }} />
                </div>
            </div>
        </div>
    )
}

export function DocumentIframeSkeleton() {
    return (
        <div className="bg-black/30 overflow-hidden relative" style={{ height: '600px' }}>
            {/* Animated gradient shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d4af37]/5 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]" />
            
            <div className="w-full h-full flex flex-col gap-4 p-8 relative z-10">
                {/* Document header skeleton */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded w-48 animate-pulse" />
                    <div className="h-4 bg-gradient-to-r from-white/10 to-white/5 rounded w-32 animate-pulse" 
                         style={{ animationDelay: '0.2s' }} />
                </div>
                
                {/* Document content lines */}
                <div className="flex-1 space-y-3">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div 
                            key={i}
                            className="h-3 bg-gradient-to-r from-white/10 to-white/5 rounded animate-pulse" 
                            style={{ 
                                width: `${Math.random() * 30 + 70}%`,
                                animationDelay: `${i * 0.1}s` 
                            }} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

