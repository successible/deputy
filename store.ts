import type { MantineColor } from '@mantine/core'
import { del, get, set } from 'idb-keyval'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'
import type { Files, Reminders } from './schema'

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

export type Mode = 'reminders' | 'files'
type FilterReminders = MantineColor | 'Complete' | 'Incomplete'
export const SORT_Reminders = ['title', 'created', 'streak', 'color'] as const
export type SortReminders = (typeof SORT_Reminders)[number]
export const SORT_Files = ["title", "type"] as const
export type SortFiles = (typeof SORT_Reminders)[number]
export const allowedColors = [
    '#2e2e2e',
    '#868e96',
    '#fa5252',
    '#e64980',
    '#be4bdb',
    '#7950f2',
    '#4c6ef5',
    '#228be6',
  ];


interface Store {
  files: Files
  filterFiles: string
  filterReminders: FilterReminders[]
  hasHydrated: boolean
  mode: Mode
  reminders: Reminders
  repositoryUrl: string
  searchFiles: string
  searchReminders: string
  setFiles: (files: Files) => void
  setFilesFilter: (filter: string) => void
  setFilterReminders: (filter: FilterReminders[]) => void
  setHasHydrated: (state: boolean) => void
  setMode: (mode: Mode) => void
  setReminders: (reminders: Reminders) => void
  setRepositoryUrl: (token: string) => void
  setSearchFiles: (searchFiles: string) => void
  setSearchReminders: (searchReminders: string) => void
  setSortFiles: (sortFiles: SortFiles) => void
  setSortReminders: (sortReminders: SortReminders) => void
  setSaveModal: (status: boolean) => void
  setToken: (token: string) => void
  sortFiles: string
  sortReminders: SortReminders
  saveModal: boolean
  token: string
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
      filterReminders: [],
      setFilterReminders: (filterReminders) => {
        set(() => ({
          filterReminders,
        }))
      },
      sortFiles: '' as SortFiles,
      setSortFiles: (sortFiles) => {
        set(() => ({
          sortFiles,
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
      searchReminders: '',
      setSearchReminders: (searchReminders) => {
        set(() => ({
          searchReminders,
        }))
      },
      filterFiles: '',
      setFilesFilter: (filterFiles) => {
        set(() => ({
          filterFiles,
        }))
      },
      saveModal: false,
      setSaveModal: (saveModal) => {
        set(() => ({
          saveModal,
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
