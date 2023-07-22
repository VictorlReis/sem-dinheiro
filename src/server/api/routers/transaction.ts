import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { createTransactionDto } from '@/dto/transactions.dto'
import * as fs from 'fs'
import { type Transaction } from '.prisma/client'

const processCsvTransactions = (csvText: string, userId: string) => {
  const lines = csvText.split('\n')

  const transactions = []

  // Start from index 1 to skip the header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim()

    if (line === '' || !line) {
      continue // Skip empty lines
    }

    const columns = line.split(';')

    const csvTransaction = {
      Data: columns[0],
      Estabelecimento: columns[1],
      Portador: columns[2],
      Valor: columns[3],
      Parcela: columns[4],
    }

    const textValue = csvTransaction.Valor?.replace('R$ ', '')
      .replace('.', '')
      .replace(',', '.')
      .trim()
    if (!textValue || textValue?.includes('-')) {
      continue // Skip negative values
    }

    const valor = parseFloat(textValue)

    if (isNaN(valor) || valor < 0) {
      continue // Skip invalid or negative values
    }
    if (!csvTransaction.Estabelecimento) {
      continue // Skip transactions without description
    }

    const transaction = {
      description: csvTransaction.Estabelecimento,
      type: 'expense',
      date: new Date(),
      category: 'xp csv',
      amount: valor,
      userId: userId,
      paymentMethod: 'xp csv',
    }

    transactions.push(transaction)
  }

  return transactions
}

export const transactionRouter = createTRPCRouter({
  importCsv: protectedProcedure
    .input(z.object({ file: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const filePath = input.file
      try {
        const csvText = fs.readFileSync(filePath, 'utf-8')
        const transactions = processCsvTransactions(
          csvText,
          ctx.session.user.id,
        )
        await ctx.prisma.transaction.createMany({
          data: transactions,
        })

        return 'CSV file imported successfully.'
      } catch (error) {
        console.error('Error importing CSV file:', error)
        throw new Error('Failed to import CSV file.')
      }
    }),

  create: protectedProcedure
    .input(createTransactionDto)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.create({
        data: {
          description: input.description,
          type: input.type,
          date: input.date,
          paymentMethod: input.paymentMethod,
          category: input.category,
          amount: input.amount,
          userId: ctx.session.user.id,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.delete({
        where: {
          id: input.id,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        description: z.string(),
        id: z.string(),
        type: z.string(),
        date: z.date(),
        paymentMethod: z.string(),
        category: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.update({
        where: {
          id: input.id,
        },
        data: {
          description: input.description,
          type: input.type,
          date: input.date,
          paymentMethod: input.paymentMethod,
          category: input.category,
          amount: input.amount,
        },
      })
    }),

  getMonthlyTransactions: protectedProcedure
    .input(z.object({ month: z.number(), year: z.number() }))
    .query(({ input, ctx }) => {
      const { month, year } = input
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0)

      return ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      })
    }),
})
