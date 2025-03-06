"use client";

import { useState, useEffect, useRef } from "react";
import {
  createMemo,
  updateMemo,
  deleteMemo,
  getAllMemos,
  createConnection,
  deleteConnection,
  getAllConnections,
} from "@/lib/memo-service";
import { getAllUsers } from "@/lib/user-service";
import type { Memo, Connection } from "@/types/memo";
import type { User } from "../types/user";
import MemoCard from "./memo-card";
import NewMemoButton from "./new-memo-button";
import TagFilter from "./tag-filter";
import MemoConnections from "./memo-connections";
import { PanInfo, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MemoBoard() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredMemos, setFilteredMemos] = useState<Memo[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Load all memos, connections and users on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memosData, connectionsData, usersData] = await Promise.all([
          getAllMemos(),
          getAllConnections(),
          getAllUsers(),
        ]);
        setMemos((prev) => prev.map((memo) => ({ ...memo, updated: true })));
        setFilteredMemos(memosData);
        setConnections(connectionsData);
        setUsers(usersData);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter memos when selected tags change
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredMemos(memos);
    } else {
      setFilteredMemos(
        memos.filter((memo) =>
          selectedTags.every((tag) => memo.tags.includes(tag))
        )
      );
    }
  }, [selectedTags, memos]);

  // Get all unique tags from memos
  const allTags = Array.from(new Set(memos.flatMap((memo) => memo.tags)));

  const handleCreateMemo = async (color: string) => {
    try {
      // Calculate position for new memo - center of the visible board
      const boardRect = boardRef.current?.getBoundingClientRect();
      const centerX = boardRect
        ? (boardRect.width / 2 - position.x) / scale
        : 100;
      const centerY = boardRect
        ? (boardRect.height / 2 - position.y) / scale
        : 100;

      const newMemo: Omit<Memo, "id"> = {
        content: "",
        tags: [],
        color,
        position: { x: centerX, y: centerY },
        lastUpdated: new Date().toISOString(),
      };

      const createdMemo = await createMemo(newMemo);
      setMemos((prev) => [...prev, createdMemo]);
    } catch (error) {
      console.error("Failed to create memo:", error);
    }
  };

  const handleUpdateMemo = async (updatedMemo: Memo) => {
    try {
      await updateMemo(updatedMemo);
      setMemos((prev) =>
        prev.map((memo) => (memo.id === updatedMemo.id ? updatedMemo : memo))
      );
    } catch (error) {
      console.error("Failed to update memo:", error);
    }
  };

  const handleDeleteMemo = async (id: string) => {
    try {
      await deleteMemo(id);

      // Also delete any connections involving this memo
      const connectionsToDelete = connections.filter(
        (conn) => conn.fromId === id || conn.toId === id
      );

      for (const conn of connectionsToDelete) {
        await deleteConnection(conn.id);
      }

      setMemos((prev) => prev.filter((memo) => memo.id !== id));
      setConnections((prev) =>
        prev.filter((conn) => conn.fromId !== id && conn.toId !== id)
      );
    } catch (error) {
      console.error("Failed to delete memo:", error);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDragMemo = (id: string, dragInfo: PanInfo) => {
    setMemos((prev) =>
      prev.map((memo) => {
        if (memo.id === id) {
          const newPosition = {
            x: memo.position.x + dragInfo.offset.x / scale,
            y: memo.position.y + dragInfo.offset.y / scale,
          };
          if (
            memo.position.x === newPosition.x &&
            memo.position.y === newPosition.y
          ) {
            return memo;
          }
        }
        return memo;
      })
    );
  };

  const handleDragEnd = async (id: string) => {
    const memo = memos.find((m) => m.id === id);
    if (memo) {
      await updateMemo(memo);
    }
  };

  const handleBoardDrag = (info: PanInfo) => {
    if (isDraggingBoard) {
      setPosition((prev) => ({
        x: prev.x + info.delta.x,
        y: prev.y + info.delta.y,
      }));
    }
  };

  const handleZoom = (delta: number) => {
    setScale((prev) => {
      const newScale = prev + delta;
      return Math.min(Math.max(0.25, newScale), 2);
    });
  };

  const startConnecting = (memoId: string) => {
    setConnectingFrom(memoId);
  };

  const finishConnecting = async (toId: string) => {
    if (connectingFrom && connectingFrom !== toId) {
      try {
        // Check if connection already exists
        const exists = connections.some(
          (conn) =>
            (conn.fromId === connectingFrom && conn.toId === toId) ||
            (conn.fromId === toId && conn.toId === connectingFrom)
        );

        if (!exists) {
          const newConnection = await createConnection({
            fromId: connectingFrom,
            toId: toId,
          });
          setConnections((prev) => [...prev, newConnection]);
        }
      } catch (error) {
        console.error("Failed to create connection:", error);
      }
    }
    setConnectingFrom(null);
  };

  const handleDeleteConnection = async (connectionId: string) => {
    try {
      await deleteConnection(connectionId);
      setConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
    } catch (error) {
      console.error("Failed to delete connection:", error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">読み込み中...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex flex-wrap gap-4 items-center justify-between mb-4 z-10 bg-white p-4 rounded-lg shadow-sm">
        <TagFilter
          allTags={allTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom(-0.1)}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleZoom(0.1)}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <NewMemoButton onCreateMemo={handleCreateMemo} />
        </div>
      </div>

      <div
        className="relative flex-grow overflow-hidden border border-gray-200 rounded-lg bg-gray-50 h-[calc(100vh-200px)]"
        onMouseDown={() => setIsDraggingBoard(true)}
        onMouseUp={() => setIsDraggingBoard(false)}
        onMouseLeave={() => setIsDraggingBoard(false)}
        ref={boardRef}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{
            scale,
            x: position.x,
            y: position.y,
          }}
          drag={isDraggingBoard}
          dragMomentum={false}
          //onDrag={handleBoardDrag}
        >
          {/* Render connections between memos */}
          <MemoConnections
            memos={filteredMemos}
            connections={connections}
            onDeleteConnection={handleDeleteConnection}
          />

          {/* Render memos */}
          {filteredMemos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              onUpdate={handleUpdateMemo}
              onDelete={handleDeleteMemo}
              onDrag={handleDragMemo}
              onDragEnd={handleDragEnd}
              scale={scale}
              isConnecting={connectingFrom !== null}
              isConnectingFrom={connectingFrom === memo.id}
              onStartConnecting={startConnecting}
              onFinishConnecting={finishConnecting}
              users={users}
            />
          ))}

          {filteredMemos.length === 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center p-8 bg-white rounded-lg shadow">
              {memos.length === 0
                ? "メモがありません。新しいメモを作成してください。"
                : "選択したタグに一致するメモがありません。"}
            </div>
          )}
        </motion.div>
      </div>

      {connectingFrom && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 p-4 rounded-lg shadow-lg z-50">
          <p className="text-sm font-medium">
            接続先のメモをクリックしてください
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setConnectingFrom(null)}
          >
            キャンセル
          </Button>
        </div>
      )}
    </div>
  );
}
