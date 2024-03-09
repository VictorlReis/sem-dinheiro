import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const categoryRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    })
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.category.create({
        data: {
          userId: ctx.session.user.id,
          name: input.name,
        },
      })
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.category.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      })
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.category.delete({
        where: {
          id: input.id,
        },
      })
    }),
})
