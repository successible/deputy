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
import type { Badge } from '@/schema'
import { useStore } from '@/store'

type props = { badge: Badge }
export const BadgeRow: React.FC<props> = ({ badge }) => {
  const theme = useMantineTheme()
  const badges = useStore((state) => state.badges)
  const setBadges = useStore((state) => state.setBadges)

  return (
    <Stack w="100%">
      <Group w="100%">
        <Stack w="100%">
          <Group w="100%" gap={10}>
            <TextInput
              size="md"
              fw={700}
              w={'100%'}
              value={badge.title}
              onChange={(e) => {
                setBadges(
                  produce(badges, (draft) => {
                    draft[badge.id].title = e.target.value
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
            value={badge.description}
            onChange={(e) => {
              setBadges(
                produce(badges, (draft) => {
                  draft[badge.id].description = e.target.value
                })
              )
            }}
          />
          <Group w={'100%'}>
            <Select
              size="md"
              flex={1}
              value={badge.color}
              onChange={(e) => {
                setBadges(
                  produce(badges, (draft) => {
                    draft[badge.id].color = e || 'blue'
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
              value={badge.checks}
              w={70}
              onChange={(e) => {
                setBadges(
                  produce(badges, (draft) => {
                    draft[badge.id].checks = Number(e)
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
                setBadges(
                  produce(badges, (draft) => {
                    delete draft[badge.id]
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
        color={badge.color || 'blue'}
        value={(badge.checks / 14) * 100}
      />
    </Stack>
  )
}
