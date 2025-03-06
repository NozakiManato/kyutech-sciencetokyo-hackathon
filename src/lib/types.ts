export interface UserData {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatarUrl: string;
  isCheckedIn: boolean;
  labMembers?: UserData[]; // For displaying other lab members
}

export interface AdminUser {
  id: string;
  name: string;
  email?: string;
  avatarUrl: string;
  isAdmin: boolean;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  user: UserData;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface NewMemberData {
  name: string;
  email: string;
  role: string;
}

export interface LoginResult {
  success: boolean;
  message?: string;
}
