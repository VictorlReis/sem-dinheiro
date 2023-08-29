import { z } from 'zod'

const message = 'Campo não pode ser vazio'
export const createTransactionDto = z
  .object({
    description: z.string().min(1).nonempty(message),
    category: z.string().min(1).nonempty(message),
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

export const createTransactionBackup = z
  .object({
    description: z.string(),
    category: z.string(),
    type: z.string(),
    amount: z.string(),
    date: z.string(),
  })
  .required()

export const investmentTransaction = z.object({
  date: z.date().refine((value) => !isNaN(value.getTime()), {
    message: 'Data inválida',
  }),
  price: z.number(),
  type: z.string().min(1).nonempty(message),
  stock: z.string().min(1).nonempty(message),
  quantity: z.number(),
})

export const updateInvestmentTransaction = z.object({
  id: z.string().min(1).nonempty(message),
  date: z.date().refine((value) => !isNaN(value.getTime()), {
    message: 'Data inválida',
  }),
  price: z.number(),
  type: z.string().min(1).nonempty(message),
  stock: z.string().min(1).nonempty(message),
  quantity: z.number(),
})

export const getStockData = z.object({
  stock: z.string().min(1).nonempty(message),
})

export interface Portifolio {
  stock: string
  avgPrice: number
  quantity: number
  total: number
  marketPrice: number
}
