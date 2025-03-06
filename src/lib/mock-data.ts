import type { UserData, AdminUser, AttendanceRecord } from "./types";

// Mock users for demonstration
export const mockUsers: UserData[] = [
  {
    id: "user-1",
    name: "山田 太郎",
    email: "yamada@lab.example.com",
    role: "博士課程",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCheckedIn: true,
    researchLab: "張研究室",
    universityName: "九工大",
  },
  {
    id: "user-2",
    name: "佐藤 花子",
    email: "sato@lab.example.com",
    role: "修士課程",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCheckedIn: true,
    researchLab: "山田研究室",
    universityName: "東科大",
  },
  {
    id: "user-3",
    name: "鈴木 一郎",
    email: "suzuki@lab.example.com",
    role: "学部生",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCheckedIn: true,
    researchLab: "山脇研究室",
    universityName: "九工大",
  },
  {
    id: "user-4",
    name: "田中 健太",
    email: "tanaka@lab.example.com",
    role: "助教",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCheckedIn: true,
    researchLab: "鈴木研究室",
    universityName: "東科大",
  },
  {
    id: "user-5",
    name: "伊藤 美咲",
    email: "ito@lab.example.com",
    role: "修士課程",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCheckedIn: false,
    researchLab: "芹川研究室",
    universityName: "九工大",
  },
  {
    id: "user-6",
    name: "東京 太郎",
    email: "tokyo@lab.example.com",
    role: "修士課程",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isCheckedIn: false,
    researchLab: "芹川研究室",
    universityName: "九工大",
  },
];

// Mock admins for demonstration
export const mockAdmins: AdminUser[] = [
  {
    id: "admin-1",
    name: "高橋 教授",
    email: "admin@lab.example.com",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isAdmin: true,
  },
];

// Generate some mock attendance records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "record-1",
    userId: "user-1",
    user: mockUsers[0],
    date: new Date().toLocaleDateString("ja-JP"),
    checkIn: "09:15",
    checkOut: null,
  },
  {
    id: "record-2",
    userId: "user-2",
    user: mockUsers[1],
    date: new Date().toLocaleDateString("ja-JP"),
    checkIn: "10:30",
    checkOut: "15:45",
  },
  {
    id: "record-3",
    userId: "user-3",
    user: mockUsers[2],
    date: new Date().toLocaleDateString("ja-JP"),
    checkIn: "08:45",
    checkOut: null,
  },
  {
    id: "record-4",
    userId: "user-1",
    user: mockUsers[0],
    date: new Date(Date.now() - 86400000).toLocaleDateString("ja-JP"), // Yesterday
    checkIn: "09:30",
    checkOut: "18:15",
  },
  {
    id: "record-5",
    userId: "user-1",
    user: mockUsers[0],
    date: new Date(Date.now() - 172800000).toLocaleDateString("ja-JP"), // 2 days ago
    checkIn: "10:00",
    checkOut: "17:30",
  },
];
