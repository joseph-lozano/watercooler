import { useSession } from "next-auth/react";
import Image from "next/image";
import { env } from "../env/client.mjs";

const workspaceName = env.NEXT_PUBLIC_WORKSPACE_NAME;

export default function Navbar() {
  const { data: sessionData } = useSession();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl normal-case">{workspaceName}</a>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="avatar btn btn-ghost btn-circle">
            <div className="w-10 rounded-full">
              <Image
                width={40}
                height={40}
                alt="avatar"
                src={`https://robohash.org/${sessionData?.user?.id}`}
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
