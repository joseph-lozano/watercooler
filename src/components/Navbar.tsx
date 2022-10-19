import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { env } from "../env/client.mjs";

const workspaceName = env.NEXT_PUBLIC_WORKSPACE_NAME;

export default function Navbar() {
  const { data: sessionData } = useSession();

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost text-xl normal-case" href="/">
          {workspaceName}
        </Link>
      </div>
      <div className="flex-none gap-2">
        {sessionData?.user ? (
          <UserProfileMenu userId={sessionData.user.id} />
        ) : (
          <button className="btn btn-primary" onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}

function UserProfileMenu({ userId }: { userId: string }) {
  return (
    <div className="dropdown-end dropdown">
      <label tabIndex={0} className="avatar btn btn-ghost btn-circle">
        <div className="w-10 rounded-full">
          <Image
            width={40}
            height={40}
            alt="avatar"
            src={`https://robohash.org/${userId}`}
          />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
      >
        <li>
          <Link href="/settings/profile" className="justify-between">
            Profile
          </Link>
        </li>
        <li>
          <button onClick={() => signOut()}>Logout</button>
        </li>
      </ul>
    </div>
  );
}
