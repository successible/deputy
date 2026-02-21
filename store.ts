import type { MantineColor } from '@mantine/core'
import { del, get, set } from 'idb-keyval'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'
import type { Files, Reminders, Trees } from './schema'

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

export type Mode = 'reminders' | 'files' | 'trees'
type FilterReminders = MantineColor | 'Complete' | 'Incomplete'
export const SORT_Reminders = ['title', 'created', 'checks', 'color'] as const
export type SortReminders = (typeof SORT_Reminders)[number]

interface Store {
  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  mode: Mode
  setMode: (mode: Mode) => void
  reminders: Reminders
  setReminders: (reminders: Reminders) => void
  files: Files
  setFiles: (files: Files) => void
  trees: Trees
  setTrees: (trees: Trees) => void
  filterFiles: string
  setFilesFilter: (filter: string) => void
  filterReminders: FilterReminders[]
  setFilterReminders: (filter: FilterReminders[]) => void
  sortReminders: SortReminders
  setSortReminders: (sortReminders: SortReminders) => void
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
      mode: 'reminders',
      setMode: (mode) => {
        set(() => ({
          mode,
        }))
      },
      reminders: {},
      setReminders: (reminders) => {
        set(() => ({
          reminders,
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
      filterReminders: [],
      setFilterReminders: (filterReminders) => {
        set(() => ({
          filterReminders,
        }))
      },
      sortReminders: '' as SortReminders,
      setSortReminders: (sortReminders) => {
        set(() => ({
          sortReminders,
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
