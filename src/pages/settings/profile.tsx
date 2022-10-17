import { useForm } from "react-hook-form";

export default function SettingsProfilePage() {
  const { register, handleSubmit } = useForm();
  return (
    <>
      <div className="py-10"></div>
      <div className="flex justify-center">
        <div className="card w-full max-w-2xl flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="card-title">Profile Settings</div>
            <form onSubmit={handleSubmit((data) => console.log({ data }))}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Full name"
                  {...register("fullName")}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Display Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Display name"
                  {...register("displayName")}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    How do pronounce your name?
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Name pronounciation"
                  {...register("namePronunciation")}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Your Title"
                  {...register("title")}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Pronouns</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="Your Pronouns"
                  {...register("pronouns")}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32 w-full resize-none text-[16px]"
                  placeholder="Bio"
                  {...register("bio")}
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
