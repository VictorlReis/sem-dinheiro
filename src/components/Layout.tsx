import React, { type ReactNode } from 'react'
import { Header } from './Header'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './ModeToggle'
import { sessionData } from '@/lib/localSession'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return !sessionData?.user ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl text-center">Sem Dinheiro</h1>
      <div className="mt-4">
        <Button onClick={() => void signIn()}>Login</Button>
      </div>
      <div className="mt-4">
        <ModeToggle />
      </div>
    </div>
  ) : (
    <>
      <Header />
      <hr className="border-gray-700" />
      <main>{children}</main>
    </>
  )
}

export default Layout
