import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { createTransactionDto } from '@/dto/transactions.dto'

export const transactionRouter = createTRPCRouter({
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
      return ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: new Date(input.year, input.month - 1, 1),
          },
        },
      })
    }),
})
