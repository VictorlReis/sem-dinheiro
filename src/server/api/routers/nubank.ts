import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import axios from 'axios'
import { type PythonApiTransaction } from '@/dto/transactions.dto'

export const nubankRouter = createTRPCRouter({
  getNubankTransactions: protectedProcedure
    .input(z.object({ month: z.number(), year: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { month, year } = input
      const pythonUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'

      const response = await axios.get(
        `${pythonUrl}/nubank/get_transactions?year=${year}&month=${month}`,
      )

      type apiResponse = {
        transactions: PythonApiTransaction[]
      }

      const responseData = response.data as apiResponse

      if (responseData.transactions.length > 0) {
        const transactions: PythonApiTransaction[] = responseData.transactions
        for (const transaction of transactions) {
          const transactionDate = new Date(transaction.date)

          const existingTransaction = await ctx.prisma.transaction.findFirst({
            where: {
              date: transactionDate,
              userId: ctx.session.user.id,
            },
          })

          if (!existingTransaction) {
            await ctx.prisma.transaction.create({
              data: {
                description: transaction.description,
                type: transaction.type,
                date: transactionDate,
                category: transaction.category,
                amount: transaction.amount / 100.0,
                userId: ctx.session.user.id,
              },
            })
          } else {
            console.log(
              `Transaction with date ${transaction.date.toString()} already exists.`,
            )
          }
        }
      }
    }),
})
