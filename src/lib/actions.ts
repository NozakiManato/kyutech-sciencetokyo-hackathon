"use server"

import type { LoginCredentials, LoginResult, NewMemberData, User, AdminUser, AttendanceRecord } from "./types"
import { mockUsers, mockAdmins, mockAttendanceRecords } from "./mock-data"

// In a real application, these would interact with a database
// For this demo, we're using mock data

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  // Simulate authentication delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you would verify credentials against a database
  // For demo purposes, we'll accept any email that exists in our mock data
  const user = mockUsers.find((u) => u.email === credentials.email)

  if (user) {
    return { success: true }
  }

  return { success: false, message: "Invalid credentials" }
}

export async function adminLogin(credentials: LoginCredentials): Promise<LoginResult> {
  // Simulate authentication delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you would verify admin credentials against a database
  const admin = mockAdmins.find((a) => a.email === credentials.email)

  if (admin) {
    return { success: true }
  }

  return { success: false, message: "Invalid admin credentials" }
}

export async function getUserInfo(): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, you would get the current user from the session
  // For demo purposes, we'll return the first user from our mock data
  const user = { ...mockUsers[0] }

  // Add other lab members for display in the dashboard
  user.labMembers = mockUsers.filter((u) => u.id !== user.id)

  return user
}

export async function getAdminInfo(): Promise<AdminUser | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, you would get the current admin from the session
  // For demo purposes, we'll return the first admin from our mock data
  return mockAdmins[0]
}

export async function getAllMembers(): Promise<User[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, you would fetch all members from the database
  return mockUsers
}

export async function getAttendanceHistory(): Promise<AttendanceRecord[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, you would fetch attendance records for the current user
  // For demo purposes, we'll return records for the first user
  return mockAttendanceRecords.filter((record) => record.userId === mockUsers[0].id)
}

export async function getAllAttendanceRecords(): Promise<AttendanceRecord[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, you would fetch all attendance records from the database
  return mockAttendanceRecords
}

export async function checkIn(): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, you would create a new check-in record in the database
  // and update the user's status
  // For demo purposes, we'll just update our mock data
  const user = mockUsers.find((u) => u.id === mockUsers[0].id)
  if (user) {
    user.isCheckedIn = true

    // Add a new attendance record
    const today = new Date().toLocaleDateString("ja-JP")
    const now = new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })

    const existingRecord = mockAttendanceRecords.find((record) => record.userId === user.id && record.date === today)

    if (existingRecord) {
      existingRecord.checkIn = now
    } else {
      mockAttendanceRecords.push({
        id: `record-${Date.now()}`,
        userId: user.id,
        user: user,
        date: today,
        checkIn: now,
        checkOut: null,
      })
    }
  }
}

export async function checkOut(): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, you would update the check-out time in the database
  // and update the user's status
  // For demo purposes, we'll just update our mock data
  const user = mockUsers.find((u) => u.id === mockUsers[0].id)
  if (user) {
    user.isCheckedIn = false

    // Update the latest attendance record
    const today = new Date().toLocaleDateString("ja-JP")
    const now = new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })

    const existingRecord = mockAttendanceRecords.find((record) => record.userId === user.id && record.date === today)

    if (existingRecord) {
      existingRecord.checkOut = now
    }
  }
}

export async function addNewMember(data: NewMemberData): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you would create a new user in the database
  // For demo purposes, we'll just add to our mock data
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    role: data.role,
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCheckedIn: false,
  }

  mockUsers.push(newUser)
}

