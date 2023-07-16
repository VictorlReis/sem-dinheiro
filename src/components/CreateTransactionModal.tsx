import NumericFormat from 'react-number-format'

interface CreateTransactionModalProps {
  modalRef: React.RefObject<HTMLDialogElement>
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = (
  props,
) => {
  return (
    <dialog id="create_modal" className="modal" ref={props.modalRef}>
      <form
        method="dialog"
        className="modal-box flex flex-col space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <header>
          <h3 className="font-bold text-lg">New Transaction</h3>
        </header>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Description"
            className="input input-md input-bordered input-secondary w-full max-w-xs"
          />
          <input
            type="date"
            placeholder="Date"
            className="input input-md input-bordered input-secondary w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Payment Method"
            className="input input-md input-bordered input-secondary w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Category"
            className="input input-md input-bordered input-secondary w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Payment Method"
            className="input input-md input-bordered input-secondary w-full max-w-xs"
          />
          <input
            type="number"
            min="0.00"
            max="10000.00"
            step="0.01"
            placeholder="Amount"
            className="input input-md input-bordered input-secondary w-full max-w-xs"
          />
          <select
            className="input input-md input-bordered input-secondary w-full max-w-xs"
            defaultValue="expense"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="modal-action">
          <button className="btn btn-sm btn-outline btn-error">Cancel</button>
          <button
            className="btn btn-sm btn-outline btn-success"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault()
            }}
          >
            Create
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default CreateTransactionModal
