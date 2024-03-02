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
import { DialogClose } from '@radix-ui/react-dialog'
import DateFilter from '../DateFilter'

interface TransactionsInsertAiDialogProps {
  refetch: () => void
}

export const TransactionsInsertAiDialog: React.FC<
  TransactionsInsertAiDialogProps
> = (props) => {
  const [inputValue, setInputValue] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const { mutate: insertWithAi } = api.transaction.insertWithAi.useMutation({
    onSuccess: () => {
      props.refetch()
    },
  })

  const handleBtnSubmit = () => {
    insertWithAi({
      date: new Date(year, month - 1),
      data: inputValue,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Inserir Transacoes (IA)</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inserir Transacoes (IA)</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DateFilter
            selectedMonth={month}
            selectedYear={year}
            onChangeMonth={(value: string) => setMonth(Number(value))}
            onChangeYear={(value: string) => setYear(Number(value))}
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              className="w-96 h-96"
              placeholder=""
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
