"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { AttendanceRecord, UserData } from "@/lib/types";
import { getAllMembers, getAllAttendanceRecords } from "@/lib/actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState<UserData[]>([]);
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

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.researchLab.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.universityName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group members by university and research lab
  const groupedMembers = filteredMembers.reduce((acc, member) => {
    if (!acc[member.universityName]) {
      acc[member.universityName] = {};
    }
    if (!acc[member.universityName][member.researchLab]) {
      acc[member.universityName][member.researchLab] = [];
    }
    acc[member.universityName][member.researchLab].push(member);
    return acc;
  }, {} as Record<string, Record<string, UserData[]>>);

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6">
      <Tabs defaultValue="members">
        <TabsContent value="members" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold">在室情報</CardTitle>
              <CardDescription className="text-base">
                参加者一覧と状況
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="メンバーを検索..."
                  className="pl-9 py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingState />
              ) : Object.keys(groupedMembers).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.keys(groupedMembers).map((university) => (
                    <UniversitySection
                      key={university}
                      university={university}
                      labGroups={groupedMembers[university]}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState searchTerm={searchTerm} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UniversitySection({
  university,
  labGroups,
}: {
  university: string;
  labGroups: Record<string, UserData[]>;
}) {
  const totalMembers = Object.values(labGroups).flat().length;

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">{university}</h3>
        <Badge variant="secondary" className="font-normal">
          {totalMembers}名
        </Badge>
      </div>
      <div className="space-y-5">
        {Object.keys(labGroups).map((researchLab) => (
          <ResearchLabSection
            key={researchLab}
            researchLab={researchLab}
            members={labGroups[researchLab]}
          />
        ))}
      </div>
    </div>
  );
}

function ResearchLabSection({
  researchLab,
  members,
}: {
  researchLab: string;
  members: UserData[];
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-md text-muted-foreground">
          {researchLab}
        </h4>
        <span className="text-xs text-muted-foreground">
          {members.length}名
        </span>
      </div>
      <div className="space-y-3">
        {members.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member }: { member: UserData }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-md bg-background hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={member.avatarUrl} alt={member.name} />
          <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-medium truncate">{member.name}</p>
          <div className="flex flex-wrap gap-x-2 text-xs text-muted-foreground">
            <span className="truncate max-w-[150px]">{member.email}</span>
            <span className="hidden sm:inline">•</span>
            <span>{member.role}</span>
          </div>
        </div>
      </div>
      <Badge
        variant={member.isCheckedIn ? "default" : "outline"}
        className="ml-2 flex-shrink-0"
      >
        {member.isCheckedIn ? "在室中" : "不在"}
      </Badge>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card rounded-lg border p-4">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-5 w-12" />
          </div>
          <div className="space-y-5">
            {[1, 2].map((j) => (
              <div key={j}>
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((k) => (
                    <div
                      key={k}
                      className="flex justify-between items-center p-3 rounded-md bg-background"
                    >
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">
        {searchTerm ? "検索結果がありません" : "メンバーがいません"}
      </h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        {searchTerm
          ? "検索条件を変更して再度お試しください。"
          : "メンバーが登録されていません。管理画面からメンバーを追加してください。"}
      </p>
    </div>
  );
}
