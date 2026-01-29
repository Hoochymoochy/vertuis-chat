
type VeritusButtonProps = {
  text: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
}

export default function VeritusButton({
  text,
  variant = 'secondary',
  onClick,
  className = ''
}: VeritusButtonProps) {
  const base =
    'w-full py-4 font-medium transition-all duration-300 hover:scale-105'

  const styles = {
    primary:
      'bg-[#d4af37] text-black hover:bg-[#f4e5b8] hover:shadow-2xl hover:shadow-[#d4af37]/50',
    secondary:
      'border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37]/10'
  }

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {text}
    </button>
  )
}
