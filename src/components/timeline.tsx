import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

type Inputs = {
  content: string;
};

export default function Timeline() {
  const { register, handleSubmit } = useForm<Inputs>();
  const { mutate } = trpc.posts.createPost.useMutation();

  const submitPost: SubmitHandler<Inputs> = ({ content }) => {
    console.log("Post: ", content);
    mutate({ content });
  };
  return (
    <>
      <div className="py-12"></div>
      <div className="flex justify-center">
        <div className="flex w-full justify-center lg:w-1/2">
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
        </div>
      </div>
    </>
  );
}
