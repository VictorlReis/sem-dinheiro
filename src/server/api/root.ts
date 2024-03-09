import { transactionRouter } from '@/server/api/routers/transaction'
import { createTRPCRouter } from '@/server/api/trpc'
import { investmentTransactionRouter } from './routers/investmentTransactions'
import { categoryRouter } from './routers/category'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transaction: transactionRouter,
  category: categoryRouter,
  investmentTransaction: investmentTransactionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
