import { Metadata } from 'next'
import SurahList from '@/components/surah-list'
import { getAllSurahs } from '@/features/store/api/quran-api'
import { ThemeToggle } from '@/components/theme-toggle'

export const metadata: Metadata = {
  title: 'Quran Reader - Baca Al-Quran Online',
  description: 'Baca Al-Quran online dengan terjemahan Indonesia',
}

export default async function Home() {
  const surahs = await getAllSurahs()

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quran Reader</h1>
          <p className="text-muted-foreground">Baca Al-Quran online dengan terjemahan Indonesia</p>
        </div>
        <ThemeToggle />
      </div>
      
      <SurahList surahs={surahs} />
    </main>
  )
}