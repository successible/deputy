import { createOrUpdateGist } from '@/helpers/createOrUpdateGist'
import { useStore } from '@/store'
import { Button, Modal, PasswordInput, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'

export const SyncModal = () => {
  const badges = useStore((state) => state.badges)
  const syncModal = useStore((state) => state.syncModal)
  const setSyncModal = useStore((state) => state.setSyncModal)
  const token = useStore((state) => state.token)
  const setToken = useStore((state) => state.setToken)
  const repositoryUrl = useStore((state) => state.repositoryUrl)
  const setRepositoryUrl = useStore((state) => state.setRepositoryUrl)
  return (
    <Modal title="Sync" opened={syncModal} onClose={() => setSyncModal(false)}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack>
          <PasswordInput
            size="md"
            label="GitHub Token"
            description="Read/write access to Gists and your Badges repository"
            value={token}
            onChange={(e) => setToken(e.target.value || '')}
          />
          <PasswordInput
            size="md"
            label="Repository URL"
            description="The URL of your Badges repository."
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value || '')}
            placeholder="https://github.com/owner/repo"
          />
          <Button
            onClick={async () => {
              if (Object.keys(badges).length > 0) {
                if (!token) {
                  return notifications.show({
                    title: 'Error',
                    message: 'You must provide a token!',
                  })
                }
                await createOrUpdateGist({
                  token,
                  content: JSON.stringify({ badges: badges }),
                })
                setSyncModal(false)
              } else {
                setSyncModal(false)
              }
            }}
          >
            Sync
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
