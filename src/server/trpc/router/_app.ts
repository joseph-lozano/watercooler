// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { postsRouter } from "./postsRouter";
import { userSettingsRouter } from "./userSettingsRouter";

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  userSettings: userSettingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
