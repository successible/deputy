import { getFileName } from '@/helpers/getFileName'
import type { File } from '@/schema'
import { Box, UnstyledButton } from '@mantine/core'
import type React from 'react'
import { FaRegFile } from 'react-icons/fa'

type props = { file: File }
export const FileRow: React.FC<props> = ({ file }) => {
  return (
    <UnstyledButton
      data-id="file"
      key={file.path}
      mt={2}
      mb={2}
      display={'block'}
    >
      <Box
        display={'inline-block'}
        style={{ position: 'relative', top: 3 }}
        mr={5}
      >
        <FaRegFile />
      </Box>
      {getFileName(file.path)}
    </UnstyledButton>
  )
}
