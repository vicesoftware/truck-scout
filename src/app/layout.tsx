'use client'

import '@/styles/globals.css'
import { Layout } from '@/components/layout/Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Layout>{children}</Layout>
        </QueryClientProvider>
      </body>
    </html>
  )
}
