import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-200 pb-16">
      <Navbar />
      {children}
    </div>
  );
}
