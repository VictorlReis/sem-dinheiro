import { z } from 'zod'

const message = 'Campo não pode ser vazio'
export const createTransactionDto = z
  .object({
    description: z.string().min(1).nonempty(message),
    category: z.string().min(1).nonempty(message),
    paymentMethod: z.string().min(1).nonempty(message),
    type: z.string().min(1).nonempty(message),
    amount: z.number().min(0.01),
    date: z.date().refine((value) => !isNaN(value.getTime()), {
      message: 'Data inválida',
    }),
  })
  .required()

export const CsvData = z.object({
  estabelecimento: z.string(),
  valor: z.string(),
})