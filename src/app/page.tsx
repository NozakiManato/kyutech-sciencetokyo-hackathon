import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">研究室在室管理システム</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>メンバーログイン</CardTitle>
              <CardDescription>研究室メンバーはこちらからログインしてください</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button className="w-full">ログイン</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>管理者ログイン</CardTitle>
              <CardDescription>管理者はこちらからログインしてください</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/login">
                <Button className="w-full" variant="outline">
                  管理者ログイン
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>在室状況</CardTitle>
              <CardDescription>現在の研究室の在室状況を確認できます</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/status">
                <Button className="w-full" variant="secondary">
                  在室状況を確認
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} 研究室在室管理システム
        </div>
      </footer>
    </div>
  )
}

