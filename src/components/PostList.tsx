import { Post } from "@prisma/client";
import { trpc } from "../utils/trpc";

export default function PostList() {
  const { data: posts, isLoading } = trpc.posts.getRecentPosts.useQuery();

  if (isLoading || !posts) {
    return <div>Loading....</div>;
  }

  return (
    <>
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </>
  );
}

function PostItem({ post }: { post: Post }) {
  return null;
}
