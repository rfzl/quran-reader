import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesStore {
  fontSize: number
  setFontSize: (size: number) => void
  lastRead: { surah: number; verse: number } | null
  setLastRead: (surah: number, verse: number) => void
  clearLastRead: () => void
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      fontSize: 16,
      setFontSize: (size) => set({ fontSize: size }),
      lastRead: null,
      setLastRead: (surah, verse) => set({ lastRead: { surah, verse } }),
      clearLastRead: () => set({ lastRead: null }),
    }),
    {
      name: 'preferences-storage',
    }
  )
)