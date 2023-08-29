import CreateInvestmentTransactionModal from '@/components/CreateInvestmentTransactionModal'
import MonthlyChart from '@/components/MonthlyChart'
import { PortifolioTable } from '@/components/PortifolioTable'
import ValueCard from '@/components/ValueCards'
import { api } from '@/utils/api'
import { type NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'

const Investments: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sem Dinheiro</title>
      </Head>
      <Content />
    </>
  )
}

export default Investments

const Content: React.FC = () => {
  const modalRef = useRef<HTMLDialogElement>(null)

  const [sumPortifolio, setSumPortifolio] = useState(0)
  const [sumRentabilidade, setSumRentabilidade] = useState(0)

  const { data: positions, refetch } =
    api.investmentTransaction.getPositions.useQuery()

  const { mutate: importCsv } = api.investmentTransaction.importCsv.useMutation(
    {
      onSuccess: () => {
        void refetch()
      },
    },
  )

  useEffect(() => {
    if (positions) {
      let total = 0
      let totalMarketPrice = 0
      positions.forEach((pos) => {
        total += pos.total
        totalMarketPrice += pos.marketPrice * pos.quantity
      })
      setSumRentabilidade(totalMarketPrice - total)
      setSumPortifolio(total)
    }
  }, [positions])

  const showModal = () => {
    if (modalRef.current) modalRef.current.showModal()
  }

  const onClickCsvButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const fileReader = new FileReader()

        fileReader.onload = () => {
          const csvString = fileReader.result as string

          try {
            importCsv(convertCsvToJson(csvString))
            void refetch()
          } catch (error) {
            console.log(`Error parsing CSV to JSON: ${error as string}`)
          }
        }

        fileReader.readAsText(file)
      } catch (error) {
        console.log(`Error uploading CSV file: ${error as string}`)
      }
    }
  }

  const convertCsvToJson = (csvString: string) => {
    const lines: string[] = csvString.split('\n')

    if (lines.length < 2) throw new Error('Invalid CSV format')
    if (!lines[0]) throw Error('Invalid CSV format')

    const headers = lines[0].split(',')
    const dateIndex = headers.indexOf('Data do Negócio')
    const typeIndex = headers.indexOf('Tipo de Movimentação')
    const priceIndex = headers.indexOf('Preço')
    const marketIndex = headers.indexOf('Mercado')
    const stockIndex = headers.indexOf('Código de Negociação')
    const quantityIndex = headers.indexOf('Quantidade')

    const jsonData: any[] = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]!.trim()
      if (!line) {
        continue
      }
      const values = line.split(',')

      const market: string = values[marketIndex] || ''

      if (market.startsWith('Opção')) {
        continue
      }

      const dateParts: string[] = values[dateIndex]?.trim().split('/') || []
      const date = new Date(
        parseInt(dateParts[2]!),
        parseInt(dateParts[1]!) - 1,
        parseInt(dateParts[0]!),
      )
      const price: number = +values[priceIndex]?.replace('R$', '').trim()! || 0
      const type: string = values[typeIndex]?.trim() || ''
      let stock: string = values[stockIndex]?.trim() || ''
      const quantity: number = +values[quantityIndex]!

      // Remove trailing "F" from stock if it exists
      if (stock.endsWith('F')) {
        stock = stock.slice(0, -1)
      }

      jsonData.push({
        date,
        price,
        type,
        stock,
        quantity,
      })
    }

    return jsonData
  }

  return (
    <>
      <main className="container mx-auto my-8 px-4 sm:px-8">
        <article className="flex flex-col sm:flex-row">
          <article className="order-2 mt-6 w-full sm:order-1 sm:w-1/2 sm:pr-4 lg:mt-0">
            <section className="mb-5 flex flex-col items-center justify-between sm:flex-row">
              <section className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <button
                  className="btn btn-secondary btn-outline btn-sm"
                  onClick={() => showModal()}
                >
                  Nova compra
                </button>
                <section className="hidden sm:block">
                  <button className="btn btn-secondary btn-outline btn-sm">
                    <input
                      className="-left-9999 absolute opacity-0"
                      type="file"
                      accept=".csv"
                      onChange={(e) => onClickCsvButton(e)}
                    />
                    Importar posiçao da B3 (CSV)
                  </button>
                </section>
              </section>
            </section>
            <PortifolioTable positions={positions ?? []} refetch={refetch} />
          </article>
          <aside className="order-1 w-full sm:order-2 sm:mt-0 sm:w-1/2 sm:pl-4 lg:mt-8">
            <article className="mb-12 flex flex-col justify-center gap-8 sm:flex-row">
              <ValueCard
                value={sumRentabilidade}
                title="Rentabilidade"
                backgroundColor={sumRentabilidade > 0 ? 'green' : 'red'}
              />
              <ValueCard value={sumPortifolio} title="Total Acumulado" />
            </article>
            <MonthlyChart
              data={positions ?? []}
              reducer={(acc, position) => {
                const { stock, marketPrice, quantity } = position

                if (!acc[stock]) {
                  acc[stock] = 0
                }

                acc[stock] += ((marketPrice * quantity) / sumPortifolio) * 100
                return acc
              }}
            />
          </aside>
        </article>
      </main>
      <CreateInvestmentTransactionModal modalRef={modalRef} refetch={refetch} />
    </>
  )
}
