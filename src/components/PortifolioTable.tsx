import { Portifolio } from '@/dto/transactions.dto'

interface PortifolioTableProps {
  positions: Portifolio[]
  refetch: () => void
}

export const PortifolioTable: React.FC<PortifolioTableProps> = (props) => {
  const totalPortifolio = props.positions?.reduce(
    (accumulator, currentStock) => {
      // Calculate the product of marketPrice and quantity for the current stock
      const stockValue = currentStock.marketPrice * currentStock.quantity

      // Add the stockValue to the accumulator
      return accumulator + stockValue
    },
    0,
  )

  return (
    <section className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Ativo</th>
            <th>Preço Médio</th>
            <th>Quantidade</th>
            <th>Preço Atual</th>
            <th>Rentabilidade</th>
            <th>Alocacao</th>

            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.positions?.map((position) => (
            <tr key={position.stock}>
              <td>{position.stock}</td>
              <td>R$ {position.avgPrice.toFixed(2)}</td>
              <td>{position.quantity}</td>
              <td>{position.marketPrice}</td>
              <td>{pctChange(position)}%</td>
              <td>{allocation(position.quantity, position.marketPrice)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )

  function allocation(qty: number, marketPrice: number) {
    return (((marketPrice * qty) / totalPortifolio) * 100).toFixed(2)
  }

  function pctChange(position: Portifolio) {
    return (
      ((position.marketPrice - position.avgPrice) / position.avgPrice) *
      100
    ).toFixed(2)
  }
}
