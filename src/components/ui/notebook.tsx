"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Link をインポート
import { LuNotebookPen } from "react-icons/lu";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const IconButton: React.FC = () => {
  const [iconColor, setIconColor] = useState<string>("#000000"); // アイコンの初期色を設定

  useEffect(() => {
    // コンポーネントがマウントされたときにランダムな色を生成
    setIconColor(getRandomColor());
  }, []);

  return (
    <Link href="/memo">
      {" "}
      {/* Link コンポーネントで遷移先のパスを指定 */}
      <button
        className="relative w-34 h-34 bg-blue-50 rounded-lg flex items-center justify-center cursor-pointer
        border-3"
        style={{ borderColor: "#696969" }}
      >
        <LuNotebookPen
          className="absolute inset-0 m-auto text-gray-600 text-6xl"
          style={{ color: iconColor }}
        />
      </button>
    </Link>
  );
};

export default IconButton;
