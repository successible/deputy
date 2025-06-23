import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { AppProps } from 'next/app'

const theme = createTheme({
  /** Put your mantine theme override here */
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <Component {...pageProps} />
    </MantineProvider>
  )
}
