"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, History } from "lucide-react";
import {
  checkIn,
  checkOut,
  getUserInfo,
  getAttendanceHistory,
} from "@/lib/actions";
import type { AttendanceRecord, UserData } from "@/lib/types";
import Header from "@/components/header";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserInfo();
        setUserData(userData);

        const history = await getAttendanceHistory();
        setAttendanceHistory(history);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleCheckIn = async () => {
    try {
      await checkIn();
      setIsCheckedIn(true);
      // Refresh attendance history
      const history = await getAttendanceHistory();
      setAttendanceHistory(history);
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      setIsCheckedIn(false);
      // Refresh attendance history
      const history = await getAttendanceHistory();
      setAttendanceHistory(history);
    } catch (error) {
      console.error("Check-out failed:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <ClipLoader />
      </div>
    );
  }
  if (!isSignedIn) {
    return <p>ログインしてください</p>;
  }

  if (!user) {
    return null; // This should not happen due to the redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userData?.avatarUrl} alt={userData?.name} />
                  <AvatarFallback>{userData?.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{userData?.name}</h2>
                  <p className="text-muted-foreground">{userData?.role}</p>
                  <div className="mt-2">
                    {isCheckedIn ? (
                      <Badge className="bg-green-500">在室中</Badge>
                    ) : (
                      <Badge variant="outline">不在</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>在室管理</CardTitle>
              <CardDescription>研究室への入退室を記録します</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Button
                  className="flex-1"
                  onClick={handleCheckIn}
                  disabled={isCheckedIn}
                >
                  入室
                </Button>
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleCheckOut}
                  disabled={!isCheckedIn}
                >
                  退室
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>現在の状況</CardTitle>
              <CardDescription>現在の時間と在室状況</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">
                    {new Date().toLocaleTimeString("ja-JP", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="history">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">
                <History className="h-4 w-4 mr-2" />
                入退室履歴
              </TabsTrigger>
              <TabsTrigger value="members">
                <Users className="h-4 w-4 mr-2" />
                メンバー状況
              </TabsTrigger>
            </TabsList>
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>入退室履歴</CardTitle>
                  <CardDescription>あなたの過去の入退室記録</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attendanceHistory.length > 0 ? (
                      attendanceHistory.map((record, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b pb-3"
                        >
                          <div>
                            <p className="font-medium">{record.date}</p>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                              <span>入室: {record.checkIn || "記録なし"}</span>
                              <span>退室: {record.checkOut || "記録なし"}</span>
                            </div>
                          </div>
                          <Badge
                            variant={record.checkOut ? "outline" : "default"}
                          >
                            {record.checkOut ? "完了" : "在室中"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        履歴がありません
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="members" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>メンバー状況</CardTitle>
                  <CardDescription>
                    現在の研究室メンバーの在室状況
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userData?.labMembers && userData.labMembers.length > 0 ? (
                      userData.labMembers.map((member, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b pb-3"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={member.avatarUrl}
                                alt={member.name}
                              />
                              <AvatarFallback>
                                {member.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {member.role}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={member.isCheckedIn ? "default" : "outline"}
                          >
                            {member.isCheckedIn ? "在室中" : "不在"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        メンバー情報がありません
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
