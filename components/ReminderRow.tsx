import {
  Box,
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
    <Stack w="100%" mb={20}>
      <Group w="100%">
        <Stack w="100%">
          <Group w="100%" gap={10}>
            <TextInput
              size="md"
              fw={700}
              flex={1}
              value={reminder.title}
              onChange={(e) => {
                setReminders(
                  produce(reminders, (draft) => {
                    draft[reminder.id].title = e.target.value
                  })
                )
              }}
            />
            <Button
              style={{ fontSize: 14 }}
              h={42}
              size="xs"
              color="red.8"
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
              renderOption={({ option }) => (
                <Group flex="1" gap="xs">
                  <Box
                    style={{
                      backgroundColor: `var(--mantine-color-${option.value}-6)`,
                      borderRadius: 5,
                    }}
                    w={15}
                    h={15}
                  />
                  {option.label}
                </Group>
              )}
              onChange={(e) => {
                setReminders(
                  produce(reminders, (draft) => {
                    draft[reminder.id].color = e || 'blue'
                  })
                )
              }}
              leftSection={
                <Box
                  style={{
                    backgroundColor: `var(--mantine-color-${reminder.color}-6)`,
                    borderRadius: 5,
                  }}
                  w={15}
                  h={15}
                />
              }
              data={Object.keys(theme.colors)
                .toSorted()
                .map((color) => ({
                  label: capitalize(color),
                  value: color,
                }))}
            />
            <NumberInput
              size="md"
              value={reminder.streak}
              flex={1}
              prefix="🔥 Streak: "
              onChange={(e) => {
                setReminders(
                  produce(reminders, (draft) => {
                    draft[reminder.id].streak = Number(e)
                  })
                )
              }}
            />
          </Group>
        </Stack>
      </Group>
      <Progress
        color={reminder.color || 'blue'}
        value={(reminder.streak / 14) * 100}
      />
    </Stack>
  )
}
