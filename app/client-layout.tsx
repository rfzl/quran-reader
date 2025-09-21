// ini filenya app/client-layout.tsx
"use client"

import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import SidebarToggle from "@/components/sidebar-toggle"
import { useBookmarks } from "@/features/store/bookmarks-store"
import { useState } from "react"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { bookmarks } = useBookmarks()
  const safeBookmarks = bookmarks || []
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen">
        <div className="hidden lg:block w-80 border-r bg-background">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">Quran Reader</h1>
            <p className="text-sm text-muted-foreground">
              Baca Al-Quran online dengan terjemahan
            </p>
          </div>
          <Sidebar 
            isOpen={true} 
            onClose={() => {}} 
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-4 h-14 flex items-center justify-between">
              <div className="lg:hidden">
                <h1 className="text-xl font-bold">Quran Reader</h1>
              </div>
              <div className="lg:hidden">
                <SidebarToggle 
                  onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                  bookmarkCount={safeBookmarks.length}
                />
              </div>
              
              <div className="hidden lg:flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {safeBookmarks.length} ayat favorit
                </span>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">{children}</main>
        </div>

        <div className="lg:hidden">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
        </div>
      </div>
    </ThemeProvider>
  )
}