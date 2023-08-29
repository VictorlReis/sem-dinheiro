import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Pie } from 'react-chartjs-2'

interface MonthlyChartProps<T> {
  data: T[]
  reducer: (acc: CategoryData, value: T) => CategoryData
}

ChartJS.register(ArcElement, Tooltip, Legend)
interface CategoryData {
  [category: string]: number
}

const MonthlyChart: <T>(props: MonthlyChartProps<T>) => JSX.Element = ({
  data: transactions,
  reducer,
}) => {
  const categoryData: CategoryData = transactions.reduce(
    reducer,
    {} as { [key: string]: number },
  )

  const categories: string[] = Object.keys(categoryData)
  const amounts: number[] = Object.values(categoryData)

  const colorsArray = [
    '#858bb0',
    '#ff7b7b',
    '#3b425a',
    '#ffb86c',
    '#924ff2',
    '#ff79c6',
    '#525771',
    '#910707',
    '#fda648',
    '#5914bb',
    '#0ba833',
    '#cd6d08',
    '#8f9bc3',
    '#ffa0a0',
    '#ff5555',
    '#44d9f8',
    '#7886b4',
    '#fd3131',
    '#6272a4',
    '#fb0e0e',
    '#54628c',
    '#a75a08',
    '#485273',
    '#491298',
    '#b70707',
    '#6272a4',
    '#565641',
    '#0dbfe5',
    '#fb9325',
    '#0c819a',
    '#7d2eed',
    '#0ccd3d',
    '#dd0606',
    '#0a8329',
    '#6d6d4f',
    '#0ca0bf',
    '#f38107',
    '#824707',
    '#6916e0',
  ]

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colorsArray,
        borderColor: '#2a323b',
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    legend: {
      display: true,
      position: 'chartArea',
    },
  }

  return (
    <section className="sm:ml-0 sm:h-[35em] sm:w-[35em] lg:ml-32 lg:h-[30em] lg:w-[30em]">
      <Pie data={data} options={options} />
    </section>
  )
}

export default MonthlyChart
