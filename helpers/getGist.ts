import { Octokit } from '@octokit/rest'
import { getGistFileName } from './getGistFileName'
import { getGistMetadata } from './getGistMetadata'

interface GetGist {
  token: string
}

export const getGist = async ({ token }: GetGist) => {
  const octokit = new Octokit({ auth: token })
  const filename = getGistFileName()

  const gistMetadata = await getGistMetadata({ token })
  if (!gistMetadata) return null

  // Fetch full gist data to get file content
  const { data: fullGist } = await octokit.request('GET /gists/{gist_id}', {
    gist_id: gistMetadata.id,
    headers: {
      // Disable cache
      'If-None-Match': '',
    },
  })

  const file = fullGist.files?.[filename]

  return {
    id: fullGist.id,
    description: fullGist.description,
    content: file?.content,
    filename,
  }
}
