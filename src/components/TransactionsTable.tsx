import { type Transaction } from '@prisma/client'
import { api } from '@/utils/api'
import { useState } from 'react'
import { AiOutlineCloseCircle, AiOutlineCheck } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'

interface TransactionsTableProps {
  transactions: Transaction[]
  refetch: () => void
}

const trasactionTypeMap: Record<string, string> = {
  expense: 'Saída',
  income: 'Entrada',
}

export const TransactionsTable: React.FC<TransactionsTableProps> = (props) => {
  const [selectedType, setSelectedType] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [rowBeenEdited, setRowBeenEdited] = useState('')

  const { mutate: deleteTransaction } = api.transaction.delete.useMutation({
    onSuccess: () => {
      props.refetch()
    },
  })

  const { mutate: editTransaction } = api.transaction.update.useMutation({
    onSuccess: () => {
      cancelEdit()
      props.refetch()
    },
  })

  const editRow = (transaction: (typeof props.transactions)[0]) => {
    setRowBeenEdited(transaction.id)
    setSelectedType(transaction.type)
    setDescription(transaction.description)
    setCategory(transaction.category)
    setAmount(transaction.amount)
    setDate(transaction.date.toISOString().split('T')[0] as string)
  }

  const cancelEdit = () => {
    setRowBeenEdited('')
  }

  const canSave = !!(description && category && date && selectedType && amount)

  const saveEditedRow = (id: string) => {
    if (canSave) {
      editTransaction({
        description,
        id,
        category,
        type: selectedType,
        date: new Date(date),
        amount: amount,
      })
    }
  }

  return (
    <section className="overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descrição</th>
            <th>Categoria</th>
            <th>Data</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.transactions?.map((transaction) => (
            <tr
              key={transaction.id}
              onDoubleClick={() => editRow(transaction)}
              className={
                rowBeenEdited === transaction.id ? 'bg-neutral-focus' : ''
              }
            >
              {rowBeenEdited === transaction.id ? (
                <>
                  <td>
                    <select
                      className="input input-ghost input-sm w-20"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="expense">Saída</option>
                      <option value="income">Entrada</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="input input-ghost input-sm w-32"
                      type="text"
                      defaultValue={transaction.description}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="input input-ghost input-sm w-32"
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="input input-ghost input-sm w-32"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="input input-ghost input-sm w-20"
                      type="number"
                      min="0.00"
                      max="10000.00"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(+e.target.value)}
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>{trasactionTypeMap[transaction.type]}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.date.toLocaleDateString()}</td>
                  <td>{transaction.amount}</td>
                </>
              )}
              <td>
                {rowBeenEdited === transaction.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEditedRow(transaction.id)}
                      className="text-success"
                      disabled={!canSave}
                    >
                      <AiOutlineCheck size={20} />
                    </button>
                    <button
                      onClick={() => cancelEdit()}
                      className="text-accent"
                    >
                      <AiOutlineCloseCircle size={20} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-error ml-2"
                    onClick={() => deleteTransaction({ id: transaction.id })}
                  >
                    <MdDelete size={20} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
