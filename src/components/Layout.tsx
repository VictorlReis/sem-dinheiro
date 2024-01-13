import React, { type ReactNode } from 'react'
import { Header } from './Header'
import { ThemeProvider } from './theme-provider'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <main>{children}</main>
      </ThemeProvider>
    </>
  )
}
