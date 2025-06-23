import type { File, Files } from '@/schema'
import { isPlainObject } from 'lodash-es'

export const flattenFiles = (
  files: Files | File,
  flattenedFiles: Record<string, File>
) => {
  if (isPlainObject(files) && files.path) {
    const path = files.path as unknown as string
    flattenedFiles[path] = files as File
    return flattenedFiles
  }
  Object.entries(files).map(([_key, value]) => {
    flattenFiles(value, flattenedFiles)
  })

  return flattenedFiles
}
