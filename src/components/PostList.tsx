import { Post } from "@prisma/client";
import { trpc } from "../utils/trpc";

export default function PostList() {
  const { data: posts, isLoading } = trpc.posts.getRecentPosts.useQuery();

  if (isLoading || !posts) {
    return <div>Loading....</div>;
  }

  return (
    <div className="flex w-full flex-col space-y-5">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostItem({ post }: { post: Post }) {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Username</h2>
        <p>{post.content}</p>
      </div>
    </div>
  );
}
