import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 flex">
      <Link href={"/"} className="container py-auto px-4">
        <h1 className="text-3xl font-bold">研究室在室管理システム</h1>
      </Link>
      <SignedOut>
        <SignInButton>
          <Button variant="ghost">サインイン</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
