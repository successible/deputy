import { Divider, Stack } from '@mantine/core'
import { useStore } from '@/store'
import { Tree } from './Tree'

export const TreeExplorer = () => {
  const trees = useStore((state) => state.trees)
  return (
    <Stack>
      {(trees || []).map((tree, i) => (
        <Stack gap={0} key={`${i}${JSON.stringify(tree)}`}>
          <Tree tree={tree} path={[String(i)]} />
          <Divider mt={20} />
        </Stack>
      ))}
    </Stack>
  )
}
