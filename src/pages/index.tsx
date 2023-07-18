import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { type NextPage } from 'next'
import { api } from '@/utils/api'
import { useRef, useState } from 'react'
import { log } from 'next/dist/server/typescript/utils'
import CreateTransactionModal from '@/components/CreateTransactionModal'
import { TransactionsTable } from '@/components/TransactionsTable'
import MonthlyChart from '@/components/MonthlyChart'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sem Dinheiro</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header />
        <Content />
      </main>
    </>
  )
}

export default Home

const Content: React.FC = () => {
  const modalRef = useRef<HTMLDialogElement>(null)

  const { data: sessionData } = useSession()

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  const { data: transactions, refetch } =
    api.transaction.getMonthlyTransactions.useQuery(
      {
        month,
        year,
      },
      {
        enabled: !!sessionData?.user,
      },
    )

  const showModal = () => {
    if (modalRef.current) modalRef.current.showModal()
  }

  return (
    <>
      <div className="h-fit mx-8 my-8">
        <div className="flex space-x-4 mb-5">
          <button
            className="btn btn-secondary btn-outline btn-sm"
            onClick={() => showModal()}
          >
            Nova transação
          </button>
          <button
            className="btn btn-secondary btn-outline btn-sm"
            onClick={() => console.log('alo')}
          >
            Importar csv
          </button>
        </div>
        <div className="flex-row">
          <div className="w-1/2">
            <TransactionsTable
              transactions={transactions ?? []}
              refetch={refetch}
            />
          </div>
          <div className="w-1/2">
            <MonthlyChart transactions={transactions ?? []} />
          </div>
        </div>
      </div>
      <CreateTransactionModal modalRef={modalRef} refetch={refetch} />
    </>
  )
}
