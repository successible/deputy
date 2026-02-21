import {
  Button,
  Group,
  MultiSelect,
  Select,
  Stack,
  TextInput,
} from '@mantine/core'
import { capitalize } from 'lodash-es'
import { useState } from 'react'
import { type FilterFiles, SORT_Files, type SortFiles, useStore } from '@/store'

export const FilesHeader = () => {
  const filterFiles = useStore((state) => state.filterFiles)
  const setFilesFilter = useStore((state) => state.setFilesFilter)
  const searchFiles = useStore((state) => state.searchFiles)
  const setSearchFiles = useStore((state) => state.setSearchFiles)
  const sortFiles = useStore((state) => state.sortFiles)
  const setSortFiles = useStore((state) => state.setSortFiles)
  const [dropdownOpened, setDropdownOpened] = useState(false)

  return (
    <Stack>
      <Group h="100%" gap={10} mt={10} wrap="nowrap">
        <Button
          style={{ fontSize: 14 }}
          size="xs"
          h={42}
          onClick={() => {
            // TODO: New File
          }}
        >
          New +
        </Button>

        {/* TODO */}
        <TextInput
          placeholder="🔍 Search: Files"
          size="md"
          flex={1}
          w="100%"
          value={searchFiles}
          onChange={(e) => setSearchFiles(e.target.value)}
        />
      </Group>

      <Group>
        {/* TODO */}
        <Select
          size="md"
          width={'100%'}
          flex={1}
          clearable={true}
          value={sortFiles}
          placeholder="↕️ Sort: Files"
          onChange={(e) => setSortFiles((e || '') as SortFiles)}
          data={SORT_Files.toSorted().flatMap((s) => [
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
          value={filterFiles || []}
          placeholder="🗂️ Filter: Files"
          onClick={() => {
            setDropdownOpened(true)
          }}
          onChange={(e) => {
            setDropdownOpened(false)
            setFilesFilter((e || []) as FilterFiles[])
          }}
          maxDropdownHeight={200}
          clearable={true}
          data={[
            {
              group: 'Extension',
              items: [
                { label: 'Audio', value: 'Audio' },
                { label: 'Data', value: 'Data' },
                { label: 'Document', value: 'Document' },
                { label: 'Image', value: 'Image' },
                { label: 'Other', value: 'Other' },
                { label: 'Text', value: 'Text' },
                { label: 'Video', value: 'Video' },
              ],
            },
          ]}
        />
      </Group>
    </Stack>
  )
}
