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
import { Transaction } from '@prisma/client'

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
    onSuccess: (data) => {
      console.log(data)
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

const importDataFromCsv = (data: string): { 
  description: string;
  type: string;
  date: string;
  paymentMethod: string;
  category: string;
  amount: string;
}[] => {
  const lines: string[] = data.split('\n');

  if (lines.length < 2) throw new Error('Invalid CSV format');

  const jsonData: {
    description: string;
    type: string;
    date: string;
    paymentMethod: string;
    category: string;
    amount: string;
  }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();
    if (line) {
      const values = line.split(',');
      const [
        description,
        type,
        date,
        paymentMethod,
        category,
        amount,
      ] = values;
    
      const transformedType = type === '0' ? 'expense' : 'income';

      if (
        description &&
        type &&
        date &&
        paymentMethod &&
        category &&
        amount
      ) {

        const row = {
          description,
          type: transformedType,
          date,
          paymentMethod,
          category,
          amount,
        };
        jsonData.push(row);
      }
    }
  }

  console.log(jsonData);
  return jsonData;
};
 
const onClickCsvBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileReader = new FileReader();
        
        fileReader.onload = () => {
          const csvString = fileReader.result as string;
  
          try {
            importDataFromCsv(csvString)
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
      <div className="h-fit mx-8 my-8">
        <div className="flex">
          <div className="w-1/2">
            <div className="flex justify-between">
              <div className="flex space-x-4 mb-5">
                <button
                  className="btn btn-secondary btn-outline btn-sm"
                  onClick={() => showModal()}
                >
                  Nova transação
                </button>
                <button
                  className="btn btn-secondary btn-outline btn-sm"
                >
                  <input
                    className="opacity-0 absolute -left-9999"
                    type="file"
                    accept=".csv"
                    onChange={(e) => onClickCsvButton(e)}
                  />
                  Importar csv
                </button>
              </div>
              <div>
                <DateFilter
                  selectedMonth={month}
                  selectedYear={year}
                  onChangeMonth={(e) => {
                    setMonth(Number(e.target.value))
                  }}
                  onChangeYear={(e) => {
                    setYear(Number(e.target.value))
                  }}
                />
              </div>
            </div>
            <TransactionsTable
              transactions={transactions ?? []}
              refetch={refetch}
            />
          </div>
          <div className="w-1/2">
            <section className="flex justify-end gap-8 mb-12 ">
              <ValueCard value={sumExpenses} title="Despesas" backgroundColor="red" />
              <ValueCard value={sumIncome} title="Receitas" backgroundColor="green" />
              <ValueCard value={sumIncome - sumExpenses} title="Total Final" />
            </section>
            <MonthlyChart transactions={transactions ?? []} />
                  <button
                  className="btn btn-secondary btn-outline btn-sm"
                >
                  <input
                    className="opacity-0 absolute -left-9999"
                    type="file"
                    accept=".csv"
                    onChange={(e) => onClickCsvBackup(e)}
                  />
                  Importar backup
              </button>
          </div>
        </div>
      </div>
      <CreateTransactionModal modalRef={modalRef} refetch={refetch} />
    </>
  )
}
