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
        `${pythonUrl}/nubank/get_transactions_mock?year=${year}&month=${month}`,
      )

      type apiResponse = {
        transactions: PythonApiTransaction[]
      }

      const responseData = response.data as apiResponse

      if (responseData.transactions.length > 0) {
        const transactions: PythonApiTransaction[] = responseData.transactions
        for (const transaction of transactions) {
          await ctx.prisma.transaction.create({
            data: {
              description: transaction.description,
              type: transaction.type,
              date: transaction.date,
              category: transaction.category,
              amount: transaction.amount, //TODO converter o amount
              userId: ctx.session.user.id,
            },
          })
        }
      }
    }),
})
