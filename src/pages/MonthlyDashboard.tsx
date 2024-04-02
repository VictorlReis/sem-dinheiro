import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import DateFilter from '@/components/DateFilter'
import MonthlyChart from '@/components/MonthlyChart'
import { TransactionsTable } from '@/components/transactions/Table'
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { api } from '../utils/api'
import { TransactionsInsertAiDialog } from '@/components/transactions/TransactionInsertAi'
import TransactionDialog from '@/components/transactions/TransactionDialog'
import { type FullTransactionDto } from '@/dto/transactions.dto'

const MonthlyDashboard: React.FC = () => {
  const { data: sessionData } = useSession()

  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [sumExpenses, setSumExpenses] = useState(0)
  const [sumIncome, setSumIncome] = useState(0)
  const [total, setTotal] = useState(0)

  const { data: categories } = api.category.getAll.useQuery()
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

  useEffect(() => {
    console.log(transactions)
    if (transactions) {
      sumTotal(transactions)
    }
  }, [transactions])

  const sumTotal = (transactions: readonly FullTransactionDto[]) => {
    const { sumExpenses, sumIncome } = transactions.reduce(
      (sums, transaction) => {
        if (transaction.type === 'expense') {
          sums.sumExpenses += transaction.amount
        } else if (transaction.type === 'income') {
          sums.sumIncome += transaction.amount
        }
        return sums
      },
      { sumExpenses: 0, sumIncome: 0 },
    )

    setSumExpenses(sumExpenses)
    setSumIncome(sumIncome)
    setTotal(sumIncome - sumExpenses)
  }

  return (
    <>
      <hr className="border-gray-700" />
      <main className="mx-auto my-8 px-4 sm:px-8">
        <article className="flex flex-col sm:flex-row">
          <article className="order-2 mt-6 w-full sm:order-1 sm:w-1/2 sm:pr-4 lg:mt-0">
            <section className="mb-5 items-center justify-between sm:flex-row">
              <section className="mb-5 flex space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <TransactionDialog />
                <TransactionsInsertAiDialog refetch={refetch} />
              </section>
              <section className="flex flex-row-reverse sm:mt-0">
                <DateFilter
                  selectedMonth={month}
                  selectedYear={year}
                  onChangeMonth={(value: string) => setMonth(Number(value))}
                  onChangeYear={(value: string) => setYear(Number(value))}
                />
              </section>
            </section>
            <TransactionsTable
              transactions={transactions ?? []}
              categories={categories ?? []}
              refetch={refetch}
            />
          </article>
          <aside className="order-1 w-full sm:order-2 sm:mt-0 sm:w-1/2 sm:pl-4">
            <article className="mb-12 flex flex-col justify-center gap-8 sm:flex-row">
              <Card>
                <CardHeader>
                  <CardDescription>Despesas</CardDescription>
                  <CardTitle>
                    {sumExpenses.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Receitas</CardDescription>
                  <CardTitle>
                    {sumIncome.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Total Final</CardDescription>
                  <CardTitle>
                    {total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </CardTitle>
                </CardHeader>
              </Card>
            </article>
            <MonthlyChart
              transactions={transactions ?? []}
              categories={categories ?? []}
            />
          </aside>
        </article>
      </main>
    </>
  )
}

export default MonthlyDashboard
