import {
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  useMantineTheme,
} from '@mantine/core'
import { capitalize } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { createBadge } from '@/helpers/createBadge'
import { SORT_BADGES, type SortBadges, useStore } from '@/store'

export const BadgesHeader = () => {
  const theme = useMantineTheme()
  const badges = useStore((state) => state.badges)
  const setBadges = useStore((state) => state.setBadges)
  const filterBadges = useStore((state) => state.filterBadges)
  const setFilterBadges = useStore((state) => state.setFilterBadges)
  const sortBadges = useStore((state) => state.sortBadges)
  const setSortBadges = useStore((state) => state.setSortBadges)
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
            const newBadge = createBadge('New Task', 'This is a description')
            setBadges({ ...badges, [newBadge.id]: newBadge })
          }}
        >
          New +
        </Button>

        <Select
          size="md"
          width={'100%'}
          flex={1}
          clearable={true}
          value={sortBadges}
          placeholder="Sort by"
          onChange={(e) => setSortBadges((e || '') as SortBadges)}
          data={SORT_BADGES.toSorted().flatMap((s) => [
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
          value={filterBadges || []}
          placeholder="Filter by"
          onClick={() => {
            setDropdownOpened(true)
          }}
          onChange={(e) => {
            setDropdownOpened(false)
            setFilterBadges(e || [])
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
