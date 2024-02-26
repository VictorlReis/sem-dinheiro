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
import { CalendarIcon, Link } from 'lucide-react'
import { format } from 'date-fns'
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './ui/dialog'
import { DialogClose, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CreateTransactionModalProps {
  refetch: () => void
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = (
  props,
) => {
  const form = useForm<z.infer<typeof createTransactionDto>>({
    resolver: zodResolver(createTransactionDto),
    defaultValues: {
      description: '',
      category: '',
      type: 'expense',
      amount: 1,
      date: new Date(),
    },
  })

  const { mutate: createTransaction } = api.transaction.create.useMutation({
    onSuccess: () => {
      props.refetch()
    },
  })

  const onSubmit = (values: z.infer<typeof createTransactionDto>) => {
    createTransaction(values)
    form.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nova Transacao</Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="ml-10">
            <DialogHeader>
              <DialogTitle className="font-bold flex justify-center">
                Nova Transação
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
            </section>
            <section className="flex space-x-3 mb-4 justify-center w-96">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.00"
                        max="9999.99"
                        step="0.01"
                        placeholder="Valor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  Criar
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTransactionModal
