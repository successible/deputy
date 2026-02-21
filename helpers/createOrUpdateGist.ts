import { notifications } from '@mantine/notifications'
import { Octokit } from '@octokit/rest'
import { getGistFileName } from './getGistFileName'
import { getGistMetadata } from './getGistMetadata'

interface GistFile {
  [filename: string]: {
    content: string
  }
}

interface CreateOrUpdateGist {
  token: string
  content: string
  description?: string
  isPublic?: boolean
}

export const createOrUpdateGist = async ({
  token,
  content,
}: CreateOrUpdateGist) => {
  const octokit = new Octokit({ auth: token })
  const gistMetadata = await getGistMetadata({ token })
  const filename = getGistFileName()
  const description = 'Managed by reminders'

  const files: GistFile = {
    [filename]: { content },
  }

  if (gistMetadata) {
    // Update the existing gist
    const updated = await octokit.gists.update({
      gist_id: gistMetadata.id,
      files,
      description,
    })
    notifications.show({
      title: 'Success!',
      message: '♻️ Save complete',
    })
    return updated.data
  }

  // Create a new gist
  const created = await octokit.gists.create({
    files,
    description,
    public: false,
  })

  notifications.show({
    title: 'Success!',
    message: '✨ Save complete',
  })
  return created.data
}
