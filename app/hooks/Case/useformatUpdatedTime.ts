import { useEffect, Dispatch, SetStateAction } from "react"
import { Case } from "@/app/components/case/type"

export function formatUpdatedTime(dateString: string) {
    const updated = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - updated.getTime()
  
    const minutes = Math.floor(diffMs / (1000 * 60))
    if (minutes < 1) return "just now"
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`
  
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`
  
    const years = Math.floor(months / 12)
    return `${years} year${years !== 1 ? "s" : ""} ago`
}

export function useformatUpdatedTime(
  cases: Case[], 
  setVisibleItems: Dispatch<SetStateAction<number[]>>
) {
    // Sort cases: newest → oldest
    const sortedCases = [...cases].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime()
    )
    
    // Staggered fade-in animation
    useEffect(() => {
        setVisibleItems([]) // Reset on cases change
        sortedCases.forEach((_, index) => {
            setTimeout(() => {
                setVisibleItems(prev => [...prev, index])
            }, index * 50) // 50ms delay between each card
        })
    }, [cases.length, setVisibleItems])

    return sortedCases
}