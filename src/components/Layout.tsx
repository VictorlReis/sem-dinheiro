import React, { type ReactNode } from 'react'
import { Header } from './Header'
import { signIn, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { ModeToggle } from './mode-toggle'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { data: sessionData } = useSession()

  return !sessionData?.user ? (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl text-center">
        Sem Dinheiro
      </h1>
      <div className='mt-4'>
        <Button onClick={() => void signIn()}>Login</Button>
      </div>
      <div className='mt-4'>
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

export default Layout;
