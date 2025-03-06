export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  isPresent: boolean;
  lastStatusChange: string;
  location: string;
  memoIds: string[];
  expectedReturn?: string; // `?` を追加
}
