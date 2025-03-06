import type { Memo, Connection } from "@/types/memo";

// In a real application, this would be a database
let memos: Memo[] = [
  {
    id: "1",
    content:
      "これは最初のメモです。タグを追加してみましょう！\n\nドラッグして移動できます。",
    tags: ["Typescript", "言語"],
    color: "yellow",
    position: { x: 100, y: 100 },
    lastUpdated: new Date().toISOString(),
    assignedUserIds: ["user1"],
  },
  {
    id: "2",
    content:
      "複数人で同時編集できるメモアプリです。\n\n他のメモと接続することもできます。",
    tags: ["その他"],
    color: "blue",
    position: { x: 400, y: 200 },
    lastUpdated: new Date().toISOString(),
    assignedUserIds: ["user2"],
  },
  {
    id: "3",
    content: "ズーム機能を使って、ボード全体を見渡すことができます。",
    tags: ["相談", "機械学習"],
    color: "green",
    position: { x: 200, y: 400 },
    lastUpdated: new Date().toISOString(),
    assignedUserIds: ["user3"],
  },
];

// Store connections between memos
let connections: Connection[] = [
  {
    id: "conn1",
    fromId: "1",
    toId: "2",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Get all memos
export async function getAllMemos(): Promise<Memo[]> {
  await delay(300); // Simulate network delay
  return [...memos];
}

// Create a new memo
export async function createMemo(memo: Omit<Memo, "id">): Promise<Memo> {
  await delay(300);
  const newMemo: Memo = {
    ...memo,
    id: Date.now().toString(), // Generate a unique ID
  };
  memos = [...memos, newMemo];
  return newMemo;
}

// Update an existing memo
export async function updateMemo(updatedMemo: Memo): Promise<Memo> {
  await delay(300);
  memos = memos.map((memo) =>
    memo.id === updatedMemo.id ? updatedMemo : memo
  );
  return updatedMemo;
}

// Delete a memo
export async function deleteMemo(id: string): Promise<void> {
  await delay(300);
  memos = memos.filter((memo) => memo.id !== id);
}

// Get all connections
export async function getAllConnections(): Promise<Connection[]> {
  await delay(300);
  return [...connections];
}

// Create a new connection
export async function createConnection(
  connection: Omit<Connection, "id">
): Promise<Connection> {
  await delay(300);
  const newConnection: Connection = {
    ...connection,
    id: `conn-${Date.now()}`,
  };
  connections = [...connections, newConnection];
  return newConnection;
}

// Delete a connection
export async function deleteConnection(id: string): Promise<void> {
  await delay(300);
  connections = connections.filter((conn) => conn.id !== id);
}
