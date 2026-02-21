import {
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { capitalize } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { createReminder } from '@/helpers/createReminder'
import { SORT_Reminders, type SortReminders, useStore } from '@/store'

export const RemindersHeader = () => {
  const theme = useMantineTheme()
  const reminders = useStore((state) => state.reminders)
  const setReminders = useStore((state) => state.setReminders)
  const filterReminders = useStore((state) => state.filterReminders)
  const setFilterReminders = useStore((state) => state.setFilterReminders)
  const sortReminders = useStore((state) => state.sortReminders)
  const setSortReminders = useStore((state) => state.setSortReminders)
  const searchReminders = useStore((state) => state.searchReminders)
  const setSearchReminders = useStore((state) => state.setSearchReminders)
  const [dropdownOpened, setDropdownOpened] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        setDropdownOpened(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [ref])

  return (
    <Stack ref={ref}>
      <Group h="100%" gap={10} mt={10} wrap="nowrap">
        <Button
          style={{ fontSize: 14 }}
          size="xs"
          h={42}
          onClick={() => {
            const newReminder = createReminder(
              'New Reminder',
              'This is a description'
            )
            setReminders({ ...reminders, [newReminder.id]: newReminder })
          }}
        >
          New +
        </Button>

        {/* TODO */}
        <TextInput
          placeholder="🔍 Search: Reminders"
          size="md"
          flex={1}
          w="100%"
          value={searchReminders}
          onChange={(e) => setSearchReminders(e.target.value)}
        />
      </Group>
      <Group>
        <Select
          size="md"
          width={'100%'}
          flex={1}
          clearable={true}
          value={sortReminders}
          placeholder="↕️ Sort: Reminders"
          onChange={(e) => setSortReminders((e || '') as SortReminders)}
          data={SORT_Reminders.toSorted().flatMap((s) => [
            { label: `⬆️ ${capitalize(s)}`, value: `asc_${s}` },
            { label: `⬇️ ${capitalize(s)}`, value: `desc_${s}` },
          ])}
        />
      </Group>
      <Group>
        <MultiSelect
          w={'100%'}
          size="md"
          dropdownOpened={dropdownOpened}
          flex={1}
          value={filterReminders || []}
          placeholder="🗂️ Filter: Reminders"
          onClick={() => {
            setDropdownOpened(true)
          }}
          onChange={(e) => {
            setDropdownOpened(false)
            setFilterReminders(e || [])
          }}
          maxDropdownHeight={200}
          clearable={true}
          data={[
            {
              group: 'Status',
              items: [
                { label: 'Complete', value: 'Complete' },
                { label: 'Incomplete', value: 'Incomplete' },
              ],
            },
            {
              group: 'Colors',
              items: Object.keys(theme.colors)
                .toSorted()
                .map((color) => ({
                  label: capitalize(color),
                  value: color,
                })),
            },
          ]}
        />
      </Group>
    </Stack>
  )
}
