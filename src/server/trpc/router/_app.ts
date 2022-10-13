// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { postsRouter } from "./postsRouter";

export const appRouter = router({
  foo: exampleRouter,
  auth: authRouter,
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
