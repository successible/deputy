import { Alert, Button, Modal, PasswordInput, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { createOrUpdateGist } from '@/helpers/createOrUpdateGist'
import { useStore } from '@/store'

export const SaveModal = () => {
  const reminders = useStore((state) => state.reminders)
  const saveModal = useStore((state) => state.saveModal)
  const setSaveModal = useStore((state) => state.setSaveModal)
  const token = useStore((state) => state.token)
  const setToken = useStore((state) => state.setToken)
  const repositoryUrl = useStore((state) => state.repositoryUrl)
  const setRepositoryUrl = useStore((state) => state.setRepositoryUrl)
  return (
    <Modal title="Save" opened={saveModal} onClose={() => setSaveModal(false)}>
      <Alert mb={15} variant="light" color="blue" title="What does Save mean?">
        Any change you make to the local data of Deputy will be saved to the
        cloud in your account on GitHub.com
      </Alert>
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack>
          <PasswordInput
            size="md"
            label="GitHub Token"
            description="Read/write access to Gists and your Deputy repository"
            value={token}
            onChange={(e) => setToken(e.target.value || '')}
          />
          <PasswordInput
            size="md"
            label="Repository URL"
            description="The URL of your Deputy repository."
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value || '')}
            placeholder="https://github.com/owner/repo"
          />
          <Button
            onClick={async () => {
              if (Object.keys(reminders).length > 0) {
                if (!token) {
                  return notifications.show({
                    title: 'Error',
                    message: 'You must provide a token!',
                  })
                }
                await createOrUpdateGist({
                  token,
                  content: JSON.stringify({
                    reminders: reminders,
                  }),
                })
                setSaveModal(false)
              } else {
                setSaveModal(false)
              }
            }}
          >
            Save
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
