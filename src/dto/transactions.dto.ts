import { z } from 'zod'

export const createTransactionDto = z
  .object({
    description: z.string().min(1),
    category: z.string().min(1),
    type: z.string().min(1),
    amount: z.number().min(0.01, {
      message: 'Error',
    }),
    date: z.date().refine((value) => !isNaN(value.getTime()), {
      message: 'Data inválida',
    }),
  })
  .required()

export const CsvData = z.object({
  estabelecimento: z.string(),
  valor: z.string(),
})

export const investmentTransaction = z.object({
  date: z.date().refine((value) => !isNaN(value.getTime()), {
    message: 'Data inválida',
  }),
  price: z.number(),
  type: z.string().min(1),
  stock: z.string().min(1),
  quantity: z.number(),
})

export const insertTransaction = z.object({
  description: z.string().min(1),
  value: z.number().min(0.01),
})

export type PythonApiTransaction = z.infer<typeof createTransactionDto>

export type b3csv = z.infer<typeof investmentTransaction>

export const updateInvestmentTransaction = z.object({
  id: z.string().min(1),
  date: z.date().refine((value) => !isNaN(value.getTime()), {
    message: 'Data inválida',
  }),
  price: z.number(),
  type: z.string().min(1),
  stock: z.string().min(1),
  quantity: z.number(),
})

export interface Portifolio {
  stock: string
  avgPrice: number
  quantity: number
  total: number
  marketPrice: number
}
