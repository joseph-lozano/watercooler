import { escape } from "@utils/string";
import cheerio from "cheerio";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

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
      const { processedContent, ...data } = await processContent(input.content);

      const userId = ctx.session.user.id;
      return ctx.prisma.post.create({
        data: {
          ...data,
          displayContent: processedContent,
          content: input.content,
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
  let processedContent = escape(content);

  for (const link of links) {
    processedContent = replaceWithLink(processedContent, link);
  }

  // TODO: go thru each link util media link or og image
  if (links[0]) {
    const data = await getPreviewData(links[0]);
    return {
      ...data,
      processedContent,
    };
  }

  return {
    previewImage: null,
    previewLink: null,
    previewTitle: null,
    previewDesc: null,
    processedContent,
  };
}

function replaceWithLink(content: string, link: string) {
  const escapedLink = escape(link);
  return content.replaceAll(
    escapedLink,
    `<a class="link link-primary" href="${escapedLink}">${escapedLink}</a>`
  );
}

const SUPPORTED_MIME_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

async function getPreviewData(link: string) {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    try {
      url = new URL(`https://${link}`);
    } catch {
      return {
        previewImage: null,
        previewTitle: null,
        previewDesc: null,
      };
    }
  }
  console.log("------------A");
  let headResponse: Response;
  try {
    headResponse = await fetch(url, { method: "HEAD" });
  } catch {
    return {
      previewImage: null,
      previewTitle: null,
      previewDesc: null,
    };
  }
  console.log("--------------B");
  const contentType = headResponse.headers.get("content-type");
  if (contentType?.startsWith("text/html")) {
    const response = await fetch(url, { method: "GET" });
    const $ = cheerio.load(await response.text());
    return {
      previewImage: $('head meta[property="og:image"]').attr("content") ?? null,
      previewTitle: $('head meta[property="og:title"]').attr("content") ?? null,
      previewDesc:
        $('head meta[property="og:description"]').attr("content") ?? null,
    };
  } else if (SUPPORTED_MIME_TYPES.includes(contentType || "")) {
    return {
      previewImage: url,
      previewTitle: null,
      previewDesc: null,
    };
  } else {
    return {
      previewImage: null,
      previewTitle: null,
      previewDesc: null,
    };
  }
}
