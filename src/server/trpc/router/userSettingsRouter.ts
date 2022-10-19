import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userSettingsRouter = router({
  getUserSettingsProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.userProfile.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  upsertUserSettingsProfile: protectedProcedure
    .input(
      z.object({
        fullName: z.string(),
        displayName: z.string(),
        bio: z.string(),
        title: z.string(),
        pronouns: z.string(),
        namePronunciation: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.userProfile.upsert({
        where: {
          userId: userId,
        },
        create: {
          userId: ctx.session.user.id,
          ...input,
        },
        update: {
          ...input,
        },
      });
    }),
});
