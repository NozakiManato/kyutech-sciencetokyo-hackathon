"use client";

import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

export default function TagFilter({
  allTags,
  selectedTags,
  onTagSelect,
}: TagFilterProps) {
  if (allTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Tag className="h-4 w-4" />
        <span>タグでフィルター:</span>
      </div>

      {allTags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTags.includes(tag) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onTagSelect(tag)}
        >
          #{tag}
        </Badge>
      ))}

      {selectedTags.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-7"
          onClick={() => selectedTags.forEach((tag) => onTagSelect(tag))}
        >
          クリア
        </Button>
      )}
    </div>
  );
}
