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
export type FilterFiles = 'Text' | 'Image' | 'Video' | 'Audio' | 'Document' | 'Data' | 'Other'
export type FilterReminders = MantineColor | 'Complete' | 'Incomplete'
export const SORT_Reminders = ['title', 'created', 'streak', 'color'] as const
export type SortReminders = (typeof SORT_Reminders)[number]
export const SORT_Files = ["title", "type"] as const
export type SortFiles = (typeof SORT_Reminders)[number]
export const imageExtensions = ["png", "svg", "jpg", "jpeg", "gif", 'webp', 'avif']
export const textExtensions = ["txt", "md", "rtf"]
export const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
export const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
export const documentExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];
export const dataExtensions = ["json", "xml", "csv", "yaml", "yml", "sql"];

interface Store {
  files: Files
  filterFiles: FilterFiles[]
  filterReminders: FilterReminders[]
  hasHydrated: boolean
  mode: Mode
  reminders: Reminders
  repositoryUrl: string
  searchFiles: string
  searchReminders: string
  setFiles: (files: Files) => void
  setFilesFilter: (filter: FilterFiles[]) => void
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
      filterFiles: [],
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
