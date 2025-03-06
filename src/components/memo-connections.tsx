"use client";

import { useRef, useState } from "react";
import type { Memo, Connection } from "@/types/memo";
import { X } from "lucide-react";

interface MemoConnectionsProps {
  memos: Memo[];
  connections: Connection[];
  onDeleteConnection: (id: string) => void;
}

export default function MemoConnections({
  memos,
  connections,
  onDeleteConnection,
}: MemoConnectionsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(
    null
  );

  // Get memo center position
  const getMemoCenter = (memo: Memo) => {
    // Memo card width is 256px (w-64) and height is variable, but we can estimate 150px
    return {
      x: memo.position.x + 128, // half of width
      y: memo.position.y + 75, // rough estimate of half height
    };
  };

  // Draw connections between memos
  const renderConnections = () => {
    return connections.map((connection) => {
      const fromMemo = memos.find((memo) => memo.id === connection.fromId);
      const toMemo = memos.find((memo) => memo.id === connection.toId);

      if (!fromMemo || !toMemo) return null;

      const fromCenter = getMemoCenter(fromMemo);
      const toCenter = getMemoCenter(toMemo);

      // Calculate control points for curved line
      const dx = toCenter.x - fromCenter.x;
      const dy = toCenter.y - fromCenter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Make curve more pronounced for longer distances
      const curveOffset = Math.min(distance * 0.2, 100);

      // Calculate perpendicular offset for control point
      const nx = -dy / distance;
      const ny = dx / distance;

      const controlPoint = {
        x: (fromCenter.x + toCenter.x) / 2 + nx * curveOffset,
        y: (fromCenter.y + toCenter.y) / 2 + ny * curveOffset,
      };

      const isHovered = hoveredConnection === connection.id;

      return (
        <g key={connection.id}>
          <path
            d={`M ${fromCenter.x} ${fromCenter.y} Q ${controlPoint.x} ${controlPoint.y} ${toCenter.x} ${toCenter.y}`}
            fill="none"
            stroke={isHovered ? "#3b82f6" : "#94a3b8"}
            strokeWidth={isHovered ? 3 : 2}
            strokeDasharray={isHovered ? "none" : "5,5"}
            onMouseEnter={() => setHoveredConnection(connection.id)}
            onMouseLeave={() => setHoveredConnection(null)}
          />

          {isHovered && (
            <g
              transform={`translate(${
                (fromCenter.x + toCenter.x) / 2 + (nx * curveOffset) / 2
              } ${(fromCenter.y + toCenter.y) / 2 + (ny * curveOffset) / 2})`}
              onClick={() => onDeleteConnection(connection.id)}
              className="cursor-pointer"
            >
              <g
                transform={`translate(${
                  (fromCenter.x + toCenter.x) / 2 + (nx * curveOffset) / 2
                } ${(fromCenter.y + toCenter.y) / 2 + (ny * curveOffset) / 2})`}
                className="cursor-pointer"
              >
                <circle
                  r="14"
                  fill="white"
                  stroke="#3b82f6"
                  onClick={() => onDeleteConnection(connection.id)} // 削除イベントを追加
                  className="cursor-pointer"
                />
                <X
                  size={16}
                  x="-8"
                  y="-8"
                  color="#3b82f6"
                  onClick={() => onDeleteConnection(connection.id)} // 削除イベントを追加
                  className="cursor-pointer"
                />
              </g>
            </g>
          )}
        </g>
      );
    });
  };

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    >
      <g className="pointer-events-auto">{renderConnections()}</g>
    </svg>
  );
}
