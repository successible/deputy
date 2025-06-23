import type { Files } from '@/schema'
import { Octokit } from '@octokit/rest'
import { get, set } from 'lodash-es'

export const getFilesInRepo = async (token: string, repositoryUrl: string) => {
  const branch = 'main'
  const octokit = new Octokit({ auth: token })

  const repositoryMeta = repositoryUrl.split('https://github.com/')
  const [owner, repo] = repositoryMeta[1].split('/')

  // Step 1: Get latest commit SHA on the branch
  const { data: refData } = await octokit.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    headers: {
      // Disable cache
      'If-None-Match': '',
    },
  })
  const commitSha = refData.object.sha

  // Step 2: Get the tree recursively
  const { data: treeData } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: commitSha,
    recursive: '1',
    headers: {
      // Disable cache
      'If-None-Match': '',
    },
  })

  const files: Files = {}

  treeData.tree
    .filter((f) => f.type === 'blob')
    // Because of the filter, guaranteed to always be a root file
    .map((f) => {
      const stems = f.path.split('/')
      // root files get added to the file manifest directly
      if (stems.length === 1) {
        files[`file:${f.path}`] = f
      } else {
        // Build the entire file system from the path
        // Example: /foo/bar/baz and /foo/ban would need the file manifest to look like
        // {"foo": {"ban": {}, "bar": {"baz": {}}}}
        stems.map((_stem, i) => {
          const entry = get(files, stems.slice(0, i + 1))
          const lastEntry = i === stems.length - 1
          if (!entry && !lastEntry) {
            set(files, stems.slice(0, i + 1), {})
          }
        })
      }
      // Finally, add the new file
      set(files, [...stems.slice(0, -1), `file:${stems.slice(-1)[0]}`], f)
    })

  return { files }
}
