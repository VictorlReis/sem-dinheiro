import { Transaction } from '@prisma/client'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/utils/api'

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
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Button variant="link">Editar</Button>
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
              console.log('editar')
            }}
          >
            Dividir
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
