import { Octokit } from '@octokit/rest'
import { getGistFileName } from './getGistFileName'

interface GetGist {
  token: string
}

export const getGistMetadata = async ({ token }: GetGist) => {
  const octokit = new Octokit({ auth: token })
  const filename = getGistFileName()

  // Use octokit.request to add a cache-busting query parameter
  const { data: gists } = await octokit.request('GET /gists', {
    headers: {
      // Disable cache
      'If-None-Match': '',
    },
  })

  // Try to find a gist with the same filename
  const gistMetadata = gists.find(
    (gist) => gist.files && Object.hasOwn(gist.files, filename)
  )

  return gistMetadata
}
