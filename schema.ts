import type { MantineColor } from '@mantine/core'

export type File = {
  path: string
  mode: string
  type: string
  sha: string
  size?: number
  url?: string
}

export type Reminder = {
  id: string // nanoid
  created: string
  title: string
  description: string
  checks: number
  color: MantineColor
}

export type Reminders = Record<string, Reminder>
export type Files = Record<string, File | Record<string, File>>
export type Tree = Record<string, unknown>
export type Trees = Tree[]
