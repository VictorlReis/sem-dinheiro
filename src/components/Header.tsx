import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Button } from './ui/Button'
export const Header = () => {
  const { data: sessionData } = useSession()

  return (
    <header className="flex flex-row gap-2 justify-between p-2">
      <section className='flex flex-row gap-2 font-bold '>
        {sessionData?.user ? (
          <Avatar onClick={() => void signOut()}>
            <AvatarImage className="w-12" src={sessionData?.user?.image ?? ''} alt={sessionData?.user?.name ?? ''} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <Button
            variant="default"
            onClick={() => void signIn()}
          >
            Login
          </Button>
        )}
        {sessionData?.user?.name
          ? `Sem dinheiro, ${sessionData.user.name}?`
          : ''}
      </section>
      <section className='flex flex-row gap-2'>
        <Button variant="secondary" asChild>
          <Link
            href="/"
          >
            Mensal
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link
            href="/dashboard"
          >
            Anual
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link
            href="/investments"
          >
            Investimentos
          </Link>
        </Button>
        <ModeToggle />
      </section>
    </header>
  )
}
