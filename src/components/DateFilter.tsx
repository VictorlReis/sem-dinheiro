import React from 'react'

interface DateFilterProps {
  selectedMonth: number
  selectedYear: number
  onChangeMonth: (event: React.ChangeEvent<HTMLSelectElement>) => void
  onChangeYear: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedMonth,
  selectedYear,
  onChangeMonth,
  onChangeYear,
}) => {
  const translatedMonths = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 10

  return (
    <div className="flex">
      <select
        value={selectedMonth}
        onChange={onChangeMonth}
        className="select select-secondary select-sm mr-2"
      >
        {translatedMonths.map((mes, index) => (
          <option key={index + 1} value={index + 1}>
            {mes}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={onChangeYear}
        className="select select-secondary select-sm"
      >
        {Array.from({ length: 11 }, (_, i) => startYear + i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DateFilter
