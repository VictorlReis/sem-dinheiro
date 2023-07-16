import { type z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/utils/api'
import { createTransactionDto } from '@/dto/transactions.dto'

interface CreateTransactionModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
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
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { mutate: createTransaction } = api.transaction.create.useMutation({
    onSuccess: (data) => {
      console.log(data)
    },
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
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
        <div className="flex flex-col items-center">
          <header className="mb-4">
            <h1 className="font-bold text-[1.5em]">Nova Transação</h1>
          </header>
          <div className="flex flex-col items-center space-y-4">
            <input
              {...register('description')}
              type="text"
              placeholder="Descrição"
              className="input input-md input-bordered input-secondary w-full"
            />
            <span className="text-error">
              {errors.description && errors.description.message?.toString()}
            </span>
            <article className="flex space-x-3">
              <input
                {...register('category')}
                type="text"
                placeholder="Categoria"
                className="input input-md input-bordered input-secondary"
              />
              <input
                {...register('paymentMethod')}
                type="text"
                placeholder="Método de pagamento"
                className="input input-md input-bordered input-secondary w-52"
              />
            </article>
            <article className="flex space-x-3">
              <input
                {...register('amount', {
                  setValueAs: (value) => Number(value),
                })}
                type="number"
                placeholder="Valor"
                className="input input-md input-bordered input-secondary w-36"
              />
              <span className="text-error">
                {errors.amount && errors.amount.message?.toString()}
              </span>
              <input
                {...register('date', {
                  setValueAs: (value: string) => new Date(value),
                })}
                type="date"
                placeholder="Data"
                className="input input-md input-bordered input-secondary w-36"
              />
              <select
                {...register('type')}
                className="input input-md input-bordered input-secondary w-34"
                defaultValue="expense"
              >
                <option value="expense">Entrada</option>
                <option value="income">Saída</option>
              </select>
            </article>
          </div>
          <div className="modal-action">
            <button
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
          </div>
        </div>
      </form>
    </dialog>
  )
}

export default CreateTransactionModal
