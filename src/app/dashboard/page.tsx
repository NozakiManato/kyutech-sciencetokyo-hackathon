"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
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
import Status from "@/components/status";
import IconButton from "@/components/ui/notebook";
import ProfileCard from "@/components/profile-card";

export default function DashboardPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(true);
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
        <ProfileCard />

        <div className="flex justify-between px-25 gap-4 py-4">
          <IconButton />
          <IconButton />
          <IconButton />
          <IconButton />
        </div>
        <Status />
      </main>
    </div>
  );
}
