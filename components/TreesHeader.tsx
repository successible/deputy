import { useStore } from '@/store'
import { Button, Group, Stack, TextInput } from '@mantine/core'

export const TreesHeader = () => {
  const trees = useStore((state) => state.trees)
  const setTrees = useStore((state) => state.setTrees)
  return (
    <Stack>
      <Group h="100%" gap={10} mt={10} wrap="nowrap">
        <Button
          style={{ fontSize: 14 }}
          size="xs"
          h={42}
          onClick={() => {
            setTrees([...(trees || []), { [`${trees.length}.0`]: {} }])
          }}
        >
          New +
        </Button>
        <TextInput placeholder="Search Trees" size="md" flex={1} w="100%" />
      </Group>
    </Stack>
  )
}
