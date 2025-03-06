import type { User } from "@/types/user";

// サンプルユーザーデータ
const users: User[] = [
  {
    id: "user1",
    name: "山田太郎",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isPresent: true,
    lastStatusChange: new Date().toISOString(),
    location: "オフィス",
    researchLab: "張研究室",
    universityName: "九工大",
    memoIds: ["1"],
  },
  {
    id: "user2",
    name: "佐藤花子",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isPresent: false,
    lastStatusChange: new Date(Date.now() - 3600000).toISOString(), // 1時間前
    expectedReturn: new Date(Date.now() + 3600000).toISOString(), // 1時間後
    location: "外出中",
    researchLab: "山田研究室",
    universityName: "東科大",
    memoIds: ["2"],
  },
  {
    id: "user3",
    name: "鈴木一郎",
    avatarUrl: "/placeholder.svg?height=40&width=40",
    isPresent: true,
    lastStatusChange: new Date().toISOString(),
    location: "会議室A",
    researchLab: "山脇研究室",
    universityName: "九工大",
    memoIds: ["3"],
  },
];

// API遅延をシミュレート
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 全ユーザーを取得
export async function getAllUsers(): Promise<User[]> {
  await delay(300);
  return [...users];
}

// ユーザーIDでユーザーを取得
export async function getUserById(id: string): Promise<User | undefined> {
  await delay(300);
  return users.find((user) => user.id === id);
}

// ユーザーの在室状態を更新
export async function updateUserPresence(
  userId: string,
  isPresent: boolean,
  location?: string,
  expectedReturn?: string
): Promise<User | undefined> {
  await delay(300);

  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) return undefined;

  const updatedUser = {
    ...users[userIndex],
    isPresent,
    lastStatusChange: new Date().toISOString(),
    location: location || users[userIndex].location,
    expectedReturn: isPresent
      ? undefined
      : expectedReturn || users[userIndex].expectedReturn,
  };

  users[userIndex] = updatedUser;
  return updatedUser;
}

// ユーザーにメモを関連付ける
export async function associateMemoWithUser(
  userId: string,
  memoId: string
): Promise<User | undefined> {
  await delay(300);

  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) return undefined;

  // すでに関連付けられていない場合のみ追加
  if (!users[userIndex].memoIds.includes(memoId)) {
    const updatedUser = {
      ...users[userIndex],
      memoIds: [...users[userIndex].memoIds, memoId],
    };

    users[userIndex] = updatedUser;
    return updatedUser;
  }

  return users[userIndex];
}

// ユーザーからメモの関連付けを解除
export async function dissociateMemoFromUser(
  userId: string,
  memoId: string
): Promise<User | undefined> {
  await delay(300);

  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) return undefined;

  const updatedUser = {
    ...users[userIndex],
    memoIds: users[userIndex].memoIds.filter((id) => id !== memoId),
  };

  users[userIndex] = updatedUser;
  return updatedUser;
}
