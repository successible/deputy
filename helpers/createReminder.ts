import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import type { Reminder } from '@/schema'

export const createReminder = (
  title: string,
  description: string
): Reminder => {
  return {
    id: nanoid(),
    created: DateTime.now().toISO(),
    title,
    description,
    checks: 0,
    color: 'blue',
  }
}
