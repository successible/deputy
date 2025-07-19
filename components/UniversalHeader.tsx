import { useStore } from '@/store'
import { Button, Group, Title } from '@mantine/core'

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
      <Button.Group ml={10}>
        <Button
          variant={mode === 'badges' ? 'filled' : 'outline'}
          onClick={() => setMode('badges')}
          h={42}
        >
          Badges
        </Button>
        <Button
          variant={mode === 'files' ? 'filled' : 'outline'}
          onClick={() => setMode('files')}
          h={42}
        >
          Files
        </Button>
        <Button
          variant={mode === 'trees' ? 'filled' : 'outline'}
          onClick={() => setMode('trees')}
          h={42}
        >
          Trees
        </Button>
      </Button.Group>
    </Group>
  )
}
