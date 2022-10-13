import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const postsRouter = router({
  createPost: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          userId: userId,
        },
      });
    }),
});
