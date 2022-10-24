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
          author={
            post.user.userProfile?.displayName ||
            post.user.userProfile?.fullName ||
            post.user.email ||
            ""
          }
          content={post.displayContent}
          createdAt={post.createdAt}
        />
      ))}
    </div>
  );
}

type PostItemProps = {
  author: string;
  content: string;
  createdAt: Date;
};

function PostItem({ author, content, createdAt }: PostItemProps) {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{author}</h2>
        <p dangerouslySetInnerHTML={{ __html: content }}></p>
        <div className="flex justify-end">
          <span
            className="tooltip opacity-50"
            data-tip={createdAt.toLocaleString()}
          >
            {timeAgo(createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// format time ago string
function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
      -interval,
      "years"
    );
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
      -interval,
      "months"
    );
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
      -interval,
      "days"
    );
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
      -interval,
      "hours"
    );
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
      -interval,
      "minutes"
    );
  }
  return new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(
    -seconds,
    "seconds"
  );
}
