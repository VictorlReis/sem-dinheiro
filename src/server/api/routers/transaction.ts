import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { CsvData, createTransactionDto } from '@/dto/transactions.dto'

export const transactionRouter = createTRPCRouter({
  importCsv: protectedProcedure
    .input(z.array(CsvData))
    .mutation(async ({ input, ctx }) => {
      const transactions = input.map((row) => {
        const date = new Date()
        const amount = parseFloat(row.valor.replace('R$', '').replace(',', '.'))

        return {
          description: row.estabelecimento,
          type: 'expense',
          date,
          category: 'other',
          amount,
          userId: ctx.session.user.id,
        }
      })

      return ctx.prisma.transaction.createMany({
        data: transactions,
      })
    }),
  create: protectedProcedure
    .input(createTransactionDto)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.transaction.create({
        data: {
          description: input.description,
          type: input.type,
          date: input.date,
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
