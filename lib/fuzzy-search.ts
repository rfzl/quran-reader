// ini filenya lib/fuzzy-search.ts
import Fuse from 'fuse.js'
import { Surah } from '@/features/store/api/quran-api'

export function fuzzySearchSurahs(query: string, surahs: Surah[]): Surah[] {
  const fuse = new Fuse(surahs, {
    keys: ['namaLatin', 'nama', 'arti', 'tempatTurun'],
    threshold: 0.3,
    includeScore: true,
  })
  
  return fuse.search(query).map(result => result.item)
}