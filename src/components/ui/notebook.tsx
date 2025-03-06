import React from "react";
import Link from "next/link";  // Link をインポート
import { MdMenuBook } from "react-icons/md";

const IconButton: React.FC = () => {
  return (
    <Link href="/memo">  {/* Link コンポーネントで遷移先のパスを指定 */}
      <button
        className="relative w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
      >

        <MdMenuBook className="absolute inset-0 m-auto text-gray-600 text-6xl" />
      </button>
    </Link>
  );
};

export default IconButton;


