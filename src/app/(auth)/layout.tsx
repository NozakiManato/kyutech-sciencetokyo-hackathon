import Header from "@/components/header";

export default function RootAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen items-center justify-center">
      <Header />
      {children}
    </div>
  );
}
