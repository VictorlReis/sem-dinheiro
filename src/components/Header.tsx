import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { ModeToggle } from './ModeToggle'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Button } from '@/components/ui/button'
import {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'
import { sessionData } from '@/lib/localSession'

export const Header = () => {
  return (
    <header className="flex flex-row gap-2 justify-between p-2">
      <section className="flex flex-row gap-2 font-bold ">
        {sessionData?.user ? (
          <Avatar onClick={() => void signOut()}>
            <AvatarImage
              className="w-12"
              src={sessionData?.user?.image ?? ''}
              alt={sessionData?.user?.name ?? ''}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <Button variant="default" onClick={() => void signIn()}>
            Login
          </Button>
        )}
        <article className="mt-3">
          {sessionData?.user?.name
            ? `Sem dinheiro, ${sessionData.user.name}?`
            : ''}
        </article>
      </section>
      <section className="flex flex-row gap-2">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/categories" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Categorias
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </section>
    </header>
  )
}
