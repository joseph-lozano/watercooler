import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Timeline from "../components/Timeline";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { status } = useSession();

  if (status == "authenticated") {
    return (
      <>
        <Head>
          <title>Watercooler</title>
          <meta name="description" content="Your workspace watercooler" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex justify-center">
          <Timeline />
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Watercooler</title>
        <meta name="description" content="Your workspace watercooler" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold text-primary">Watercooler</h1>
        <AuthShowcase />
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      {!secretMessage && "You need to be logged in to see this"}
      <button
        className="btn btn-primary"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
