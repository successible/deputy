import { mantineHtmlProps } from '@mantine/core'
import { Head, Html, Main, NextScript } from 'next/document'
import { isProduction } from '@/helpers/isProduction'

export default function Document() {
  return (
    <Html lang="en" {...mantineHtmlProps}>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta
          name="description"
          content="Change your behaviour with reminders"
        />
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Without this check, when proxying on local development, the PWA will try to register itself and throw an error */}
        {isProduction() && <script src="/register-service-worker.js" />}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
