// ini filenya components/sidebar.tsx
"use client"

import { useState } from "react"
import { useBookmarks } from "@/features/store/bookmarks-store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  X, 
  Bookmark, 
  History, 
  Clock,
  Trash2,
  Home,
  BookOpen
} from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'favorites' | 'history'>('favorites')
  const { bookmarks, readingHistory, removeBookmark, clearHistory } = useBookmarks()
  const safeBookmarks = bookmarks || []
  const safeReadingHistory = readingHistory || []

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      
      <div className="fixed top-0 right-0 h-full w-80 bg-background border-l shadow-lg z-50 flex flex-col lg:static lg:shadow-none lg:border-l-0 lg:z-auto">
        <div className="flex items-center justify-between p-4 border-b lg:hidden">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 border-b">
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
              <Home className="h-4 w-4" />
              <span>Daftar Surah</span>
            </Link>
            <div className="flex items-center gap-3 p-2 rounded-lg text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span>Terakhir Dibaca</span>
            </div>
          </div>
        </div>

        <div className="flex border-b">
          <Button
            variant={activeTab === 'favorites' ? 'secondary' : 'ghost'}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab('favorites')}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Favorit
          </Button>
          <Button
            variant={activeTab === 'history' ? 'secondary' : 'ghost'}
            className="flex-1 rounded-none"
            onClick={() => setActiveTab('history')}
          >
            <History className="h-4 w-4 mr-2" />
            Riwayat
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          {activeTab === 'favorites' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Ayat Favorit</h3>
                <span className="text-sm text-muted-foreground">
                  {safeBookmarks.length} item
                </span>
              </div>
              
              {safeBookmarks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada ayat favorit</p>
                  <p className="text-sm mt-2">Klik icon bookmark pada ayat untuk menambah favorit</p>
                </div>
              ) : (
                safeBookmarks.map((bookmark) => (
                  <div
                    key={`${bookmark.surahNumber}-${bookmark.verseNumber}-${bookmark.timestamp}`}
                    className="p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/surah/${bookmark.surahNumber}?verse=${bookmark.verseNumber}`}
                        className="flex-1"
                        onClick={onClose}
                      >
                        <h4 className="font-medium">
                          {bookmark.surahName} : {bookmark.verseNumber}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Ayat {bookmark.verseNumber}
                        </p>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeBookmark(bookmark.surahNumber, bookmark.verseNumber)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Riwayat Bacaan</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {safeReadingHistory.length} item
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    disabled={safeReadingHistory.length === 0}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {safeReadingHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Belum ada riwayat bacaan</p>
                  <p className="text-sm mt-2">Riwayat bacaan akan tersimpan otomatis</p>
                </div>
              ) : (
                safeReadingHistory.map((history) => (
                  <Link
                    key={`${history.surahNumber}-${history.timestamp}`}
                    href={`/surah/${history.surahNumber}?verse=${history.verseNumber}`}
                    className="block p-3 border rounded-lg hover:bg-accent transition-colors"
                    onClick={onClose}
                  >
                    <h4 className="font-medium">
                      {history.surahName} : {history.verseNumber}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Ayat {history.verseNumber}</span>
                      <span>
                        {new Date(history.timestamp).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  )
}