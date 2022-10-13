import { useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import PostList from "./PostList";

type Inputs = {
  content: string;
};

export default function Timeline() {
  return (
    <div className="mx-4 w-full lg:w-1/2">
      <div className="py-4 lg:py-12"></div>
      <div className="flex flex-col items-center space-y-6">
        <div className="flex w-full justify-center ">
          <PostInput />
        </div>
        <div className="w-full">
          <PostList />
        </div>
      </div>
    </div>
  );
}

function PostInput() {
  const { reset, register, handleSubmit } = useForm<Inputs>();
  const { data: sessionData } = useSession();
  const utils = trpc.useContext();
  const { mutate } = trpc.posts.createPost.useMutation({
    onMutate: async (newPost) => {
      utils.posts.getRecentPosts.setData((posts) => {
        reset();
        if (!posts) return [newPost];
        return [
          {
            user: { email: sessionData?.user?.email },
            createdAt: new Date(),
            ...newPost,
          },
          ...posts,
        ];
      });
    },
    onSuccess: () => {
      utils.posts.invalidate();
    },
  });
  const submitPost: SubmitHandler<Inputs> = ({ content }) => {
    mutate({ content });
  };
  return (
    <form
      onSubmit={handleSubmit(submitPost)}
      className="flex w-full flex-col items-end space-y-5"
    >
      <textarea
        placeholder="What's on your mind?"
        className="textarea textarea-primary h-32 w-full resize-none text-xl"
        {...register("content")}
      />
      <button type="submit" className="btn btn-primary btn-lg w-full">
        Post
      </button>
    </form>
  );
}
