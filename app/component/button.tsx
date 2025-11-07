import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
    
    const variants = {
      default: "bg-[#d4af37] text-[#1a1410] hover:bg-[#d4af37]/80",
      outline: "border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10",
      ghost: "text-[#d4af37] hover:bg-[#d4af37]/10"
    }
    
    const sizes = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-6 py-3 text-base"
    }
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"