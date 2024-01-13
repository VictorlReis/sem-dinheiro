"use client"

import { Transaction } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

export const Columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Descricao",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
