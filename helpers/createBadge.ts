import type { Badge } from '@/schema'
import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'

export const createBadge = (title: string, description: string): Badge => {
  return {
    id: nanoid(),
    created: DateTime.now().toISO(),
    title,
    description,
    checks: 0,
    color: 'blue',
  }
}
