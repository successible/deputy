import { Button, Group, Select, Title } from '@mantine/core'
import { type Mode, useStore } from '@/store'

export const UniversalHeader = () => {
  const setSyncModal = useStore((state) => state.setSyncModal)
  const mode = useStore((state) => state.mode)
  const setMode = useStore((state) => state.setMode)

  return (
    <Group h="100%" gap={0} mt={20} wrap="nowrap">
      <img width={40} alt="Smiling shield" src="/logo.svg" />
      <Title ml={10} order={4} mr={15}>
        Deputy
      </Title>
      <Button
        color="gray"
        size="xs"
        style={{ fontSize: 14 }}
        h={42}
        mr={5}
        onClick={() => {
          setSyncModal(true)
        }}
      >
        Sync
      </Button>
      <Select
        ml={10}
        styles={{ input: { height: 42 } }}
        onChange={(e) => {
          setMode(e as Mode)
        }}
        w={120}
        value={mode}
        placeholder="Mode"
        data={[
          { value: 'reminders', label: 'Reminders' },
          { value: 'files', label: 'Files' },
          { value: 'trees', label: 'Trees' },
        ]}
      />
    </Group>
  )
}
