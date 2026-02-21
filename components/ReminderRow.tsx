import {
  Button,
  Group,
  NumberInput,
  Progress,
  Select,
  Stack,
  Textarea,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { produce } from 'immer'
import { capitalize } from 'lodash-es'
import type React from 'react'
import type { Reminder } from '@/schema'
import { useStore } from '@/store'

type props = { reminder: Reminder }
export const ReminderRow: React.FC<props> = ({ reminder }) => {
  const theme = useMantineTheme()
  const reminders = useStore((state) => state.reminders)
  const setReminders = useStore((state) => state.setReminders)

  return (
    <Stack w="100%">
      <Group w="100%">
        <Stack w="100%">
          <Group w="100%" gap={10}>
            <TextInput
              size="md"
              fw={700}
              w={'100%'}
              value={reminder.title}
              onChange={(e) => {
                setReminders(
                  produce(reminders, (draft) => {
                    draft[reminder.id].title = e.target.value
                  })
                )
              }}
            />
          </Group>
          <Textarea
            size="md"
            w={'100%'}
            minRows={2}
            autosize={true}
            value={reminder.description}
            onChange={(e) => {
              setReminders(
                produce(reminders, (draft) => {
                  draft[reminder.id].description = e.target.value
                })
              )
            }}
          />
          <Group w={'100%'}>
            <Select
              size="md"
              flex={1}
              value={reminder.color}
              onChange={(e) => {
                setReminders(
                  produce(reminders, (draft) => {
                    draft[reminder.id].color = e || 'blue'
                  })
                )
              }}
              data={Object.keys(theme.colors)
                .toSorted()
                .map((color) => ({
                  label: capitalize(color),
                  value: color,
                }))}
            />
            <NumberInput
              size="md"
              value={reminder.checks}
              w={70}
              onChange={(e) => {
                setReminders(
                  produce(reminders, (draft) => {
                    draft[reminder.id].checks = Number(e)
                  })
                )
              }}
            />
            <Button
              style={{ fontSize: 14 }}
              h={42}
              size="xs"
              color="gray"
              onClick={() => {
                setReminders(
                  produce(reminders, (draft) => {
                    delete draft[reminder.id]
                  })
                )
              }}
            >
              X
            </Button>
          </Group>
        </Stack>
      </Group>
      <Progress
        color={reminder.color || 'blue'}
        value={(reminder.checks / 14) * 100}
      />
    </Stack>
  )
}
