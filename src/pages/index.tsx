import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { type NextPage } from 'next'
import { api } from '@/utils/api'
import { useEffect, useRef, useState } from 'react'
import CreateTransactionModal from '@/components/CreateTransactionModal'
import { TransactionsTable } from '@/components/TransactionsTable'
import MonthlyChart from '@/components/MonthlyChart'
import DateFilter from '@/components/DateFilter'
import ValueCard from '@/components/ValueCards'
import { type Transaction } from '@prisma/client'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sem Dinheiro</title>
        <meta name="description" content="Sem dinheiro" />
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
  const [sumExpenses, setSumExpenses] = useState(0)
  const [sumIncome, setSumIncome] = useState(0)

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

  const { mutate: importCsv } = api.transaction.importCsv.useMutation({
    onSuccess: () => {
      void refetch()
    },
  }) 

  const { mutate: createNubankAccount } = api.nubank.createNubankAccount.useMutation({
    onSuccess: () => {
      void refetch()
    },
  })

  useEffect(() => {
    if (transactions) {
      sumTotal(transactions)
    }
  }, [transactions])

  const sumTotal = (transactions: readonly Transaction[]) => {
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
  }
  const showModal = () => {
    if (modalRef.current) modalRef.current.showModal()
  }

  const onClickCsvButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileReader = new FileReader();
        
        fileReader.onload = () => {
          const csvString = fileReader.result as string;
  
          try {
            importCsv(convertCsvToJson(csvString));
            void refetch();
  
          } catch (error) {
            console.log(`Error parsing CSV to JSON: ${error as string}`);
          }
        };
  
        fileReader.readAsText(file);
      } catch (error) {
        console.log(`Error uploading CSV file: ${error as string}`);
      }
    }
  };
  
const convertCsvToJson = (csvString: string): { estabelecimento: string; valor: string; }[] => {
  const lines: string[] = csvString.split('\n');
  
  if (lines.length < 2) throw new Error('Invalid CSV format');
  if (!lines[0]) throw new Error('Invalid CSV format');

  const headers = lines[0].split(';');
  const estabelecimentoIndex = headers.indexOf('Estabelecimento');
  const valorIndex = headers.indexOf('Valor');

  const jsonData: { estabelecimento: string; valor: string; }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (line) {
      const values = line.split(';');
      const estabelecimento: string = values[estabelecimentoIndex] || '';
      const valor: string = values[valorIndex] || '';

      if (estabelecimento && valor) {
        const row = {
          estabelecimento,
          valor,
        };
        jsonData.push(row);
      }
    }
  }

  return jsonData;
};

  return (
<>
  <div className="container mx-auto px-4 sm:px-8 my-8">
    <div className="flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/2 sm:pr-4 lg:mt-0 mt-6 order-2 sm:order-1">
        <div className="flex flex-col justify-between items-center mb-5 sm:flex-row">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              className="btn btn-secondary btn-outline btn-sm"
              onClick={() => showModal()}
            >
              Nova transação
            </button>
            <div className="hidden sm:block">
              <button
                className="btn btn-secondary btn-outline btn-sm"
              >
                <input
                  className="opacity-0 absolute -left-9999"
                  type="file"
                  accept=".csv"
                  onChange={(e) => onClickCsvButton(e)}
                />
                Importar fatura XP (CSV)
              </button>
              <button
                className="btn btn-primary btn-outline btn-sm btn-disabled"
                onClick={() => createNubankAccount({ login: 'teste', password: 'teste' })}
              >
                Conectar conta Nubank
              </button>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <DateFilter
              selectedMonth={month}
              selectedYear={year}
              onChangeMonth={(e) => {
                setMonth(Number(e.target.value));
              }}
              onChangeYear={(e) => {
                setYear(Number(e.target.value));
              }}
            />
          </div>
        </div>
        <TransactionsTable transactions={transactions ?? []} refetch={refetch} />
      </div>
      <div className="w-full sm:w-1/2 sm:pl-4 lg:mt-8 sm:mt-0 order-1 sm:order-2">
        <section className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
          <ValueCard value={sumExpenses} title="Despesas" backgroundColor="red" />
          <ValueCard value={sumIncome} title="Receitas" backgroundColor="green" />
          <ValueCard value={sumIncome - sumExpenses} title="Total Final" />
        </section>
        <MonthlyChart transactions={transactions ?? []} />
      </div>
    </div>
  </div>

  <CreateTransactionModal modalRef={modalRef} refetch={refetch} />
</>
  )
}
