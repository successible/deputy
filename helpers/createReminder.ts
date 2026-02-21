import { DateTime } from 'luxon'
import { nanoid } from 'nanoid'
import type { Reminder } from '@/schema'

export const createReminder = (
  title: string,
  description: string
): Reminder => {
  return {
    id: nanoid(),
    color: 'blue',
    created: DateTime.now().toISO(),
    description,
    streak: 0,
    title,
  }
}
