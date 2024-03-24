import { type z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/utils/api'
import { createTransactionDto } from '@/dto/transactions.dto'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { DialogClose, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MoneyInput from '../ui/moneyInput'
import { type Transaction } from '@prisma/client'

interface TransactionDialogProps {
  transaction?: Transaction
}

const TransactionDialog: React.FC<TransactionDialogProps> = (props) => {
  const utils = api.useUtils()

  const { mutate: createTransaction } = api.transaction.create.useMutation({
    onSuccess: async () => {
      await utils.transaction.invalidate()
    },
  })

  const { mutate: updateTransaction } = api.transaction.update.useMutation({
    onSuccess: async () => {
      await utils.transaction.invalidate()
    },
  })

  const { data: categories } = api.category.getAll.useQuery()

  const form = useForm<z.infer<typeof createTransactionDto>>({
    resolver: zodResolver(createTransactionDto),
    defaultValues: {
      description: props.transaction?.description ?? '',
      category: props.transaction?.category ?? '',
      type: props.transaction?.type ?? 'expense',
      amount: props.transaction?.amount ?? 0,
      date: props.transaction?.date ?? new Date(),
    },
  })

  const onSubmit = (values: z.infer<typeof createTransactionDto>) => {
    props.transaction
      ? updateTransaction({ id: props.transaction.id, ...values })
      : createTransaction(values)
    form.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {props.transaction ? (
          <div className="hover:bg-secondary">
            <Button variant="link" className="ml-2">
              Editar
            </Button>
          </div>
        ) : (
          <Button>Nova Transacao</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="ml-10">
            <DialogHeader>
              <DialogTitle className="font-bold flex justify-center">
                {props.transaction ? 'Editar Transação' : 'Nova Transação'}
              </DialogTitle>
            </DialogHeader>
            <section className="flex space-x-5 mt-4 mb-4 justify-center w-96">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Descrição" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Categoria" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <section className="flex space-x-3 mb-4 justify-center w-96">
              <MoneyInput form={form} name="amount" placeholder="Valor" />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={'outline'}>
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </section>
            <DialogFooter className="flex justify-center">
              <DialogClose asChild>
                <Button type="button" className="h-8 w-20">
                  Cancelar
                </Button>
              </DialogClose>
              <DialogClose>
                <Button type="submit" className="h-8 w-20">
                  {props.transaction ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default TransactionDialog
