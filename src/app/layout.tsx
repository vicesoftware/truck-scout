import '@/styles/globals.css'
import { Layout } from '@/components/layout/Layout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
