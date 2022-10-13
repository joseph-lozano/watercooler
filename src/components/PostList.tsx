import { trpc } from "../utils/trpc";

export default function PostList() {
  const { data: posts, isLoading } = trpc.posts.getRecentPosts.useQuery();

  if (isLoading || !posts) {
    return <div>Loading....</div>;
  }

  return (
    <div className="flex w-full flex-col space-y-5">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          email={post.user.email}
          content={post.content}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
}

type PostItemProps = {
  email: string;
  content: string;
  createdAt: Date;
};

function PostItem({ email, content, createdAt }: PostItemProps) {
  const secondsAgo = createdAt.getTime() / 1000 - new Date().getTime() / 1000;
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{email}</h2>
        <p>{content}</p>
        <span className="text-right opacity-50">{timeAgo(createdAt)} ago</span>
      </div>
    </div>
  );
}

// format time ago string
function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}
