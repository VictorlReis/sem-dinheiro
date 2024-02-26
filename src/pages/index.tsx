import { type NextPage } from 'next'
import Head from 'next/head'
import MonthlyDashboard from './MonthlyDashboard'

const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sem Dinheiro</title>
      </Head>
      <MonthlyDashboard />
    </>
  )
}

export default Index
