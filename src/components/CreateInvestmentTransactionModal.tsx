import { investmentTransaction } from '@/dto/transactions.dto'
import { api } from '@/utils/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { type z } from 'zod'
import { Button } from '@/components/ui/Button'

interface CreateInvestmentTransactionModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
  refetch: () => void
}

const formSchema = investmentTransaction

export type FormData = z.infer<typeof formSchema>

const CreateInvestmentTransactionModal: React.FC<
  CreateInvestmentTransactionModalProps
> = (props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { mutate: createTransaction } =
    api.investmentTransaction.create.useMutation({
      onSuccess: () => {
        props.refetch()
      },
    })

  const onSubmit = (data: FormData) => {
    createTransaction(data)
    reset()
    props.modalRef.current?.close()
  }

  return (
    <dialog id="create_modal" className="modal" ref={props.modalRef}>
      <form
        className="modal-box flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <main className="flex flex-col items-center">
          <header className="mb-4">
            <h1 className="text-[1.5em] font-bold">Nova Transação</h1>
          </header>
          <article className="flex flex-col items-center space-y-4">
            <section className="flex space-x-3">
              <label className="w-40">Código de negociação</label>
              <label className="w-40">Quantidade</label>
              <label className="w-40">Preço</label>
            </section>
            <section className="flex space-x-3">
              <input
                {...register('stock', {
                  setValueAs: (value: string) => value.trim().toUpperCase(),
                })}
                type="text"
                placeholder="PETR4"
                className="input input-bordered input-secondary input-md"
              />
              <input
                {...register('quantity', {
                  setValueAs: (value) => Number(value),
                })}
                type="number"
                min="0"
                max="99999"
                step="1"
                placeholder="quantidade"
                className="input input-bordered input-secondary input-md w-36"
              />
              <input
                {...register('price', {
                  setValueAs: (value) => Number(value),
                })}
                type="number"
                min="0.00"
                max="99999.99"
                step="0.01"
                placeholder="preço"
                className="input input-bordered input-secondary input-md w-36"
              />
            </section>
            <section className="flex space-x-3">
              <label className="w-44">Data da operação</label>
              <label className="w-44">Tipo de operação</label>
            </section>
            <section className="flex space-x-3">
              <input
                {...register('date', {
                  setValueAs: (value: string) => new Date(value),
                })}
                type="date"
                placeholder="Data da operação"
                className="input input-bordered input-secondary input-md w-44"
              />
              <select
                {...register('type')}
                className="input input-bordered input-secondary input-md w-44"
                defaultValue="expense"
              >
                <option value="Compra">Compra</option>
                <option value="Venda">Venda</option>
              </select>
            </section>
          </article>
          <footer className="modal-action">
            <Button
              className="btn btn-error btn-outline btn-sm"
              onClick={() => {
                props.modalRef.current?.close()
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="btn btn-success btn-outline btn-sm"
              disabled={isSubmitting}
            >
              Criar
            </Button>
          </footer>
        </main>
      </form>
    </dialog>
  )
}

export default CreateInvestmentTransactionModal
