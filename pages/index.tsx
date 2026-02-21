import { Box, Divider, Stack, useMantineTheme } from '@mantine/core'
import { isEmpty } from 'lodash-es'
import { useEffect } from 'react'
import { FileExplorer } from '@/components/FileExplorer'
import { FileRow } from '@/components/FileRow'
import { FilesHeader } from '@/components/FilesHeader'
import { ReminderRow } from '@/components/ReminderRow'
import { RemindersHeader } from '@/components/RemindersHeader'
import { SaveModal } from '@/components/SaveModel'
import { UniversalHeader } from '@/components/UniversalHeader'
import { flattenFiles } from '@/helpers/flattenFiles'
import { getFileName } from '@/helpers/getFileName'
import { getFilesInRepo } from '@/helpers/getFilesInRepo'
import { getGist } from '@/helpers/getGist'
import { type SortReminders, useStore } from '@/store'

const Index = () => {
  const theme = useMantineTheme()
  const colors = Object.keys(theme.colors)
  const hasHydrated = useStore((state) => state.hasHydrated)
  const reminders = useStore((state) => state.reminders)
  const setReminders = useStore((state) => state.setReminders)
  const files = useStore((state) => state.files)
  const setFiles = useStore((state) => state.setFiles)
  const filterReminders = useStore((state) => state.filterReminders)
  const sortReminders = useStore((state) => state.sortReminders)
  const searchReminders = useStore((state) => state.searchReminders)
  const filterFiles = useStore((state) => state.filterFiles)
  const searchFiles = useStore((state) => state.searchFiles)
  const token = useStore((state) => state.token)
  const repositoryUrl = useStore((state) => state.repositoryUrl)
  const saveModal = useStore((state) => state.saveModal)
  const mode = useStore((state) => state.mode)

  useEffect(() => {
    if (token && !saveModal) {
      getGist({ token }).then((data) => {
        const gistContent = JSON.parse(data?.content || '{}')
        if (!isEmpty(gistContent)) {
          setReminders(gistContent.reminders)
        }
      })
    }
    if (repositoryUrl && !saveModal) {
      getFilesInRepo(token, repositoryUrl).then(({ files }) => {
        setFiles(files)
      })
    }
  }, [token, repositoryUrl, saveModal])

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
        {mode === 'reminders' && <RemindersHeader />}
        {mode === 'files' && <FilesHeader />}
        <SaveModal />
      </Stack>
      {<Divider mt={20} />}

      {mode === 'reminders' && (
        <Stack mt={20}>
          {Object.keys(reminders || [])
            .filter((id) => {
              const reminder = reminders[id]
              const text =
                `${reminder.title} | ${reminder.description}`.toLowerCase()
              if (searchReminders.length === 0) return true
              return text.includes(searchReminders.toLowerCase())
            })
            .filter((id) => {
              const reminder = reminders[id]
              if (filterReminders.length === 0) return true
              let completeMatch: boolean | null = null
              let incompleteMatch: boolean | null = null
              let colorMatch: boolean | null = null
              filterReminders.forEach((f) => {
                if (f === 'Complete') {
                  completeMatch = false
                  if (reminder.streak >= 14) {
                    completeMatch = true
                  }
                }
                if (f === 'Incomplete') {
                  incompleteMatch = false
                  if (reminder.streak < 14) {
                    incompleteMatch = true
                  }
                }
                if (colors.includes(f)) {
                  colorMatch = false
                  if (f === reminder.color) {
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
              if (!sortReminders) return 0
              const direction = sortReminders.split('_')[0] as 'asc' | 'desc'
              const value = sortReminders.split('_')[1] as SortReminders
              const reminderA = reminders[a]
              const reminderB = reminders[b]
              if (direction === 'asc' && value === 'title') {
                return reminderA.title.localeCompare(reminderB.title)
              }
              if (direction === 'desc' && value === 'title') {
                return reminderB.title.localeCompare(reminderA.title)
              }
              if (direction === 'asc' && value === 'created') {
                return reminderA.created.localeCompare(reminderB.created)
              }
              if (direction === 'desc' && value === 'created') {
                return reminderB.created.localeCompare(reminderA.created)
              }
              if (direction === 'asc' && value === 'color') {
                return reminderA.color.localeCompare(reminderB.color)
              }
              if (direction === 'desc' && value === 'color') {
                return reminderB.color.localeCompare(reminderA.color)
              }
              if (direction === 'asc' && value === 'streak') {
                return reminderA.streak - reminderB.streak
              }
              if (direction === 'desc' && value === 'streak') {
                return reminderB.streak - reminderA.streak
              }
              return 0
            })
            .map((id) => {
              const reminder = reminders[id]
              return <ReminderRow key={id} reminder={reminder} />
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
