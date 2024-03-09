import { type Category } from '@prisma/client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useState } from 'react'
import { api } from '../../utils/api'

interface CategoriesDialogProps {
  category?: Category
}

const CategoriesDialog: React.FC<CategoriesDialogProps> = (props) => {
  const utils = api.useUtils()
  const [categoryName, setCategoryName] = useState('')

  const { mutate: create } = api.category.create.useMutation({
    onSuccess: async () => {
      await utils.category.invalidate()
    },
  })
  const { mutate: update } = api.category.update.useMutation({
    onSuccess: async () => {
      await utils.category.invalidate()
    },
  })

  if (props.category) {
    setCategoryName(props.category.name)
  }
  const handleBtnSubmit = () => {
    props.category
      ? update({ id: props.category.id, name: categoryName })
      : create({ name: categoryName })
    setCategoryName('')
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button>{props.category ? 'Editar' : 'Nova categoria'}</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center p-8 w-60">
        <DialogHeader>
          {props.category ? 'Editar categoria' : 'Nova categoria'}
        </DialogHeader>
        <Input
          className="w-36"
          placeholder={props.category ? props.category.name : 'Categoria'}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <DialogClose>
          <Button onClick={handleBtnSubmit} className="w-20">
            Salvar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

export default CategoriesDialog
