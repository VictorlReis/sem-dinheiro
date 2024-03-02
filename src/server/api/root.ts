import { transactionRouter } from '@/server/api/routers/transaction'
import { createTRPCRouter } from '@/server/api/trpc'
import { investmentTransactionRouter } from './routers/investmentTransactions'
import { investmentTransaction } from '../../dto/investiments.dto'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  transaction: transactionRouter,
  investmentTransaction: investmentTransactionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
