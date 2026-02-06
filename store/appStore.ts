import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

interface AppState {
  selectedCategory: string
  isEditMode: boolean
  setSelectedCategory: (id: string) => void
  toggleEditMode: () => void
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      selectedCategory: 'favorites',
      isEditMode: false,
      setSelectedCategory: (id) => set({ selectedCategory: id }),
      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
    }),
    {
      name: 'dev-caddy-app-state',
      storage: createJSONStorage(() => localStorage),
      // Only persist selectedCategory, not isEditMode (reset to View Mode on reload for safety)
      partialize: (state) => ({ selectedCategory: state.selectedCategory })
    }
  )
)