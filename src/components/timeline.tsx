import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";
import PostList from "./PostList";

type Inputs = {
  content: string;
};

export default function Timeline() {
  return (
    <>
      <div className="py-12"></div>
      <div className="flex flex-col items-center space-y-6">
        <div className="flex w-full justify-center lg:w-1/2">
          <PostInput />
        </div>
        <div>
          <PostList />
        </div>
      </div>
    </>
  );
}

function PostInput() {
  const { register, handleSubmit } = useForm<Inputs>();
  const { mutate } = trpc.posts.createPost.useMutation();
  const submitPost: SubmitHandler<Inputs> = ({ content }) => {
    console.log("Post: ", content);
    mutate({ content });
  };
  return (
    <form
      onSubmit={handleSubmit(submitPost)}
      className="flex w-10/12 flex-col items-end space-y-5"
    >
      <textarea
        placeholder="What's on your mind?"
        className="textarea textarea-ghost h-32 w-full resize-none text-xl"
        {...register("content")}
      />
      <button type="submit" className="btn btn-primary btn-lg w-full">
        Post
      </button>
    </form>
  );
}
