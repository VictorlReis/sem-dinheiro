import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'
import { CsvData, createTransactionBackup, createTransactionDto } from '@/dto/transactions.dto'


export const transactionRouter = createTRPCRouter({
  importCsvBackup: protectedProcedure
    .input(z.array(createTransactionBackup)).mutation(async ({ input, ctx }) => {
      console.log(input);

      const transactions = input.map((row) => {
        // Convert date string to JavaScript Date object with format DD/MM/YYYY
        const dateParts = row.date.split(' ')[0].split('-');
        const jsDate = new Date(
          parseInt(dateParts[0]),
          parseInt(dateParts[1]) - 1, // JavaScript months are 0-based
          parseInt(dateParts[2])
        );

        return {
          description: row.description,
          type: row.type,
          date: jsDate, // Format as DD/MM/YYYY
          paymentMethod: row.paymentMethod,
          category: row.category,
          amount: parseFloat(row.amount),
          userId: ctx.session.user.id,
        };
      });

      try {
        console.log(transactions)
        return await ctx.prisma.transaction.createMany({
          data: transactions,
        });
      } catch (error) {
        console.log(error)
      }
    }),
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
          paymentMethod: 'xp',
          category: 'other',
          amount,
          userId: ctx.session.user.id,
        }
      })

      console.log(transactions);

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
