import { z } from 'zod'

export const createTransactionDto = z
  .object({
    description: z.string().min(1),
    categoryId: z.string().min(1),
    type: z.string().min(1),
    amount: z.number().min(0.01, {
      message: 'Error',
    }),
    date: z.date().refine((value) => !isNaN(value.getTime()), {
      message: 'Data inválida',
    }),
  })
  .required()

export type FullTransactionDto = {
  category: string
  Category: {
    id: string
    name: string
    userId: string
  }
  id: string
  description: string
  type: string
  date: Date
  amount: number
  userId: string
  categoryId: string
}

export const CsvData = z.object({
  estabelecimento: z.string(),
  valor: z.string(),
})

export type AiModelResult = {
  description: string
  value: number
}

export const insertInputDto = z.object({
  date: z.date().refine((value) => !isNaN(value.getTime()), {
    message: 'Data inválida',
  }),
  data: z.string().min(1),
})

export const insertTransaction = z.object({
  description: z.string().min(1),
  value: z.number().min(0.01),
})
