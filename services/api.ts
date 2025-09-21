export const BASE_URL = 'https://equran.id/api/v2'

export async function fetchSurahList() {
  const res = await fetch(`${BASE_URL}/surat`)
  if (!res.ok) throw new Error('Failed to fetch surah')
  return res.json()
}

export async function fetchSurahDetail(id: string) {
  const res = await fetch(`${BASE_URL}/surat/${id}`)
  if (!res.ok) throw new Error('Failed to fetch surah detail')
  return res.json()
}