"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { getUserInfo, getAttendanceHistory } from "@/lib/actions";
import type { AttendanceRecord, UserData } from "@/lib/types";
import { useUser } from "@clerk/nextjs";
import Status from "@/components/status";
import IconButton from "@/components/ui/notebook";
import ProfileCard from "@/components/profile-card";
import { Card } from "@/components/ui/card";
import Header from "@/components/header";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
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
      <main className="container mx-auto py-2">
        <ProfileCard />

        <Card className="mt-2">
          <div className="flex justify-evenly items-center gap-4 py-4">
            <div className="flex flex-col gap-2 text-center">
              <IconButton />
              <p className="font-bold">研究</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <IconButton />
              <p className="font-bold">開発</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <IconButton />
              <p className="font-bold">タスク</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <IconButton />
              <p className="font-bold">その他</p>
            </div>
          </div>
        </Card>
        <Status />
      </main>
    </div>
  );
}
