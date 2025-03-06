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
          <Button variant="ghost" className="cursor-pointer">
            サインイン
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
