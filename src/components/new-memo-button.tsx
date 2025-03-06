"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NewMemoButtonProps {
  onCreateMemo: (color: string) => void;
}

export default function NewMemoButton({ onCreateMemo }: NewMemoButtonProps) {
  const [open, setOpen] = useState(false);

  const colors = [
    { name: "デフォルト", value: "white" },
    { name: "赤", value: "red" },
    { name: "緑", value: "green" },
    { name: "青", value: "blue" },
    { name: "黄", value: "yellow" },
    { name: "紫", value: "purple" },
  ];

  const handleCreateMemo = (color: string) => {
    onCreateMemo(color);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          新しいメモ
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color.value}
            onClick={() => handleCreateMemo(color.value)}
            className="gap-2"
          >
            <div
              className={`w-4 h-4 rounded-full border ${
                color.value === "white"
                  ? "bg-white border-gray-300"
                  : `bg-${color.value}-100 border-${color.value}-300`
              }`}
            />
            {color.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
