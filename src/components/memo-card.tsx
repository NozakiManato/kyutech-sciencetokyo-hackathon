"use client";

import { useState, useEffect, useRef } from "react";
import { Trash, TagIcon, Link2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, PanInfo } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/types/user";
import type { Memo } from "@/types/memo";

interface MemoCardProps {
  memo: Memo;
  onUpdate: (memo: Memo) => void;
  onDelete: (id: string) => void;
  onDrag: (id: string, info: PanInfo) => void;
  onDragEnd: (id: string) => void;
  scale: number;
  isConnecting: boolean;
  isConnectingFrom: boolean;
  onStartConnecting: (id: string) => void;
  onFinishConnecting: (id: string) => void;
  users?: User[];
  onAssignUser?: (memoId: string, userId: string) => void;
}

export default function MemoCard({
  memo,
  onUpdate,
  onDelete,
  onDrag,
  onDragEnd,
  scale,
  isConnecting,
  isConnectingFrom,
  onStartConnecting,
  onFinishConnecting,
  users = [],
  onAssignUser,
}: MemoCardProps) {
  const [content, setContent] = useState(memo.content);
  const [isEditing, setIsEditing] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // メモに関連付けられたユーザーを取得
  const assignedUsers = users.filter((user) =>
    memo.assignedUserIds?.includes(user.id)
  );

  // Update local content when memo changes (from other users)
  useEffect(() => {
    if (!isEditing) {
      setContent(memo.content);
    }
  }, [memo.content, isEditing]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Focus tag input when tag input is shown
  useEffect(() => {
    if (showTagInput && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [showTagInput]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (content !== memo.content) {
      onUpdate({
        ...memo,
        content,
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !memo.tags.includes(newTag.trim())) {
      const updatedMemo = {
        ...memo,
        tags: [...memo.tags, newTag.trim()],
        lastUpdated: new Date().toISOString(),
      };
      onUpdate(updatedMemo);
      setNewTag("");
    }
    setShowTagInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedMemo = {
      ...memo,
      tags: memo.tags.filter((tag) => tag !== tagToRemove),
      lastUpdated: new Date().toISOString(),
    };
    onUpdate(updatedMemo);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && showTagInput) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!isEditing) {
      onDrag(memo.id, info);
    }
  };

  const handleDragEnd = () => {
    if (!isEditing) {
      onDragEnd(memo.id);
    }
  };

  const handleCardClick = () => {
    if (isConnecting && !isConnectingFrom) {
      onFinishConnecting(memo.id);
    }
  };

  const handleAssignUser = (userId: string) => {
    if (onAssignUser) {
      onAssignUser(memo.id, userId);
    }
  };

  // Format the date to a readable string
  const formattedDate = new Date(memo.lastUpdated).toLocaleString("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get background and text colors based on memo color
  const getBgColor = () => {
    switch (memo.color) {
      case "red":
        return "bg-red-100";
      case "green":
        return "bg-green-100";
      case "blue":
        return "bg-blue-100";
      case "yellow":
        return "bg-yellow-100";
      case "purple":
        return "bg-purple-100";
      default:
        return "bg-white";
    }
  };

  const getBorderColor = () => {
    switch (memo.color) {
      case "red":
        return "border-red-300";
      case "green":
        return "border-green-300";
      case "blue":
        return "border-blue-300";
      case "yellow":
        return "border-yellow-300";
      case "purple":
        return "border-purple-300";
      default:
        return "border-gray-300";
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`absolute rounded-lg shadow-md border ${getBgColor()} ${getBorderColor()} overflow-hidden flex flex-col w-64 ${
        isConnecting ? "cursor-pointer" : ""
      } ${isConnectingFrom ? "ring-2 ring-blue-500" : ""}`}
      style={{
        left: memo.position.x,
        top: memo.position.y,
        zIndex: isEditing ? 10 : 1,
      }}
      drag={!isEditing && !isConnecting}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
    >
      {/* 担当者アバター表示 */}
      {assignedUsers.length > 0 && (
        <div className="absolute -top-2 -right-2 flex -space-x-2">
          {assignedUsers.map((user) => (
            <Avatar key={user.id} className="h-8 w-8 border-2 border-white">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-xs">
                {user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      )}

      <div className="p-4 flex-grow">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onBlur={handleBlur}
            className="w-full h-full min-h-[120px] bg-transparent resize-none focus:outline-none"
            placeholder="メモを入力してください..."
          />
        ) : (
          <div
            onClick={() => !isConnecting && setIsEditing(true)}
            className="w-full h-full min-h-[120px] cursor-text whitespace-pre-wrap break-words"
          >
            {content || (
              <span className="text-gray-400">メモを入力してください...</span>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-white/50 border-t border-gray-200">
        <div className="flex flex-wrap gap-1 mb-2">
          {memo.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-800"
            >
              #{tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </span>
          ))}

          {showTagInput ? (
            <div className="flex items-center">
              <Input
                ref={tagInputRef}
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleAddTag}
                placeholder="新しいタグ..."
                className="text-xs h-6 w-24"
              />
            </div>
          ) : (
            <button
              onClick={() => setShowTagInput(true)}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <TagIcon className="w-3 h-3 mr-1" />
              タグを追加
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formattedDate}</span>
          <div className="flex gap-1">
            {/* 担当者割り当てドロップダウン */}
            {users.length > 0 && onAssignUser && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-blue-500"
                    title="担当者を割り当て"
                  >
                    <UserPlus className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {users.map((user) => (
                    <DropdownMenuItem
                      key={user.id}
                      onClick={() => handleAssignUser(user.id)}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      <Badge
                        variant={user.isPresent ? "default" : "outline"}
                        className="ml-auto text-xs"
                      >
                        {user.isPresent ? "在室" : "不在"}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStartConnecting(memo.id)}
              className="h-6 w-6 text-gray-400 hover:text-blue-500"
              title="他のメモと接続"
            >
              <Link2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(memo.id)}
              className="h-6 w-6 text-gray-400 hover:text-red-500"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
