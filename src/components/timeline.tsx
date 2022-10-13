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
  const utils = trpc.useContext();
  const { mutate, isLoading } = trpc.posts.createPost.useMutation({
    onSuccess: () => {
      utils.posts.invalidate();
      reset();
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
      <button
        disabled={isLoading}
        type="submit"
        className="btn btn-primary btn-lg w-full"
      >
        Post
      </button>
    </form>
  );
}
