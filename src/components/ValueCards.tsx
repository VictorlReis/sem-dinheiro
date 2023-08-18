interface ValueCardsProps {
  value: number
  backgroundColor?: string
  title: string
}

const ValueCard: React.FC<ValueCardsProps> = ({
  value,
  backgroundColor,
  title,
}) => {
  const getClass = () => {
    switch (backgroundColor) {
      case 'red':
        return 'border-2 bg-error rounded-lg py-1vh px-2vh flex flex-col pr-4 pt-2 pb-2 pl-4'
      case 'green':
        return 'border-2 bg-success rounded-lg py-1vh px-2vh flex flex-col pr-4 pt-2 pb-2 pl-4'
      default:
        return 'border-2 bg-neutral rounded-lg py-1vh px-2vh flex flex-col pr-4 pt-2 pb-2 pl-4'
    }
  }

  return (
    <article className={getClass()}>
      <span>{title}</span>
      <span className="text-3xl">
        {value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </span>
    </article>
  )
}

export default ValueCard
