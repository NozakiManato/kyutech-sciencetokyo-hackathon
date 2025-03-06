export interface Position {
  x: number;
  y: number;
}

export interface Memo {
  id: string;
  content: string;
  tags: string[];
  color: string;
  position: Position;
  lastUpdated: string;
  assignedUserIds?: string[];
}

export interface Connection {
  id: string;
  fromId: string;
  toId: string;
}
