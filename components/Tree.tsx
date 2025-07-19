import type { Tree as TreeType } from '@/schema'
import { useStore } from '@/store'
import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { produce } from 'immer'
import { cloneDeep, get, isEmpty, unset } from 'lodash-es'
import type React from 'react'
import { useState } from 'react'

type props = { tree: Record<string, unknown>; path: string[] }
export const Tree: React.FC<props> = ({ tree, path }) => {
  const trees = useStore((state) => state.trees)
  const setTrees = useStore((state) => state.setTrees)
  const [activePath, setActivePath] = useState([] as string[])
  const [activeName, setActiveName] = useState('')

  return (
    <Group w={'100%'} gap={0} align="flex-start" justify="center">
      <Modal
        title={`Path: ${activePath.join(' → ').slice(3)}`}
        opened={activePath.length > 0}
        onClose={() => {
          setActivePath([])
          setActiveName('')
        }}
      >
        <Stack>
          <Group>
            <TextInput
              onChange={(e) => setActiveName(e.target.value)}
              value={activeName}
            />
            <Button
              onClick={() => {
                const newTrees = produce(trees, (draft) => {
                  const tree = get(draft, path) as TreeType | undefined
                  if (!tree) return
                  tree[activeName] = cloneDeep(get(trees, activePath))
                  unset(draft, activePath)
                })
                setTrees(newTrees)
              }}
            >
              Update
            </Button>
          </Group>
          <Group>
            <Button
              h={42}
              color="green"
              onClick={() => {
                const newTrees = produce(trees, (draft) => {
                  const tree = get(draft, activePath) as TreeType | undefined
                  if (!tree) return
                  tree[`${path.length}.${Object.keys(tree).length}`] = {}
                })
                setTrees(newTrees)
              }}
            >
              Add Child +
            </Button>
            <Button
              h={42}
              color="green"
              onClick={() => {
                const newTrees = produce(trees, (draft) => {
                  const tree = get(draft, path) as TreeType | undefined
                  if (!tree) return
                  tree[`${path.length - 1}.${Object.keys(tree).length}`] = {}
                })
                setTrees(newTrees)
              }}
            >
              Add Sibling +
            </Button>
            <Button
              h={42}
              color="red"
              onClick={() => {
                const newTrees = produce(trees, (draft) => {
                  unset(draft, activePath)
                })
                setTrees(newTrees.filter((tree) => !isEmpty(tree)))
              }}
            >
              Delete Node
            </Button>
          </Group>
        </Stack>
      </Modal>

      {Object.entries(tree).map(([key, value], i) => {
        return (
          <Stack
            key={key}
            gap={0}
            style={{
              padding: '5px 10px',
            }}
          >
            <Group w="100%" justify="center" mb={10}>
              <UnstyledButton
                onClick={() => {
                  setActivePath([...path, key])
                  setActiveName(Object.keys(get(trees, path))[i])
                }}
              >
                <Text
                  style={{
                    backgroundColor: '#f7f7f7',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    display: 'inline-block',
                  }}
                >
                  {key}
                </Text>
              </UnstyledButton>
            </Group>

            <Tree
              tree={value as Record<string, unknown>}
              path={[...path, key]}
            />
          </Stack>
        )
      })}
    </Group>
  )
}
