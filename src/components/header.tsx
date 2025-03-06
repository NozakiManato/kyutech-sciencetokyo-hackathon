import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-4 flex items-center justify-between">
      <Link href={"/"}>
        <h1 className="text-3xl font-bold">研究室在室管理システム</h1>
      </Link>
      <SignedOut>
        <SignInButton>
          <Button variant="ghost">サインイン</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex ">
          <Link href={"/dashboard"} className="mr-3">
            <Button variant="ghost">ダッシュボード</Button>
          </Link>
          <UserButton />
        </div>
      </SignedIn>
    </header>
  );
}
