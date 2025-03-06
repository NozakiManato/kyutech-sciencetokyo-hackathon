"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { getAllMembers } from "@/lib/actions";
import type { UserData } from "@/lib/types";
import Header from "@/components/header";

export default function StatusPage() {
  const [members, setMembers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const allMembers = await getAllMembers();
        setMembers(allMembers);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();

    // Auto-refresh every minute
    const intervalId = setInterval(fetchMembers, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const presentMembers = members.filter((member) => member.isCheckedIn);
  const absentMembers = members.filter((member) => !member.isCheckedIn);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Badge className="mr-2">在室中</Badge>
                現在の在室者 ({presentMembers.length})
              </CardTitle>
              <CardDescription>現在研究室にいるメンバー</CardDescription>
            </CardHeader>
            <CardContent>
              {presentMembers.length > 0 ? (
                <div className="space-y-4">
                  {presentMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 border-b pb-3"
                    >
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
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
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  現在在室しているメンバーはいません
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Badge variant="outline" className="mr-2">
                  不在
                </Badge>
                不在メンバー ({absentMembers.length})
              </CardTitle>
              <CardDescription>現在研究室にいないメンバー</CardDescription>
            </CardHeader>
            <CardContent>
              {absentMembers.length > 0 ? (
                <div className="space-y-4">
                  {absentMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 border-b pb-3"
                    >
                      <Avatar>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
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
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  全メンバーが在室中です
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  最終更新: {new Date().toLocaleString("ja-JP")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  このページは1分ごとに自動更新されます
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
