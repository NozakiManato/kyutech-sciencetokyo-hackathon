"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { PanInfo, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// カスタムフック：データの取得と定期ポーリング
function useBoardData() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [memosData, connectionsData, usersData] = await Promise.all([
        getAllMemos(),
        getAllConnections(),
        getAllUsers(),
      ]);
      // ※ memo.updated を true にしているが必要なら
      setMemos(memosData.map((memo) => ({ ...memo, updated: true })));
      setConnections(connectionsData);
      setUsers(usersData);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { memos, setMemos, connections, setConnections, users, isLoading };
}

export default function MemoBoard() {
  const { memos, setMemos, connections, setConnections, users, isLoading } =
    useBoardData();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingBoard, setIsDraggingBoard] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const filteredMemos = useMemo(() => {
    if (selectedTags.length === 0) {
      return memos;
    }
    return memos.filter((memo) =>
      selectedTags.every((tag) => memo.tags.includes(tag))
    );
  }, [memos, selectedTags]);

  // 全タグをメモから取得
  const allTags = useMemo(
    () => Array.from(new Set(memos.flatMap((memo) => memo.tags))),
    [memos]
  );

  // 新規メモ作成
  const handleCreateMemo = useCallback(
    async (color: string) => {
      try {
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
    },
    [position, scale, setMemos]
  );

  // メモ更新
  const handleUpdateMemo = useCallback(
    async (updatedMemo: Memo) => {
      try {
        await updateMemo(updatedMemo);
        setMemos((prev) =>
          prev.map((memo) => (memo.id === updatedMemo.id ? updatedMemo : memo))
        );
      } catch (error) {
        console.error("Failed to update memo:", error);
      }
    },
    [setMemos]
  );

  // メモ削除と関連接続削除
  const handleDeleteMemo = useCallback(
    async (id: string) => {
      try {
        await deleteMemo(id);

        // 接続の削除
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
    },
    [connections, setMemos, setConnections]
  );

  // タグ選択の切替
  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  // メモドラッグ中の位置更新（座標のみ更新し、更新後の API 通信は dragEnd で行う）
  const handleDragMemo = useCallback(
    (id: string, dragInfo: PanInfo) => {
      setMemos((prev) =>
        prev.map((memo) => {
          if (memo.id === id) {
            return {
              ...memo,
              position: {
                x: memo.position.x + dragInfo.delta.x / scale,
                y: memo.position.y + dragInfo.delta.y / scale,
              },
            };
          }
          return memo;
        })
      );
    },
    [scale, setMemos]
  );

  // ドラッグ終了時に更新情報をサーバへ送信
  const handleDragEnd = useCallback(
    async (id: string) => {
      const memo = memos.find((m) => m.id === id);
      if (memo) {
        await updateMemo(memo);
      }
    },
    [memos]
  );

  // ボードのドラッグ（パン）の処理
  const handleBoardDrag = useCallback(
    (info: PanInfo) => {
      if (isDraggingBoard) {
        setPosition((prev) => ({
          x: prev.x + info.delta.x,
          y: prev.y + info.delta.y,
        }));
      }
    },
    [isDraggingBoard]
  );

  // ズームの処理
  const handleZoom = useCallback((delta: number) => {
    setScale((prev) => {
      const newScale = prev + delta;
      return Math.min(Math.max(0.25, newScale), 2);
    });
  }, []);

  // 接続開始（メモ同士の関連づけ）
  const startConnecting = useCallback((memoId: string) => {
    setConnectingFrom(memoId);
  }, []);

  // 接続終了・接続先選択時の処理
  const finishConnecting = useCallback(
    async (toId: string) => {
      if (connectingFrom && connectingFrom !== toId) {
        try {
          const exists = connections.some(
            (conn) =>
              (conn.fromId === connectingFrom && conn.toId === toId) ||
              (conn.fromId === toId && conn.toId === connectingFrom)
          );
          if (!exists) {
            const newConnection = await createConnection({
              fromId: connectingFrom,
              toId,
            });
            setConnections((prev) => [...prev, newConnection]);
          }
        } catch (error) {
          console.error("Failed to create connection:", error);
        }
      }
      setConnectingFrom(null);
    },
    [connectingFrom, connections, setConnections]
  );

  // 接続削除処理
  const handleDeleteConnection = useCallback(
    async (connectionId: string) => {
      try {
        await deleteConnection(connectionId);
        setConnections((prev) =>
          prev.filter((conn) => conn.id !== connectionId)
        );
      } catch (error) {
        console.error("Failed to delete connection:", error);
      }
    },
    [setConnections]
  );

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
        ref={boardRef}
        className="relative flex-grow overflow-hidden border border-gray-200 rounded-lg bg-gray-50 h-[calc(100vh-200px)]"
        onMouseDown={() => setIsDraggingBoard(true)}
        onMouseUp={() => setIsDraggingBoard(false)}
        onMouseLeave={() => setIsDraggingBoard(false)}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{ scale, x: position.x, y: position.y }}
          drag={isDraggingBoard}
          dragMomentum={false}
          onDrag={(event, info) => handleBoardDrag(info)}
        >
          <MemoConnections
            memos={filteredMemos}
            connections={connections}
            onDeleteConnection={handleDeleteConnection}
          />

          {filteredMemos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              onUpdate={handleUpdateMemo}
              onDelete={handleDeleteMemo}
              onDrag={handleDragMemo}
              onDragEnd={handleDragEnd}
              scale={scale}
              isConnecting={Boolean(connectingFrom)}
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
