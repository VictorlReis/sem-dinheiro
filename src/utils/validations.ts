import { insertTransaction } from '../dto/transactions.dto'

export const validateTransactionInsert = (value: unknown) => {
  const result = insertTransaction.safeParse(value)
  return result.success
}
