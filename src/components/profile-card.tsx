"use client";

import { useState } from "react";
import {
  Github,
  Globe,
  Linkedin,
  Mail,
  Twitter,
  Edit,
  Plus,
  Trash,
  Save,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TechSkill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "other";
  level: number; // 1-5
}

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
}

export default function ProfileCard() {
  const defaultProfile: ProfileData = {
    name: "山田 太郎",
    title: "フルスタックエンジニア",
    bio: "5年以上の経験を持つフルスタックエンジニア。Webアプリケーション開発とクラウドインフラに特化しています。",
    avatar: "/placeholder.svg?height=150&width=150",
    location: "東京, 日本",
    email: "yamada@example.com",
    social: {
      github: "https://github.com/yamada-taro",
      twitter: "https://twitter.com/yamada-taro",
      linkedin: "https://linkedin.com/in/yamada-taro",
      website: "https://yamada-taro.dev",
    },
  };

  const defaultTechSkills: TechSkill[] = [
    { id: "1", name: "React", category: "frontend", level: 5 },
    { id: "2", name: "Next.js", category: "frontend", level: 5 },
    { id: "3", name: "TypeScript", category: "frontend", level: 4 },
    { id: "4", name: "Tailwind CSS", category: "frontend", level: 4 },
    { id: "5", name: "HTML/CSS", category: "frontend", level: 5 },
    { id: "6", name: "Node.js", category: "backend", level: 4 },
    { id: "7", name: "Express", category: "backend", level: 4 },
    { id: "8", name: "Python", category: "backend", level: 3 },
    { id: "9", name: "Django", category: "backend", level: 3 },
    { id: "10", name: "PostgreSQL", category: "database", level: 4 },
    { id: "11", name: "MongoDB", category: "database", level: 3 },
    { id: "12", name: "Redis", category: "database", level: 3 },
    { id: "13", name: "Docker", category: "devops", level: 4 },
    { id: "14", name: "AWS", category: "devops", level: 3 },
    { id: "15", name: "CI/CD", category: "devops", level: 3 },
    { id: "16", name: "Git", category: "other", level: 5 },
    { id: "17", name: "GraphQL", category: "other", level: 3 },
    { id: "18", name: "Jest", category: "other", level: 3 },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [techSkills, setTechSkills] = useState<TechSkill[]>(defaultTechSkills);
  const [editMode, setEditMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ProfileData>({
    ...defaultProfile,
  });
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState<Omit<TechSkill, "id">>({
    name: "",
    category: "frontend",
    level: 3,
  });
  const [editingSkill, setEditingSkill] = useState<TechSkill | null>(null);

  const filteredSkills =
    activeTab === "all"
      ? techSkills
      : techSkills.filter((skill) => skill.category === activeTab);

  const handleProfileEdit = () => {
    setEditingProfile({ ...profile });
    setEditMode(true);
  };

  const handleProfileSave = () => {
    setProfile({ ...editingProfile });
    setEditMode(false);
  };

  const handleProfileCancel = () => {
    setEditMode(false);
  };

  const handleAddSkill = () => {
    const id = Math.random().toString(36).substring(2, 9);
    setTechSkills([...techSkills, { id, ...newSkill }]);
    setNewSkill({
      name: "",
      category: "frontend",
      level: 3,
    });
    setIsAddSkillOpen(false);
  };

  const handleEditSkill = (skill: TechSkill) => {
    setEditingSkill(skill);
  };

  const handleSaveEditSkill = () => {
    if (editingSkill) {
      setTechSkills(
        techSkills.map((skill) =>
          skill.id === editingSkill.id ? editingSkill : skill
        )
      );
      setEditingSkill(null);
    }
  };

  const handleDeleteSkill = (id: string) => {
    setTechSkills(techSkills.filter((skill) => skill.id !== id));
  };

  const renderSkillLevel = (level: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-6 rounded-sm ${
              i < level ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const categoryLabels = {
    frontend: "フロントエンド",
    backend: "バックエンド",
    database: "データベース",
    devops: "DevOps",
    other: "その他",
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-end mb-2">
          {!editMode ? (
            <Button variant="outline" size="sm" onClick={handleProfileEdit}>
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              編集
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleProfileCancel}>
                <X className="h-3.5 w-3.5 mr-1.5" />
                キャンセル
              </Button>
              <Button variant="default" size="sm" onClick={handleProfileSave}>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                保存
              </Button>
            </div>
          )}
        </div>

        {!editMode ? (
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24 border-2 border-border">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="text-lg font-medium text-muted-foreground">
                {profile.title}
              </CardDescription>
              <p className="text-sm text-muted-foreground">
                {profile.location}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-xs">{profile.email}</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Github className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Twitter className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Linkedin className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Globe className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={editingProfile.name}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">役職</Label>
                <Input
                  id="title"
                  value={editingProfile.title}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">場所</Label>
                <Input
                  id="location"
                  value={editingProfile.location}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  value={editingProfile.email}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={editingProfile.social.github}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      social: {
                        ...editingProfile.social,
                        github: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={editingProfile.social.twitter}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      social: {
                        ...editingProfile.social,
                        twitter: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={editingProfile.social.linkedin}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      social: {
                        ...editingProfile.social,
                        linkedin: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">ウェブサイト</Label>
                <Input
                  id="website"
                  value={editingProfile.social.website}
                  onChange={(e) =>
                    setEditingProfile({
                      ...editingProfile,
                      social: {
                        ...editingProfile.social,
                        website: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">自己紹介</Label>
              <Textarea
                id="bio"
                value={editingProfile.bio}
                onChange={(e) =>
                  setEditingProfile({ ...editingProfile, bio: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
        )}

        {!editMode && <p className="text-sm mt-4">{profile.bio}</p>}
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">技術スタック</h3>
          <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                スキル追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新しいスキルを追加</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">スキル名</Label>
                  <Input
                    id="skill-name"
                    value={newSkill.name}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, name: e.target.value })
                    }
                    placeholder="例: JavaScript"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-category">カテゴリー</Label>
                  <Select
                    value={newSkill.category}
                    onValueChange={(value: any) =>
                      setNewSkill({ ...newSkill, category: value })
                    }
                  >
                    <SelectTrigger id="skill-category">
                      <SelectValue placeholder="カテゴリーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">フロントエンド</SelectItem>
                      <SelectItem value="backend">バックエンド</SelectItem>
                      <SelectItem value="database">データベース</SelectItem>
                      <SelectItem value="devops">DevOps</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="skill-level">
                      スキルレベル: {newSkill.level}
                    </Label>
                  </div>
                  <Slider
                    id="skill-level"
                    min={1}
                    max={5}
                    step={1}
                    value={[newSkill.level]}
                    onValueChange={(value) =>
                      setNewSkill({ ...newSkill, level: value[0] })
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>初級</span>
                    <span>中級</span>
                    <span>上級</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddSkillOpen(false)}
                >
                  キャンセル
                </Button>
                <Button onClick={handleAddSkill} disabled={!newSkill.name}>
                  追加
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="frontend">フロントエンド</TabsTrigger>
            <TabsTrigger value="backend">バックエンド</TabsTrigger>
            <TabsTrigger value="database">データベース</TabsTrigger>
            <TabsTrigger value="devops">DevOps</TabsTrigger>
            <TabsTrigger value="other">その他</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium">
                      {skill.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {categoryLabels[skill.category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderSkillLevel(skill.level)}
                    <Dialog
                      open={editingSkill?.id === skill.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingSkill(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditSkill(skill)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>スキルを編集</DialogTitle>
                        </DialogHeader>
                        {editingSkill && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-skill-name">スキル名</Label>
                              <Input
                                id="edit-skill-name"
                                value={editingSkill.name}
                                onChange={(e) =>
                                  setEditingSkill({
                                    ...editingSkill,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-skill-category">
                                カテゴリー
                              </Label>
                              <Select
                                value={editingSkill.category}
                                onValueChange={(value: any) =>
                                  setEditingSkill({
                                    ...editingSkill,
                                    category: value,
                                  })
                                }
                              >
                                <SelectTrigger id="edit-skill-category">
                                  <SelectValue placeholder="カテゴリーを選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="frontend">
                                    フロントエンド
                                  </SelectItem>
                                  <SelectItem value="backend">
                                    バックエンド
                                  </SelectItem>
                                  <SelectItem value="database">
                                    データベース
                                  </SelectItem>
                                  <SelectItem value="devops">DevOps</SelectItem>
                                  <SelectItem value="other">その他</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <Label htmlFor="edit-skill-level">
                                  スキルレベル: {editingSkill.level}
                                </Label>
                              </div>
                              <Slider
                                id="edit-skill-level"
                                min={1}
                                max={5}
                                step={1}
                                value={[editingSkill.level]}
                                onValueChange={(value) =>
                                  setEditingSkill({
                                    ...editingSkill,
                                    level: value[0],
                                  })
                                }
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>初級</span>
                                <span>中級</span>
                                <span>上級</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEditingSkill(null)}
                          >
                            キャンセル
                          </Button>
                          <Button onClick={handleSaveEditSkill}>保存</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredSkills.length === 0 && (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  このカテゴリーにはスキルがありません。「スキル追加」ボタンから追加してください。
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <p className="text-xs text-muted-foreground">
          最終更新:{" "}
          {new Date().toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
