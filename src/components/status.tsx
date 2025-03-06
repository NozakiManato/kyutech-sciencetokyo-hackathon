"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { AttendanceRecord, UserData } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getAllMembers, getAllAttendanceRecords } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<UserData[]>([]);
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.researchLab.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const allMembers = await getAllMembers();
        setMembers(allMembers);

        const allRecords = await getAllAttendanceRecords();
        setAttendanceRecords(allRecords);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);
  return (
    <div className="flex min-h-screen flex-col">
      <Tabs defaultValue="members">
        <TabsContent value="members" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>在室情報</CardTitle>
              <CardDescription>参加者一覧と状況</CardDescription>
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
                          <div className="flex gap-2 text-sm text-muted-foreground">
                            <span>{member.email}</span>
                            <span>•</span>
                            <span>{member.role}</span>
                            <span>•</span>
                            <span>{member.researchLab}</span>
                            <span>•</span>
                            <span>{member.universityName}</span>
                          </div>
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
                    {searchTerm ? "検索結果がありません" : "メンバーがいません"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
