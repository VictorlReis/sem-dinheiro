import { Portifolio } from '@/dto/transactions.dto'

interface PortifolioTableProps {
  positions: Portifolio[]
  refetch: () => void
}

export const PortifolioTable: React.FC<PortifolioTableProps> = (props) => {
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
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )

  function pctChange(position: Portifolio) {
    return (
      ((position.marketPrice - position.avgPrice) / position.avgPrice) *
      100
    ).toFixed(2)
  }
}
