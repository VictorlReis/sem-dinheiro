import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '../ui/textarea'
import { api } from '@/utils/api'
import { useState } from 'react'
import { validateTransactionInsert } from '../../utils/validations'
import { DialogClose } from '@radix-ui/react-dialog'

interface TransactionsInsertAiDialogProps {
  refetch: () => void
}

export const TransactionsInsertAiDialog: React.FC<
  TransactionsInsertAiDialogProps
> = (props) => {
  const [inputValue, setInputValue] = useState('')
  const { mutate: insertWithAi } = api.transaction.insertWithAi.useMutation({
    onSuccess: () => {
      props.refetch()
    },
  })

  const handleBtnSubmit = () => {
    insertWithAi(inputValue)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Inserir Transacoes (IA)</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inserir Transacoes </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              className="w-96 h-96"
              placeholder="{description: string, value: number}"
              value={inputValue}
              onChange={(e) => setInputValue(() => e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleBtnSubmit}>Enviar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
