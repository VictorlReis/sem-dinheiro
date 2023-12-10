import { type z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/utils/api'
import { createTransactionDto } from '@/dto/transactions.dto'

interface CreateTransactionModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
  refetch: () => void
}

const formSchema = createTransactionDto

export type FormData = z.infer<typeof formSchema>

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = (
  props,
) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { mutate: createTransaction } = api.transaction.create.useMutation({
    onSuccess: () => {
      props.refetch()
    },
  })

  const onSubmit = (data: FormData) => {
    createTransaction(data)
    reset()
    props.modalRef.current?.close()
  }
  const handleKeyDown = async (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      await handleSubmit(onSubmit)();
    }
  };

  return (
    <dialog id="create_modal" className="modal" ref={props.modalRef}>
      <form
        className="modal-box flex flex-col space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
      >
        <main className="flex flex-col items-center">
          <header className="mb-4">
            <h1 className="font-bold text-[1.5em]">Nova Transação</h1>
          </header>
          <article className="flex flex-col items-center space-y-4">
            <input
              {...register('description')}
              type="text"
              placeholder="Descrição"
              className="input input-md input-bordered input-secondary w-full"
            />
            <section className="flex space-x-3">
              <input
                {...register('category')}
                type="text"
                placeholder="Categoria"
                className="input input-md input-bordered input-secondary"
              />
              <input
                {...register('amount', {
                  setValueAs: (value) => Number(value),
                })}
                type="number"
                min="0.00"
                max="99999.99"
                step="0.01"
                placeholder="Valor"
                className="input input-md input-bordered input-secondary w-36"
              />
            </section>
            <section className="flex space-x-3">
              <input
                {...register('date', {
                  setValueAs: (value: string) => new Date(value),
                })}
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                placeholder="Data"
                className="input input-md input-bordered input-secondary w-44"
              />
              <select
                {...register('type')}
                className="input input-md input-bordered input-secondary w-44"
                defaultValue="expense"
              >
                <option value="expense">Saída</option>
                <option value="income">Entrada</option>
              </select>
            </section>
          </article>
          <footer className="modal-action">
            <button
              type="button"
              className="btn btn-sm btn-outline btn-error"
              onClick={() => {
                props.modalRef.current?.close()
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-outline btn-success"
              disabled={isSubmitting}
            >
              Criar
            </button>
          </footer>
        </main>
      </form>
    </dialog>
  )
}

export default CreateTransactionModal
