import { type Transaction } from '.prisma/client'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

interface MonthlyChartProps {
  transactions: Transaction[]
}

ChartJS.register(ArcElement, Tooltip, Legend)

const MonthlyChart: React.FC<MonthlyChartProps> = ({ transactions }) => {
  const amounts = transactions.map((transaction) => transaction.amount)
  const categories = transactions.map((transaction) => transaction.category)

  const colorsArray = [
    '#858bb0',
    '#ff7b7b',
    '#44d9f8',
    '#3b425a',
    '#ffb86c',
    '#924ff2',
    '#ff79c6',
    '#525771',
    '#fda648',
    '#ff79c6',
    '#5914bb',
    '#0ba833',
    '#cd6d08',
    '#22d0f5',
    '#8f9bc3',
    '#ffa0a0',
    '#ff5555',
    '#7886b4',
    '#fd3131',
    '#6272a4',
    '#fb0e0e',
    '#54628c',
    '#a75a08',
    '#485273',
    '#b70707',
    '#6272a4',
    '#565641',
    '#6d6d4f',
    '#0dbfe5',
    '#fb9325',
    '#0c819a',
    '#7d2eed',
    '#0ccd3d',
    '#dd0606',
    '#0a8329',
    '#0ca0bf',
    '#f38107',
    '#824707',
    '#6916e0',
    '#491298',
    '#ff5555',
    '#910707',
  ]

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colorsArray,
        borderColor: colorsArray,
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // Customize other chart options as needed
  }

  return <Pie data={data} options={options} />
}

export default MonthlyChart
