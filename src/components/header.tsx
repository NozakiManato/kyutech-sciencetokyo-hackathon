import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-6 flex justify-between">
      <Link href={"/"} className="container py-auto px-4">
        <h1 className="text-3xl font-bold">研究室在室管理システム</h1>
      </Link>

      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
