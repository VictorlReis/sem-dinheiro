import { z } from 'zod'

const message = 'Campo não pode ser vazio'
export const investmentTransaction = z.object({
  date: z.date().refine((value) => !isNaN(value.getTime()), {
    message: 'Data inválida',
  }),
  price: z.number(),
  type: z.string().min(1).nonempty(message),
  stock: z.string().min(1).nonempty(message),
  quantity: z.number(),
})

export type b3csv = z.infer<typeof investmentTransaction>

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
