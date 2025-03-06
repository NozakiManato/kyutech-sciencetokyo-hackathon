import { notFound } from "next/navigation";
import ProfileCard from "@/components/profile-card";
import { getUserById } from "@/lib/actions";
import { currentUser } from "@clerk/nextjs/server";
import { ProfileData } from "@/components/profile-card";
import Header from "@/components/header";
import { Card } from "@/components/ui/card";
import IconButton from "@/components/ui/notebook";
import Status from "@/components/status";

export default async function UserDashboard(props: {
  params: Promise<{ userId: string }>;
}) {
  const params = await props.params;
  const clerkUser = await currentUser();
  // 既にユーザーデータを取得
  const fetchedUserProfile = getUserById(params.userId);

  let initialProfile: ProfileData;
  if (clerkUser && clerkUser.id === params.userId) {
    initialProfile = {
      id: clerkUser.id,
      name: clerkUser.fullName || "ゲストユーザー",
      title: "修士課程",
      bio: "Next.jsを勉強中です",
      avatar: clerkUser.imageUrl || "/placeholder.svg?height=150&width=150",
      location: "日本, 東京",
      email: clerkUser.primaryEmailAddress?.emailAddress || "メール未設定",
      isCheckedIn: true,
      researchLab: "張研究室",
      universityName: "九工大",
      social: {
        github: "https://github.com/NozakiManato",
        X: "https://twitter.com/",
        linkedin: "https://linkedin.com/in/your-profile",
        website: "https://your-website.dev",
      },
    };
  } else {
    if (!fetchedUserProfile) {
      notFound();
    }
    initialProfile = {
      id: fetchedUserProfile.id,
      name: fetchedUserProfile.name,
      title: fetchedUserProfile.role,
      bio: "モックデータの自己紹介",
      avatar: fetchedUserProfile.avatarUrl,
      location: "未設定",
      email: fetchedUserProfile.email || "tarou@example.com",
      isCheckedIn: fetchedUserProfile.isCheckedIn,
      researchLab: fetchedUserProfile.researchLab,
      universityName: fetchedUserProfile.universityName,
      social: {
        github: "https://github.com/",
        X: "https://twitter.com/",
        linkedin: "https://linkedin.com/",
        website: "https://your-website.dev",
      },
    };
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <Header />
      <main className="container mx-auto py-2">
        <ProfileCard
          initialProfile={initialProfile}
          currentUserId={clerkUser?.id || null}
        />

        <Card className="mt-2">
          <div className="flex justify-evenly items-center gap-4 py-4">
            <div className="flex flex-col gap-2 text-center">
              <IconButton />
              <p className="font-bold">研究</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <IconButton />
              <p className="font-bold">開発</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <IconButton />
              <p className="font-bold">タスク</p>
            </div>
            <div className="flex flex-col gap-2 text-center">
              <IconButton />
              <p className="font-bold">その他</p>
            </div>
          </div>
        </Card>
        <Status />
      </main>
    </div>
  );
}
