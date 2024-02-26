import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import {
  CsvData,
  createTransactionDto,
  insertTransaction,
} from '@/dto/transactions.dto'
import OpenAI from 'openai'

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
  insertWithAi: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const openai = new OpenAI({
        apiKey: process.env.OPENAIKEY,
      })

      const prompt = `Interpret the entered data delimited by triple quotes and transform it into JSON with the following key/value properties: { "description": string; "value": int; }
If there is more than one output, return an array of JSONs.
Examples:
Input: supermercado 15.90
Output: { "description": "supermercado", "value": 15.90 }
Input: guitar 110.90
Output: { "description": "guitar", "value": 110.90 }
Input: mcdonalds 59.90  supermercado R$11.30 wjoid 30.99
Output: [{ "description": "mcdonalds", "value": 59.90 }, { "description": "supermercado", "value": 11.30 }, { "description": "wjoid", "value": 30.99 }]
Input: headset 240.90 ifood 50 churrasco 39.90
Output: [{"description": "headset",  "value": 240.90 }, {"description": "ifood", val: 50.00 }, {"description": "churrasco", "value": 39.90}]
Input: Data;Estabelecimento;Portador;Valor;Parcela
08/02/2024;FD*food.COM AGENCIA DE;VICTOR REIS;R$ 4,95;-
18/02/2024;Uno   *Noy   *TRIP;VICTOR REIS;R$ 14,88;-
29/01/2024;MYPASS;VICTOR REIS;R$ 89,90;-
Output: [{"description": "IFD*IFOOD.COM", "value": 4.95}, {"description": "ybe *ybe *trip", "value": 14.88},  {"description": "TOTALPASS", "value": 89.90}
The output should not contains spaces or \\n, it should be an array of JSONs.
"""${input}"""`

      const response = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
      })

      console.log(response)

      try {
        if (response.choices[0]) {
          const responseString = response.choices[0].message?.content
          if (!responseString) return false
          const responseObject = JSON.parse(responseString)
          console.log(responseObject)

          const transactions = responseObject.map(
            (value: { description: string; value: number }) => {
              const date = new Date()

              return {
                description: value.description,
                type: 'expense',
                date,
                category: 'other',
                amount: value.value,
                userId: ctx.session.user.id,
              }
            },
          )

          return ctx.prisma.transaction.createMany({
            data: transactions,
          })
        }
      } catch (error) {
        console.error(error)
      }
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
