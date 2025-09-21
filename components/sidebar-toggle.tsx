// ini filenya components/sidebar-toggle.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Menu, Bookmark } from "lucide-react"

interface SidebarToggleProps {
  onToggle: () => void
  bookmarkCount: number
}

export default function SidebarToggle({ onToggle, bookmarkCount }: SidebarToggleProps) {
  const safeBookmarkCount = bookmarkCount || 0
  
  return (
    <Button variant="outline" size="icon" onClick={onToggle} className="relative">
      <Menu className="h-4 w-4" />
      {safeBookmarkCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {safeBookmarkCount}
        </span>
      )}
    </Button>
  )
}