'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#3b82f6',
        },
        layout: {
          socialButtonsVariant: 'iconButton',
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
