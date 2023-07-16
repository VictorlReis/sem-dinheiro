import { type Transaction } from '.prisma/client'
import { api } from '@/utils/api'
import trpc from '@/pages/api/trpc/[trpc]'

interface TransactionsTableProps {
  transactions: Transaction[]
  refetch: () => void
}

export const TransactionsTable: React.FC<TransactionsTableProps> = (props) => {
  const { mutate: deleteTransaction } = api.transaction.delete.useMutation({
    onSuccess: (data) => {
      console.log(data)
      props.refetch()
    },
  })

  return (
    <div>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Category</th>
            <th>Método Pagamento</th>
            <th>Data</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.transactions?.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.paymentMethod}</td>
              <td>{transaction.date.toLocaleDateString()}</td>
              <td>{transaction.amount}</td>
              <td>
                <button
                  className="btn btn-error btn-sm btn-outline"
                  onClick={() => deleteTransaction({ id: transaction.id })}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
