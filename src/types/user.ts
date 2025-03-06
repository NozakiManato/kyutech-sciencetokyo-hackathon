export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isPresent: boolean;
  lastStatusChange: string;
  location: string;
  researchLab: string;
  universityName: string;

  memoIds: string[];
  expectedReturn?: string;
}
export interface UserData {
  id: string;
  name: string;
  email?: string;
  role: string;
  avatarUrl: string;
  isCheckedIn: boolean;
  researchLab: string;
  universityName: string;
  labMembers?: UserData[]; // For displaying other lab members
}
