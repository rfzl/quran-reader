// ini filenya components/surah-detail.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bookmark, ChevronLeft, ChevronRight, History, Play, Pause, Search } from "lucide-react"
import { useBookmarks } from "@/features/store/bookmarks-store"
import { useSearchParams } from "next/navigation"

const SimpleAudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
      setIsPlaying(true)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={togglePlay}
        title="Putar audio ayat"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
    </>
  )
}

interface Ayat {
  nomorAyat: number
  teksArab: string
  teksLatin: string
  teksIndonesia: string
  audio?: {
    url: string
    duration?: number
  }
}

interface Surah {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
  tempatTurun: string
  arti: string
  deskripsi: string
  audioFull: string
}

interface SurahDetailProps {
  surah: Surah | null
  ayat: Ayat[] | null
}

export default function SurahDetail({ surah, ayat }: SurahDetailProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [lastReadVerse, setLastReadVerse] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredAyat, setFilteredAyat] = useState<Ayat[]>([])
  const [jumpToVerse, setJumpToVerse] = useState<string>("")
  const searchParams = useSearchParams()
  const verseRefs = useRef<{[key: number]: HTMLDivElement | null}>({})
  const { bookmarks, addBookmark, removeBookmark, addToHistory } = useBookmarks()

  useEffect(() => {
    if (!ayat) {
      setFilteredAyat([])
      return
    }

    if (!searchQuery.trim()) {
      setFilteredAyat(ayat)
      setCurrentPage(1)
      return
    }

    const filtered = ayat.filter((verse) => {
      const query = searchQuery.toLowerCase()
      return (
        verse.nomorAyat.toString().includes(query) ||
        verse.teksArab.toLowerCase().includes(query) ||
        verse.teksLatin.toLowerCase().includes(query) ||
        verse.teksIndonesia.toLowerCase().includes(query)
      )
    })

    setFilteredAyat(filtered)
    setCurrentPage(1)
  }, [ayat, searchQuery])

  useEffect(() => {
    const verseParam = searchParams.get('verse')
    const verseNumber = verseParam ? parseInt(verseParam) : null
    
    if (verseNumber && surah) {
      setLastReadVerse(verseNumber)
      addToHistory(surah.nomor, verseNumber, surah.namaLatin)
      
      setTimeout(() => {
        if (verseRefs.current[verseNumber]) {
          verseRefs.current[verseNumber]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 100)
    }
  }, [surah, searchParams, addToHistory])

  useEffect(() => {
    if (lastReadVerse && filteredAyat.length > 0) {
      const verseIndex = filteredAyat.findIndex(verse => verse.nomorAyat === lastReadVerse)
      if (verseIndex !== -1) {
        const versePage = Math.ceil((verseIndex + 1) / 10)
        setCurrentPage(versePage)
      }
    }
  }, [lastReadVerse, filteredAyat])

  const handleJumpToVerse = (verseNumber: string) => {
    if (!verseNumber || !ayat) return
    
    const verse = parseInt(verseNumber)
    const targetVerse = ayat.find(a => a.nomorAyat === verse)
    
    if (targetVerse) {
      setJumpToVerse(verseNumber)
      markAsRead(verse)

      const url = new URL(window.location.href)
      url.searchParams.set('verse', verse.toString())
      window.history.replaceState({}, '', url.toString())
      
      setTimeout(() => {
        if (verseRefs.current[verse]) {
          verseRefs.current[verse]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 100)
    }
  }
  const markAsRead = (verseNumber: number) => {
    if (surah) {
      setLastReadVerse(verseNumber)
      addToHistory(surah.nomor, verseNumber, surah.namaLatin)
      
      const url = new URL(window.location.href)
      url.searchParams.set('verse', verseNumber.toString())
      window.history.replaceState({}, '', url.toString())
      
      setTimeout(() => {
        if (verseRefs.current[verseNumber]) {
          verseRefs.current[verseNumber]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }, 50)
    }
  }

  if (!surah || !ayat) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Memuat data surah...</p>
        </div>
      </div>
    )
  }

  const versesPerPage = 10
  const totalPages = Math.ceil(filteredAyat.length / versesPerPage)
  const currentVerses = filteredAyat.slice(
    (currentPage - 1) * versesPerPage,
    currentPage * versesPerPage
  )

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const isBookmarked = (surahNumber: number, verseNumber: number) => {
    return bookmarks.some(
      (bookmark) =>
        bookmark.surahNumber === surahNumber &&
        bookmark.verseNumber === verseNumber
    )
  }

  const toggleBookmark = (surahNumber: number, verseNumber: number, surahName: string) => {
    if (isBookmarked(surahNumber, verseNumber)) {
      removeBookmark(surahNumber, verseNumber)
    } else {
      addBookmark(surahNumber, verseNumber, surahName)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            <div>
              {surah.namaLatin} ({surah.nama})
            </div>
            <div className="text-sm font-normal text-muted-foreground">
              {surah.tempatTurun} • {surah.jumlahAyat} ayat
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{surah.arti}</p>
          <div 
            className="mt-4 text-sm prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: surah.deskripsi }}
          />
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari ayat berdasarkan nomor atau teks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div>
              <Select
                value={jumpToVerse}
                onValueChange={handleJumpToVerse}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lompat ke ayat..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {ayat?.map((verse) => (
                    <SelectItem key={verse.nomorAyat} value={verse.nomorAyat.toString()}>
                      Ayat {verse.nomorAyat} - {verse.teksIndonesia.slice(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Menampilkan {filteredAyat.length} dari {ayat?.length || 0} ayat
              {filteredAyat.length === 0 && " - Tidak ada ayat yang ditemukan"}
            </p>
          )}
          
          {lastReadVerse && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center">
              <History className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Terakhir dibaca: Ayat {lastReadVerse}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => markAsRead(lastReadVerse)}
              >
                Scroll ke Ayat
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {filteredAyat.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Tidak ada ayat yang ditemukan</h3>
          <p className="text-muted-foreground">
            Coba ubah kata kunci pencarian atau hapus filter
          </p>
          <Button
            variant="outline"
            onClick={() => setSearchQuery("")}
            className="mt-4"
          >
            Hapus Filter
          </Button>
        </div>
      )}

      {filteredAyat.length > 0 && (
        <div className="space-y-4">
          {currentVerses.map((ayat) => (
          <Card 
            key={ayat.nomorAyat} 
            ref={(el) => {
              verseRefs.current[ayat.nomorAyat] = el
            }}
            className={lastReadVerse === ayat.nomorAyat ? "border-2 border-blue-500 shadow-md" : ""}
            id={`ayat-${ayat.nomorAyat}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="verse-number font-bold text-lg">
                    {ayat.nomorAyat}
                  </span>
                  {lastReadVerse === ayat.nomorAyat && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Terakhir dibaca
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {ayat.audio?.url && (
                    <SimpleAudioPlayer audioUrl={ayat.audio.url} />
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => markAsRead(ayat.nomorAyat)}
                    title="Tandai sebagai dibaca"
                    className={lastReadVerse === ayat.nomorAyat ? "text-blue-600" : ""}
                  >
                    <History className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleBookmark(surah.nomor, ayat.nomorAyat, surah.namaLatin)}
                  >
                    <Bookmark
                      className={`h-4 w-4 ${
                        isBookmarked(surah.nomor, ayat.nomorAyat)
                          ? "fill-primary text-primary"
                          : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <div 
                className="arabic-text mb-4 text-right text-2xl font-arabic cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                onClick={() => markAsRead(ayat.nomorAyat)}
              >
                {ayat.teksArab}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {ayat.teksLatin}
              </div>
              <div 
                className="text-foreground cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded"
                onClick={() => markAsRead(ayat.nomorAyat)}
              >
                {ayat.teksIndonesia}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {filteredAyat.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Sebelumnya
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}