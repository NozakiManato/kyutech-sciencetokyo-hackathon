import MemoBoard from "@/components/memo-board";

export default function MemoPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-100">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">メモボード</h1>
        <MemoBoard />
      </div>
    </main>
  );
}
