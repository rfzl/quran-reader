// ini filenya lib/fuzzy-search.ts
import Fuse from 'fuse.js'

export interface SearchableSurah {
  nomor: number
  namaLatin: string
  nama: string
  arti: string
  tempatTurun: string
}

export function fuzzySearchSurahs(query: string, surahs: SearchableSurah[]): SearchableSurah[] {
  const fuse = new Fuse(surahs, {
    keys: ['namaLatin', 'nama', 'arti', 'tempatTurun'],
    threshold: 0.3,
    includeScore: true,
  })
  
  return fuse.search(query).map(result => result.item)
}