import { Box, Button, Group } from '@mantine/core'
import { useStore } from '@/store'

export const UniversalHeader = () => {
  const setSaveModal = useStore((state) => state.setSaveModal)
  const mode = useStore((state) => state.mode)

  const setMode = useStore((state) => state.setMode)

  return (
    <Group h="100%" gap={0} mt={20} wrap="nowrap">
      <Box ml={10} mr={20}>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={`https://github.com/successible/deputy/commit/${process.env.NEXT_PUBLIC_VERSION}`}
        >
          <img width={40} alt="Deputy" src="/logo.svg" />
        </a>
      </Box>

      <Button.Group pr={20}>
        <Button
          color="teal"
          onClick={() => {
            setSaveModal(true)
          }}
        >
          Save
        </Button>
      </Button.Group>

      <Button.Group>
        <Button
          variant={mode === 'reminders' ? undefined : 'default'}
          onClick={() => setMode('reminders')}
        >
          Reminders
        </Button>
        <Button
          variant={mode === 'files' ? undefined : 'default'}
          onClick={() => setMode('files')}
        >
          Files
        </Button>
      </Button.Group>
    </Group>
  )
}
