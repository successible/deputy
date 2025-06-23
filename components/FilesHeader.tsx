import { useStore } from '@/store'
import { Button, Group, Stack, TextInput } from '@mantine/core'

export const FilesHeader = () => {
  const filterFiles = useStore((state) => state.filterFiles)
  const setFilesFilter = useStore((state) => state.setFilesFilter)
  const searchFiles = useStore((state) => state.searchFiles)
  const setSearchFiles = useStore((state) => state.setSearchFiles)

  return (
    <Stack>
      <Group h="100%" gap={10} mt={10} wrap="nowrap">
        <Button
          style={{ fontSize: 14 }}
          size="xs"
          h={42}
          onClick={() => {
            // New File
          }}
        >
          New +
        </Button>

        <TextInput
          placeholder="Search Content"
          size="md"
          flex={1}
          w="100%"
          value={searchFiles}
          onChange={(e) => setSearchFiles(e.target.value)}
        />
      </Group>
      <Group>
        <TextInput
          placeholder="Filter by Name"
          size="md"
          flex={1}
          w="100%"
          value={filterFiles}
          onChange={(e) => setFilesFilter(e.target.value)}
        />
      </Group>
    </Stack>
  )
}
