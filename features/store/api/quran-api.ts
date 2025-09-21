// ini filenya features/store/api/quran-api.ts

export interface Ayat {
  nomorAyat: number
  teksArab: string
  teksLatin: string
  teksIndonesia: string
  audio?: {
    url: string
    duration?: number
  }
}

export interface Surah {
  nomor: number
  nama: string
  namaLatin: string
  jumlahAyat: number
  tempatTurun: string
  arti: string
  deskripsi: string
  audioFull: string
}

export interface Juz {
  nomor: number
  start: number
  end: number
  surahRange: string
}

export const juzData: Juz[] = [
  { nomor: 1, start: 1, end: 2, surahRange: "Al-Fatihah 1 - Al-Baqarah 141" },
  { nomor: 2, start: 2, end: 2, surahRange: "Al-Baqarah 142 - Al-Baqarah 252" },
  { nomor: 3, start: 2, end: 3, surahRange: "Al-Baqarah 253 - Ali Imran 92" },
  { nomor: 4, start: 3, end: 4, surahRange: "Ali Imran 93 - An-Nisa 23" },
  { nomor: 5, start: 4, end: 4, surahRange: "An-Nisa 24 - An-Nisa 147" },
  { nomor: 6, start: 4, end: 5, surahRange: "An-Nisa 148 - Al-Ma'idah 81" },
  { nomor: 7, start: 5, end: 6, surahRange: "Al-Ma'idah 82 - Al-An'am 110" },
  { nomor: 8, start: 6, end: 7, surahRange: "Al-An'am 111 - Al-A'raf 87" },
  { nomor: 9, start: 7, end: 8, surahRange: "Al-A'raf 88 - Al-Anfal 40" },
  { nomor: 10, start: 8, end: 9, surahRange: "Al-Anfal 41 - At-Taubah 92" },
  { nomor: 11, start: 9, end: 11, surahRange: "At-Taubah 93 - Hud 5" },
  { nomor: 12, start: 11, end: 12, surahRange: "Hud 6 - Yusuf 52" },
  { nomor: 13, start: 12, end: 14, surahRange: "Yusuf 53 - Ibrahim 52" },
  { nomor: 14, start: 15, end: 16, surahRange: "Al-Hijr 1 - An-Nahl 128" },
  { nomor: 15, start: 17, end: 18, surahRange: "Al-Isra 1 - Al-Kahf 74" },
  { nomor: 16, start: 18, end: 20, surahRange: "Al-Kahf 75 - Ta Ha 135" },
  { nomor: 17, start: 21, end: 22, surahRange: "Al-Anbiya 1 - Al-Hajj 78" },
  { nomor: 18, start: 23, end: 25, surahRange: "Al-Mu'minun 1 - Al-Furqan 20" },
  { nomor: 19, start: 25, end: 27, surahRange: "Al-Furqan 21 - An-Naml 55" },
  { nomor: 20, start: 27, end: 29, surahRange: "An-Naml 56 - Al-Ankabut 45" },
  { nomor: 21, start: 29, end: 33, surahRange: "Al-Ankabut 46 - Al-Ahzab 30" },
  { nomor: 22, start: 33, end: 36, surahRange: "Al-Ahzab 31 - Ya Sin 27" },
  { nomor: 23, start: 36, end: 39, surahRange: "Ya Sin 28 - Az-Zumar 31" },
  { nomor: 24, start: 39, end: 41, surahRange: "Az-Zumar 32 - Fussilat 46" },
  { nomor: 25, start: 41, end: 45, surahRange: "Fussilat 47 - Al-Jasiyah 37" },
  { nomor: 26, start: 46, end: 51, surahRange: "Al-Ahqaf 1 - Adh-Dhariyat 30" },
  { nomor: 27, start: 51, end: 57, surahRange: "Adh-Dhariyat 31 - Al-Hadid 29" },
  { nomor: 28, start: 58, end: 66, surahRange: "Al-Mujadila 1 - At-Tahrim 12" },
  { nomor: 29, start: 67, end: 77, surahRange: "Al-Mulk 1 - Al-Mursalat 50" },
  { nomor: 30, start: 78, end: 114, surahRange: "An-Naba 1 - An-Nas 6" }
]

// API Functions
export async function getAllSurahs(): Promise<Surah[]> {
  try {
    const res = await fetch('https://equran.id/api/v2/surat', {
      next: { revalidate: 3600 }
    })
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    
    return data.data || data
  } catch (error) {
    console.error('Error fetching all surahs:', error)
    throw error
  }
}

export async function getSurah(id: number): Promise<{ surah: Surah; ayat: Ayat[] }> {
  try {
    const res = await fetch(`https://equran.id/api/v2/surat/${id}`)
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    console.log('API Response:', data)
    
    const surahData = data.data || data
    const ayatData = surahData.ayat || []
    
    const ayatWithAudio = ayatData.map((ayat: any) => {
      console.log('Ayat audio data:', ayat.audio)
      
      let audioUrl = null
      
      if (ayat.audio) {
        if (typeof ayat.audio === 'string') {
          audioUrl = ayat.audio
        }
        else if (ayat.audio['05']) {
          audioUrl = ayat.audio['05']
        }
        else if (ayat.audio.url) {
          audioUrl = ayat.audio.url
        }
        else if (typeof ayat.audio === 'object') {
          const firstKey = Object.keys(ayat.audio)[0]
          audioUrl = ayat.audio[firstKey]
        }
      }
      
      if (!audioUrl) {
        audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${id}/${ayat.nomorAyat}.mp3`
      }
      
      return {
        nomorAyat: ayat.nomorAyat,
        teksArab: ayat.teksArab,
        teksLatin: ayat.teksLatin,
        teksIndonesia: ayat.teksIndonesia,
        audio: {
          url: audioUrl
        }
      }
    })
    
    return {
      surah: surahData,
      ayat: ayatWithAudio
    }
  } catch (error) {
    console.error('Error fetching surah:', error)
    throw new Error('Gagal memuat data surah')
  }
}

// Utility Functions
export function getSurahByJuz(juzNumber: number, allSurahs: Surah[]): Surah[] {
  const juz = juzData.find(j => j.nomor === juzNumber)
  if (!juz) return allSurahs
  
  return allSurahs.filter(surah => 
    surah.nomor >= juz.start && surah.nomor <= juz.end
  )
}

export function getJuzFromSurah(surahNumber: number): number[] {
  return juzData
    .filter(juz => surahNumber >= juz.start && surahNumber <= juz.end)
    .map(juz => juz.nomor)
}