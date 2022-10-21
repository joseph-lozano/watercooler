import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import cheerio from "cheerio";

export const postsRouter = router({
  getRecentPosts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 20,
      include: {
        user: {
          select: {
            email: true,
            userProfile: { select: { fullName: true, displayName: true } },
          },
        },
      },
    });
  }),
  createPost: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const { mediaLinks, documentLinks, postImage, processedContent } =
        await processContent(input.content);

      const userId = ctx.session.user.id;
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          displayContent: processedContent,
          mediaLinks,
          documentLinks,
          postImage,
          userId: userId,
        },
        include: {
          user: {
            select: {
              email: true,
              userProfile: { select: { fullName: true, displayName: true } },
            },
          },
        },
      });
    }),
});

const LINK_REGEX =
  /(?:(?:https?):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/g;

async function processContent(content: string) {
  const links = content.match(LINK_REGEX) || [];
  // determine if link is media or document
  // youtube and .gif links are media
  // everything else is a document
  const mediaLinks: string[] = [];
  const documentLinks: string[] = [];

  for (const link of links) {
    let url: URL;
    try {
      url = new URL(link);
    } catch (e) {
      url = new URL(`https://${link}`);
    }

    const isYouTube =
      (url.hostname === "youtube.com" || url.hostname === "www.youtube.com") &&
      url.pathname === "/watch";

    if (isYouTube) {
      mediaLinks.push(link);
      continue;
    }
    documentLinks.push(link);
  }

  let postImage: null | string = null;
  if (links[0]) {
    const response = await fetch(links[0], { method: "GET" });
    const $ = cheerio.load(await response.text());
    postImage = $('head meta[property="og:image"]').attr("content") ?? null;
  }

  return { mediaLinks, documentLinks, postImage, processedContent: content };
}
