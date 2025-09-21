// ini filenya app/surah/[id]/page.tsx
"use client"

import { useState, useEffect, use } from "react"
import { useSearchParams } from "next/navigation"
import { notFound } from 'next/navigation'
import SurahDetail from '@/components/surah-detail'
import { getSurah } from '@/features/store/api/quran-api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface SurahPageProps {
  params: Promise<{ id: string }>
}

interface SurahData {
  surah: any
  ayat: any[]
}

export default function SurahPage({ params }: SurahPageProps) {
  const searchParams = useSearchParams()
  const verseParam = searchParams.get('verse')
  const [surahData, setSurahData] = useState<SurahData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Unwrap params dengan React.use()
  const unwrappedParams = use(params)
  const surahId = parseInt(unwrappedParams.id)

  useEffect(() => {
    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
      setError('Surah tidak ditemukan')
      setLoading(false)
      return
    }

    const fetchSurah = async () => {
      try {
        setLoading(true)
        const data = await getSurah(surahId)
        
        if (!data.surah || !data.ayat) {
          setError('Data surah tidak ditemukan')
          return
        }
        
        setSurahData(data)
      } catch (err) {
        setError('Gagal memuat data surah')
        console.error('Error fetching surah:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSurah()
  }, [surahId])

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound()
  }

  if (loading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Surah
            </Button>
          </Link>
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !surahData) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Surah
            </Button>
          </Link>
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-red-500">Error</h2>
            <p className="text-muted-foreground">{error || 'Terjadi kesalahan'}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Surah
          </Button>
        </Link>
        <SurahDetail surah={surahData.surah} ayat={surahData.ayat} />
      </div>
    </main>
  )
}