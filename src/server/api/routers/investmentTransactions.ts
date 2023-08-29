import {
  Portifolio,
  investmentTransaction,
  updateInvestmentTransaction,
} from '@/dto/transactions.dto'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'
import yahooFinance from 'yahoo-finance2'
import { z } from 'zod'

export const investmentTransactionRouter = createTRPCRouter({
  importCsv: protectedProcedure
    .input(z.array(investmentTransaction))
    .mutation(async ({ input, ctx }) => {
      const transactions = input.map((row) => {
        return {
          ...row,
          quantity: row.type === 'Venda' ? row.quantity * -1 : row.quantity,
          userId: ctx.session.user.id,
        }
      })
      return ctx.prisma.investmentTransaction.createMany({
        data: transactions,
      })
    }),

  create: protectedProcedure
    .input(investmentTransaction)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.investmentTransaction.create({
        data: {
          date: input.date,
          type: input.type,
          stock: input.stock,
          quantity:
            input.type === 'Venda' ? input.quantity * -1 : input.quantity,
          price: input.price,
          userId: ctx.session.user.id,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.investmentTransaction.delete({
        where: {
          id: input.id,
        },
      })
    }),

  update: protectedProcedure
    .input(updateInvestmentTransaction)
    .mutation(({ input, ctx }) => {
      return ctx.prisma.investmentTransaction.update({
        where: {
          id: input.id,
        },
        data: {
          date: input.date,
          type: input.type,
          stock: input.stock,
          quantity:
            input.type === 'Venda' ? input.quantity * -1 : input.quantity,
          price: input.price,
        },
      })
    }),

  getPositions: protectedProcedure.query(async ({ ctx }) => {
    const dbResult: Portifolio[] = await prisma.$queryRaw`
    SELECT 
      stock,
      sum(quantity * price) / sum(quantity) avgPrice, 
      sum(quantity) quantity, 
      sum(quantity * price) total
    FROM InvestmentTransaction
    WHERE userId = ${ctx.session.user.id}
    GROUP BY stock`

    const result: Portifolio[] = []

    for (const res of dbResult) {
      const marketPrice = await yahooFinance.quote(`${res.stock}.SA`)

      result.push({
        ...res,
        marketPrice: marketPrice.regularMarketPrice as unknown as number,
      })
    }

    return result
  }),
})
