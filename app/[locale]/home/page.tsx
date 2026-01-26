"use client";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation"
import SideBar from "../component/sideBar";




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
        <SideBar/>
      </div>
    );
  }
