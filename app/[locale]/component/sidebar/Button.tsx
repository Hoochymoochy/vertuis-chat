import { Plus } from "lucide-react"

type Props = {
    onClick: () => void
    isCollapsed?: boolean;
    label: string
}

export function AddButton({ onClick, isCollapsed, label }: Props) {
    return (
    <button
        onClick={onClick}
        className="bg-linear-to-r from-gold/20 to-gold/10 hover:from-gold/30 hover:to-gold/20 border border-gold/30 w-full px-4 py-3 text-white font-medium transition-all duration-200 flex items-center gap-3">
        <Plus className="w-5 h-5" />
        {!isCollapsed && <span className="font-medium">New {label}</span>}
    </button>
    )
}