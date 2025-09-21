// ini filenya features/store/bookmarks-store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Bookmark {
  surahNumber: number
  verseNumber: number
  surahName: string
  timestamp: number
}

interface ReadingHistory {
  surahNumber: number
  verseNumber: number
  surahName: string
  timestamp: number
}

interface BookmarkStore {
  bookmarks: Bookmark[]
  readingHistory: ReadingHistory[]
  addBookmark: (surahNumber: number, verseNumber: number, surahName: string) => void
  removeBookmark: (surahNumber: number, verseNumber: number) => void
  addToHistory: (surahNumber: number, verseNumber: number, surahName: string) => void
  clearHistory: () => void
}

const defaultState = {
  bookmarks: [],
  readingHistory: []
}

export const useBookmarks = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      addBookmark: (surahNumber, verseNumber, surahName) => {
        const newBookmark = {
          surahNumber,
          verseNumber,
          surahName,
          timestamp: Date.now(),
        }
        
        set((state) => ({
          bookmarks: [...(state.bookmarks || []), newBookmark],
        }))
      },
      
      removeBookmark: (surahNumber, verseNumber) => {
        set((state) => ({
          bookmarks: (state.bookmarks || []).filter(
            (bookmark) =>
              !(bookmark.surahNumber === surahNumber && 
                bookmark.verseNumber === verseNumber)
          ),
        }))
      },
      
      addToHistory: (surahNumber, verseNumber, surahName) => {
        const newHistory = {
          surahNumber,
          verseNumber,
          surahName,
          timestamp: Date.now(),
        }
        
        set((state) => {
          const currentHistory = state.readingHistory || []
          
          const filteredHistory = currentHistory.filter(
            (history) => history.surahNumber !== surahNumber
          )
          
          const updatedHistory = [newHistory, ...filteredHistory]
          
          const limitedHistory = updatedHistory.slice(0, 10)
          
          return {
            readingHistory: limitedHistory,
          }
        })
      },
      
      clearHistory: () => {
        set({ readingHistory: [] })
      },
    }),
    {
      name: 'bookmark-storage',
      migrate: (persistedState: any, version: number) => {
        if (!persistedState) return defaultState
        
        return {
          bookmarks: Array.isArray(persistedState.bookmarks) ? persistedState.bookmarks : [],
          readingHistory: Array.isArray(persistedState.readingHistory) ? persistedState.readingHistory : [],
        }
      }
    }
  )
)