"use client";

import { useState } from "react";
import StudyTimer from "../../components/study-timer";
import UserGrid from "../../components/user-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

// Mock data for other users
const mockUsers = [
  { id: 1, name: "Yuki", studyTimeMinutes: 45, currentMinutes: 30 },
  { id: 2, name: "Hana", studyTimeMinutes: 60, currentMinutes: 15 },
  { id: 3, name: "Ren", studyTimeMinutes: 30, currentMinutes: 25 },
  { id: 4, name: "Mei", studyTimeMinutes: 90, currentMinutes: 60 },
  { id: 5, name: "Kai", studyTimeMinutes: 25, currentMinutes: 10 },
];

export default function Home() {
  const [studyTimeMinutes, setStudyTimeMinutes] = useState(30);
  const [isStudying, setIsStudying] = useState(false);
  const [currentMinutes, setCurrentMinutes] = useState(studyTimeMinutes);
  const [userName, setUserName] = useState("You");
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

  const handleStartStudy = () => {
    // Reset the timer to the full time before starting
    setCurrentMinutes(studyTimeMinutes);
    setIsStudying(true);
    setShowCompletionDialog(false);
  };

  const handleTimeUpdate = (minutes: number) => {
    setCurrentMinutes(minutes);
    if (minutes <= 0 && isStudying) {
      setIsStudying(false);
      setShowCompletionDialog(true);
    }
  };

  const handleNewSession = () => {
    setShowCompletionDialog(false);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">勉強タイマー</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>あなたの勉強タイマー</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-6 w-full max-w-xs">
              {!isStudying ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">あなたの名前</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="名前を入力してください"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">勉強時間（分）</Label>
                    <Input
                      id="time"
                      type="number"
                      min="0"
                      max="100000"
                      value={studyTimeMinutes}
                      onChange={(e) =>
                        setStudyTimeMinutes(
                          Number.parseInt(e.target.value) || 30
                        )
                      }
                    />
                  </div>
                  <Button className="w-full" onClick={handleStartStudy}>
                    勉強開始
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-2">残り時間</p>
                  <p className="text-2xl font-bold mb-4">
                    {Math.floor(currentMinutes)}:
                    {String(Math.floor((currentMinutes % 1) * 60)).padStart(
                      2,
                      "0"
                    )}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsStudying(false)}
                  >
                    停止
                  </Button>
                </div>
              )}
            </div>
            <StudyTimer
              isActive={isStudying}
              totalMinutes={studyTimeMinutes}
              onTimeUpdate={handleTimeUpdate}
              size={200}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>勉強グループ</CardTitle>
          </CardHeader>
          <CardContent>
            <UserGrid
              users={mockUsers}
              currentUser={{
                id: 0,
                name: userName,
                studyTimeMinutes: studyTimeMinutes,
                currentMinutes: isStudying ? currentMinutes : 0,
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* 勉強完了ダイアログ */}
      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center gap-2">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <span>勉強完了！</span>
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-lg">
              おめでとうございます！{studyTimeMinutes}分の勉強を完了しました。
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-blue-100 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🎉</span>
              </div>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleNewSession}>
              新しい勉強セッションを開始
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
