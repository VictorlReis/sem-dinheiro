import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const nubankRouter = createTRPCRouter({
  createNubankAccount: protectedProcedure
    .input(z.object({ login: z.string(), password: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.nubankAccount.create({
        data: {
          login: input.login,
          password: input.password,
          userId: ctx.session.user.id,
        },
      })
    }),
})

