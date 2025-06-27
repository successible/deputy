import { BadgeRow } from '@/components/BadgeRow'
import { BadgesHeader } from '@/components/BadgesHeader'
import { FileExplorer } from '@/components/FileExplorer'
import { FileRow } from '@/components/FileRow'
import { FilesHeader } from '@/components/FilesHeader'
import { SyncModal } from '@/components/SyncModal'
import { UniversalHeader } from '@/components/UniversalHeader'
import { flattenFiles } from '@/helpers/flattenFiles'
import { getFileName } from '@/helpers/getFileName'
import { getFilesInRepo } from '@/helpers/getFilesInRepo'
import { getGist } from '@/helpers/getGist'
import { type SortBadges, useStore } from '@/store'
import { Box, Divider, Stack, useMantineTheme } from '@mantine/core'
import { isEmpty } from 'lodash-es'

import { useEffect } from 'react'

const Index = () => {
  const theme = useMantineTheme()
  const colors = Object.keys(theme.colors)
  const hasHydrated = useStore((state) => state.hasHydrated)
  const badges = useStore((state) => state.badges)
  const setBadges = useStore((state) => state.setBadges)
  const files = useStore((state) => state.files)
  const setFiles = useStore((state) => state.setFiles)
  const filterBadges = useStore((state) => state.filterBadges)
  const sortBadges = useStore((state) => state.sortBadges)
  const filterFiles = useStore((state) => state.filterFiles)
  const searchFiles = useStore((state) => state.searchFiles)
  const token = useStore((state) => state.token)
  const repositoryUrl = useStore((state) => state.repositoryUrl)
  const syncModal = useStore((state) => state.syncModal)
  const mode = useStore((state) => state.mode)

  useEffect(() => {
    if (token && !syncModal) {
      getGist({ token }).then((data) => {
        const gistContent = JSON.parse(data?.content || '{}')
        if (!isEmpty(gistContent)) {
          setBadges(gistContent.badges)
        }
      })
    }
    if (repositoryUrl && !syncModal) {
      getFilesInRepo(token, repositoryUrl).then(({ files }) => {
        setFiles(files)
      })
    }
  }, [token, repositoryUrl, syncModal])

  if (!hasHydrated) return

  return (
    <Box
      component="main"
      style={{
        maxWidth: 800,
        width: '95%',
        margin: '0px auto',
        marginBottom: 50,
      }}
    >
      <Stack gap={10} component="header">
        <UniversalHeader />
        <Divider mt={10} />
        {mode === 'badges' && <BadgesHeader />}
        {mode === 'files' && <FilesHeader />}
        <SyncModal />
      </Stack>
      <Divider mt={20} />

      {mode === 'badges' && (
        <Stack mt={20}>
          {Object.keys(badges)
            .filter((id) => {
              const badge = badges[id]
              if (filterBadges.length === 0) return true
              let completeMatch: boolean | null = null
              let incompleteMatch: boolean | null = null
              let colorMatch: boolean | null = null
              filterBadges.forEach((f) => {
                if (f === 'Complete') {
                  completeMatch = false
                  if (badge.checks >= 14) {
                    completeMatch = true
                  }
                }
                if (f === 'Incomplete') {
                  incompleteMatch = false
                  if (badge.checks < 14) {
                    incompleteMatch = true
                  }
                }
                if (colors.includes(f)) {
                  colorMatch = false
                  if (f === badge.color) {
                    colorMatch = true
                  }
                }
              })
              const completionMatch = completeMatch || incompleteMatch
              if (completionMatch === null && colorMatch !== null)
                return colorMatch
              if (completionMatch !== null && colorMatch === null)
                return completionMatch
              if (completionMatch !== null && colorMatch !== null)
                return completionMatch && colorMatch
            })
            .toSorted((a, b) => {
              if (!sortBadges) return 0
              const direction = sortBadges.split('_')[0] as 'asc' | 'desc'
              const value = sortBadges.split('_')[1] as SortBadges
              const badgeA = badges[a]
              const badgeB = badges[b]
              if (direction === 'asc' && value === 'title') {
                return badgeA.title.localeCompare(badgeB.title)
              }
              if (direction === 'desc' && value === 'title') {
                return badgeB.title.localeCompare(badgeA.title)
              }
              if (direction === 'asc' && value === 'created') {
                return badgeA.created.localeCompare(badgeB.created)
              }
              if (direction === 'desc' && value === 'created') {
                return badgeB.created.localeCompare(badgeA.created)
              }
              if (direction === 'asc' && value === 'color') {
                return badgeA.color.localeCompare(badgeB.color)
              }
              if (direction === 'desc' && value === 'color') {
                return badgeB.color.localeCompare(badgeA.color)
              }
              if (direction === 'asc' && value === 'checks') {
                return badgeA.checks - badgeB.checks
              }
              if (direction === 'desc' && value === 'checks') {
                return badgeB.checks - badgeA.checks
              }
              return 0
            })
            .map((id) => {
              const badge = badges[id]
              return <BadgeRow key={id} badge={badge} />
            })}
        </Stack>
      )}

      {mode === 'files' && !searchFiles && !filterFiles && (
        <Stack mt={20} gap={0} ml={20}>
          <FileExplorer entry={files} level={1} ancestors={[]} />
        </Stack>
      )}
      {mode === 'files' && (searchFiles || filterFiles) && (
        <Stack mt={20} gap={0} ml={20}>
          {Object.entries(flattenFiles(files, {}))
            .toSorted((entryA, entryB) => {
              return getFileName(entryA[0]).localeCompare(
                getFileName(entryB[0])
              )
            })
            .filter(([key, _value]) => getFileName(key).includes(filterFiles))
            .map(([key, value]) => {
              return <FileRow key={key} file={value} />
            })}
        </Stack>
      )}
    </Box>
  )
}

export default Index
