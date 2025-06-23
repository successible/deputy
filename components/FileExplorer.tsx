import type { File, Files } from '@/schema'
import { useStore } from '@/store'
import { Box, Stack, UnstyledButton } from '@mantine/core'
import { cloneDeep, get, merge } from 'lodash-es'
import type React from 'react'
import { FaFolder } from 'react-icons/fa'
import { FileRow } from './FileRow'

type props = {
  entry: File | Record<string, File> | Files
  level: number
  ancestors: string[]
}
export const FileExplorer: React.FC<props> = ({ entry, level, ancestors }) => {
  const files = useStore((state) => state.files)
  const setFiles = useStore((state) => state.setFiles)

  const sortedEntry = Object.fromEntries(
    Object.entries(entry).toSorted(([keyA], [keyB]) => keyA.localeCompare(keyB))
  )
  if (sortedEntry.path) {
    const file = sortedEntry as File
    return <FileRow file={file} />
  }

  if (level > 1 && sortedEntry.__visible !== true) return

  return Object.entries(sortedEntry).map(([path, file]) => {
    const ancestorsOfLevel = [...ancestors, path]
    const folder = !path.startsWith('file:') && !path.startsWith('__')
    return (
      <Stack gap={0} key={path} ml={level * 6 - 6} display={'block'}>
        {folder && (
          <UnstyledButton
            mt={2}
            mb={2}
            fw={400}
            style={{ lineHeight: '0px' }}
            data-id="folder"
            onClick={() => {
              const newFiles = cloneDeep(files)
              const parent = get(newFiles, ancestorsOfLevel)
              merge(parent, { __visible: !parent.__visible })
              setFiles(newFiles)
            }}
          >
            <Box
              display={'inline-block'}
              style={{ position: 'relative', top: 2 }}
              mr={5}
            >
              <FaFolder color="#333" />
            </Box>
            {path}
          </UnstyledButton>
        )}
        <FileExplorer
          entry={file}
          level={level + 1}
          ancestors={ancestorsOfLevel}
        />
      </Stack>
    )
  })
}
