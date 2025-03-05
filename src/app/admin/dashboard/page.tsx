"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogOut, Users, History, UserPlus, Search, Calendar, Download } from "lucide-react"
import { getAdminInfo, getAllMembers, getAllAttendanceRecords, addNewMember } from "@/lib/actions"
import type { AttendanceRecord, User, AdminUser } from "@/lib/types"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [members, setMembers] = useState<User[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // New member form state
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState("")

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminData = await getAdminInfo()
        if (!adminData) {
          router.push("/admin/login")
          return
        }

        setAdmin(adminData)

        const allMembers = await getAllMembers()
        setMembers(allMembers)

        const allRecords = await getAllAttendanceRecords()
        setAttendanceRecords(allRecords)
      } catch (error) {
        console.error("Failed to fetch admin data:", error)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [router])

  const handleLogout = () => {
    // In a real app, you would call a logout function
    router.push("/admin/login")
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await addNewMember({
        name: newMemberName,
        email: newMemberEmail,
        role: newMemberRole,
      })

      // Reset form
      setNewMemberName("")
      setNewMemberEmail("")
      setNewMemberRole("")

      // Refresh member list
      const allMembers = await getAllMembers()
      setMembers(allMembers)
    } catch (error) {
      console.error("Failed to add new member:", error)
    }
  }

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null // This should not happen due to the redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">研究室在室管理システム（管理者）</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={admin.avatarUrl} alt={admin.name} />
                  <AvatarFallback>{admin.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{admin.name}</h2>
                  <p className="text-muted-foreground">管理者</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                メンバー数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{members.length}</div>
              <p className="text-sm text-muted-foreground">登録済みメンバー</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                現在の在室者
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{members.filter((member) => member.isCheckedIn).length}</div>
              <p className="text-sm text-muted-foreground">現在研究室にいるメンバー</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                今日の入室数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {
                  attendanceRecords.filter(
                    (record) => new Date(record.date).toDateString() === new Date().toDateString(),
                  ).length
                }
              </div>
              <p className="text-sm text-muted-foreground">本日の入退室記録</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="members">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              メンバー管理
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <History className="h-4 w-4 mr-2" />
              入退室履歴
            </TabsTrigger>
            <TabsTrigger value="add">
              <UserPlus className="h-4 w-4 mr-2" />
              メンバー追加
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>メンバー管理</CardTitle>
                <CardDescription>研究室メンバーの一覧と状況</CardDescription>
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="メンバーを検索..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <span>{member.email}</span>
                              <span>•</span>
                              <span>{member.role}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={member.isCheckedIn ? "default" : "outline"}>
                          {member.isCheckedIn ? "在室中" : "不在"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      {searchTerm ? "検索結果がありません" : "メンバーがいません"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>入退室履歴</CardTitle>
                <CardDescription>全メンバーの入退室記録</CardDescription>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    CSVダウンロード
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attendanceRecords.length > 0 ? (
                    attendanceRecords.map((record, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={record.user.avatarUrl} alt={record.user.name} />
                            <AvatarFallback>{record.user.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{record.user.name}</p>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <span>{record.date}</span>
                              <span>•</span>
                              <span>入室: {record.checkIn || "記録なし"}</span>
                              <span>•</span>
                              <span>退室: {record.checkOut || "記録なし"}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={record.checkOut ? "outline" : "default"}>
                          {record.checkOut ? "完了" : "在室中"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">履歴がありません</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>新規メンバー追加</CardTitle>
                <CardDescription>研究室の新しいメンバーを登録します</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">氏名</Label>
                    <Input
                      id="name"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">役割</Label>
                    <Input
                      id="role"
                      placeholder="例: 教授、助教、博士課程、修士課程、学部生"
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    メンバーを追加
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

