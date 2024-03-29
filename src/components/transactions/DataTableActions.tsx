import { type Transaction } from '@prisma/client'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/utils/api'
import TransactionDialog from './TransactionDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableActionsProps {
  transaction: Transaction
}

export const DataTableActions: React.FC<DataTableActionsProps> = (props) => {
  const utils = api.useUtils()
  const { mutate: deleteTransaction } = api.transaction.delete.useMutation({
    onSuccess: async () => {
      await utils.transaction.invalidate()
    },
  })

  const { mutate: updateTransaction } = api.transaction.update.useMutation({
    onSuccess: async () => {
      await utils.transaction.invalidate()
    },
  })

  const deleteSelectedRow = (
    transactionId: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event?.preventDefault()
    deleteTransaction({ id: transactionId })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <TransactionDialog transaction={props.transaction} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            variant="link"
            onClick={(event) => {
              event.preventDefault()
              deleteSelectedRow?.(props.transaction.id)
            }}
          >
            Excluir
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            variant="link"
            onClick={() => {
              const newAmount = props.transaction.amount / 2
              updateTransaction({ ...props.transaction, amount: newAmount })
              void navigator.clipboard.writeText(newAmount.toString())
            }}
          >
            Dividir
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
