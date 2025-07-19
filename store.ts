import type { MantineColor } from '@mantine/core'
import { del, get, set } from 'idb-keyval'
import { create } from 'zustand'
import {
  type StateStorage,
  createJSONStorage,
  persist,
} from 'zustand/middleware'
import type { Badges, Files, Trees } from './schema'

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name)
  },
}

export type Mode = 'badges' | 'files' | 'trees'
type FilterBadges = MantineColor | 'Complete' | 'Incomplete'
export const SORT_BADGES = ['title', 'created', 'checks', 'color'] as const
export type SortBadges = (typeof SORT_BADGES)[number]

interface Store {
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  mode: Mode
  setMode: (mode: Mode) => void
  badges: Badges
  setBadges: (badges: Badges) => void
  files: Files
  setFiles: (files: Files) => void
  trees: Trees
  setTrees: (trees: Trees) => void
  filterFiles: string
  setFilesFilter: (filter: string) => void
  filterBadges: FilterBadges[]
  setFilterBadges: (filter: FilterBadges[]) => void
  sortBadges: SortBadges
  setSortBadges: (sortBadges: SortBadges) => void
  searchFiles: string
  setSearchFiles: (searchFiles: string) => void
  syncModal: boolean
  setSyncModal: (status: boolean) => void
  token: string
  setToken: (token: string) => void
  repositoryUrl: string
  setRepositoryUrl: (token: string) => void
}

// Zustand store
export const useStore = create<Store>()(
  persist(
    (set) => ({
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      mode: 'badges',
      setMode: (mode) => {
        set(() => ({
          mode,
        }))
      },
      badges: {},
      setBadges: (badges) => {
        set(() => ({
          badges,
        }))
      },
      files: {},
      setFiles: (files) => {
        set(() => ({
          files,
        }))
      },
      trees: [],
      setTrees: (trees) => {
        set(() => ({
          trees,
        }))
      },
      filterBadges: [],
      setFilterBadges: (filterBadges) => {
        set(() => ({
          filterBadges,
        }))
      },
      sortBadges: '' as SortBadges,
      setSortBadges: (sortBadges) => {
        set(() => ({
          sortBadges,
        }))
      },
      searchFiles: '',
      setSearchFiles: (searchFiles) => {
        set(() => ({
          searchFiles,
        }))
      },
      filterFiles: '',
      setFilesFilter: (filterFiles) => {
        set(() => ({
          filterFiles,
        }))
      },
      syncModal: false,
      setSyncModal: (syncModal) => {
        set(() => ({
          syncModal,
        }))
      },
      token: '',
      setToken: (token) => {
        set(() => ({
          token,
        }))
      },
      repositoryUrl: '',
      setRepositoryUrl: (repositoryUrl) => {
        set(() => ({
          repositoryUrl,
        }))
      },
    }),
    {
      name: 'store',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
