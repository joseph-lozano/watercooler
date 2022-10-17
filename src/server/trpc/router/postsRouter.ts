import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const postsRouter = router({
  getRecentPosts: protectedProcedure.query(({ ctx }) => {
    console.log("FETCHING ALL");
    return ctx.prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 20,
      include: {
        user: { select: { email: true } },
      },
    });
  }),
  createPost: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          userId: userId,
        },
        include: {
          user: { select: { email: true } },
        },
      });
    }),
});
