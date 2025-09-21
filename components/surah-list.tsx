// ini filenya components/surah-list.tsx
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, BookOpen } from "lucide-react"
import Link from "next/link"
import { juzData, getSurahByJuz, getJuzFromSurah, Surah as ApiSurah } from "@/features/store/api/quran-api"
import { fuzzySearchSurahs } from "@/lib/fuzzy-search"

interface SurahListProps {
  surahs: ApiSurah[]
}

export default function SurahList({ surahs }: SurahListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJuz, setSelectedJuz] = useState<number | "all">("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs
    return fuzzySearchSurahs(searchQuery, surahs)
  }, [surahs, searchQuery])

  const juzFilteredSurahs = useMemo(() => {
    if (selectedJuz === "all") return filteredSurahs
    return getSurahByJuz(selectedJuz as number, filteredSurahs)
  }, [filteredSurahs, selectedJuz])

  if (!surahs || surahs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Tidak ada data surah yang ditemukan</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari surah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter {showFilters ? "↑" : "↓"}
            </Button>

            {showFilters && (
              <div className="grid gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filter berdasarkan Juz</label>
                  <Select
                    value={selectedJuz === "all" ? "all" : selectedJuz.toString()}
                    onValueChange={(value) => 
                      setSelectedJuz(value === "all" ? "all" : parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Juz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Juz</SelectItem>
                      {juzData.map((juz) => (
                        <SelectItem key={juz.nomor} value={juz.nomor.toString()}>
                          Juz {juz.nomor} - {juz.surahRange}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedJuz !== "all" && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        Juz {selectedJuz}: {juzData.find(j => j.nomor === selectedJuz)?.surahRange}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-sm text-muted-foreground">
              Menampilkan {juzFilteredSurahs.length} dari {surahs.length} surah
              {selectedJuz !== "all" && ` (Juz ${selectedJuz})`}
              {searchQuery && ` untuk "${searchQuery}"`}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {juzFilteredSurahs.map((surah: ApiSurah) => (
          <Link key={surah.nomor} href={`/surah/${surah.nomor}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {surah.nomor}
                    </div>
                    <CardTitle className="text-lg">{surah.namaLatin}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {surah.nama}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{surah.arti}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{surah.tempatTurun}</span>
                  <span>{surah.jumlahAyat} ayat</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    Juz: {getJuzFromSurah(surah.nomor).join(", ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {juzFilteredSurahs.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Tidak ada surah yang ditemukan</h3>
          <p className="text-muted-foreground">
            Coba ubah kata kunci pencarian atau pilih juz yang berbeda
          </p>
        </div>
      )}
    </div>
  )
}