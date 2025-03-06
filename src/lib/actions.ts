"use server";

import type { NewMemberData, UserData, AttendanceRecord } from "./types";
import { mockUsers, mockAttendanceRecords } from "./mock-data";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getUserInfo() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  try {
    const user = await currentUser();
    if (!user) {
      console.error("Failed to fetch user info: user is null");
      return null;
    }
    const mappedUser: UserData = {
      id: user.id,
      name: user.fullName || "No Name",
      email: user.primaryEmailAddress?.emailAddress || "No Email",
      role: (user.publicMetadata.role as string) || "修士１年", // ClerkのPublicMetadataにroleがある想定
      avatarUrl: user.imageUrl,
      isCheckedIn: false, // 初期値はfalse（SupabaseやDBから取得する場合は変更）
    };

    return mappedUser;
  } catch (error) {
    console.error("Failed to fetch user info from Clerk:", error);
    return null;
  }
}

export async function getAllMembers(): Promise<UserData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, you would fetch all members from the database
  return mockUsers;
}

export async function getAttendanceHistory(): Promise<AttendanceRecord[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, you would fetch attendance records for the current user
  // For demo purposes, we'll return records for the first user
  return mockAttendanceRecords.filter(
    (record) => record.userId === mockUsers[0].id
  );
}

export async function getAllAttendanceRecords(): Promise<AttendanceRecord[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, you would fetch all attendance records from the database
  return mockAttendanceRecords;
}

export async function checkIn(): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, you would create a new check-in record in the database
  // and update the user's status
  // For demo purposes, we'll just update our mock data
  const user = mockUsers.find((u) => u.id === mockUsers[0].id);
  if (user) {
    user.isCheckedIn = true;

    // Add a new attendance record
    const today = new Date().toLocaleDateString("ja-JP");
    const now = new Date().toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const existingRecord = mockAttendanceRecords.find(
      (record) => record.userId === user.id && record.date === today
    );

    if (existingRecord) {
      existingRecord.checkIn = now;
    } else {
      mockAttendanceRecords.push({
        id: `record-${Date.now()}`,
        userId: user.id,
        user: user,
        date: today,
        checkIn: now,
        checkOut: null,
      });
    }
  }
}

export async function checkOut(): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // In a real app, you would update the check-out time in the database
  // and update the user's status
  // For demo purposes, we'll just update our mock data
  const user = mockUsers.find((u) => u.id === mockUsers[0].id);
  if (user) {
    user.isCheckedIn = false;

    // Update the latest attendance record
    const today = new Date().toLocaleDateString("ja-JP");
    const now = new Date().toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const existingRecord = mockAttendanceRecords.find(
      (record) => record.userId === user.id && record.date === today
    );

    if (existingRecord) {
      existingRecord.checkOut = now;
    }
  }
}

export async function addNewMember(data: NewMemberData): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, you would create a new user in the database
  // For demo purposes, we'll just add to our mock data
  const newUser: UserData = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: data.role,
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCheckedIn: false,
  };

  mockUsers.push(newUser);
}
