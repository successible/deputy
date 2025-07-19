import type { MantineColor } from '@mantine/core'

export type File = {
  path: string
  mode: string
  type: string
  sha: string
  size?: number
  url?: string
}

export type Badge = {
  id: string // nanoid
  created: string
  title: string
  description: string
  checks: number
  color: MantineColor
}

export type Badges = Record<string, Badge>
export type Files = Record<string, File | Record<string, File>>
export type Tree = Record<string, unknown>
export type Trees = Tree[]
