// ini filenya npm run buildapp/surah/[id]/page.tsx
import { notFound } from 'next/navigation'
import SurahDetail from '@/components/surah-detail'
import { getSurah } from '@/features/store/api/quran-api'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface SurahPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: SurahPageProps) {
  try {
    const { id } = await params
    const surahId = parseInt(id)
    
    if (isNaN(surahId) || surahId < 1 || surahId > 114) {
      return {
        title: 'Surah Tidak Ditemukan - Quran Reader',
        description: 'Surah tidak ditemukan dalam database'
      }
    }

    const { surah } = await getSurah(surahId)

    if (!surah) {
      return {
        title: 'Surah Tidak Ditemukan - Quran Reader',
        description: 'Surah tidak ditemukan dalam database'
      }
    }

    return {
      title: `${surah.namaLatin} - Quran Reader`,
      description: `Baca surah ${surah.namaLatin} (${surah.arti}) dengan terjemahan Indonesia. ${surah.tempatTurun}, ${surah.jumlahAyat} ayat.`,
      openGraph: {
        title: `${surah.namaLatin} - Quran Reader`,
        description: `Baca surah ${surah.namaLatin} (${surah.arti}) dengan terjemahan Indonesia`,
      },
    }
  } catch (error) {
    return {
      title: 'Quran Reader',
      description: 'Baca Al-Quran online dengan terjemahan Indonesia'
    }
  }
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { id } = await params
  const surahId = parseInt(id)

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    notFound()
  }

  try {
    const { surah, ayat } = await getSurah(surahId)

    if (!surah || !ayat) {
      notFound()
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
          <SurahDetail surah={surah} ayat={ayat} />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error loading surah:', error)
    
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
            <h2 className="text-2xl font-bold text-red-500">Error Memuat Surah</h2>
            <p className="text-muted-foreground mt-2">
              Terjadi kesalahan saat memuat data surah. Silakan coba lagi nanti.
            </p>
          </div>
        </div>
      </main>
    )
  }
}