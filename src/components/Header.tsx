import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Header = () => {
  const { data: sessionData } = useSession()
  const router = useRouter()

  return (
    <header className="navbar bg-neutral text-neutral-content">
      <section className="flex-1 pl-5 text-3xl font-bold">
        {sessionData?.user?.name
          ? `Sem dinheiro, ${sessionData.user.name}?`
          : ''}
      </section>
      <section className="mr-4 gap-2">
        <Link
          className={`btn btn-neutral btn-sm ${
            router.pathname === '/' ? 'btn-active' : ''
          }`}
          href="/"
        >
          Mensal
        </Link>
        <Link
          className={`btn btn-neutral btn-sm ${
            router.pathname === '/dashboard' ? 'btn-active' : ''
          }`}
          href="/dashboard"
        >
          Anual
        </Link>
        <Link
          className={`btn btn-neutral btn-sm ${
            router.pathname === '/investments' ? 'btn-active' : ''
          }`}
          href="/investments"
        >
          Investimentos
        </Link>
      </section>
      <section className="flex-none gap-2">
        <article className="dropdown dropdown-end">
          {sessionData?.user ? (
            <label
              tabIndex={0}
              className="avatar btn btn-circle btn-ghost"
              onClick={() => void signOut()}
            >
              <article className="w-10 rounded-full">
                <img
                  src={sessionData?.user?.image ?? ''}
                  alt={sessionData?.user?.name ?? ''}
                />
              </article>
            </label>
          ) : (
            <button
              className="btn btn-ghost rounded-btn"
              onClick={() => void signIn()}
            >
              Login
            </button>
          )}
        </article>
      </section>
    </header>
  )
}
