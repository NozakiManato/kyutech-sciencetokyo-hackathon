"use client";

import { useUser } from "@clerk/nextjs";
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
  Code,
  Database,
  Server,
  Cloud,
  Wrench,
  Search,
  FileCode,
  Layers,
  Cpu,
  GitBranch,
  BarChart,
  Workflow,
  BrainCircuit,
  Boxes,
  Braces,
  Palette,
  MonitorSmartphone,
  Puzzle,
  Atom,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "./ui/badge";

// アイコンマッピング
const techIcons: Record<string, any> = {
  // フロントエンド
  React: Atom,
  "Next.js": Layers,
  Vue: Layers,
  Angular: Layers,
  TypeScript: Code,
  JavaScript: Braces,
  "HTML/CSS": FileCode,
  "Tailwind CSS": Palette,
  Sass: Palette,
  Redux: Workflow,
  GraphQL: BrainCircuit,

  // バックエンド
  "Node.js": Server,
  Express: Server,
  Python: Code,
  Django: Boxes,
  Ruby: Code,
  Rails: Workflow,
  PHP: Code,
  Laravel: Workflow,
  Java: Cpu,
  Spring: Workflow,
  Go: Code,

  // データベース
  PostgreSQL: Database,
  MySQL: Database,
  MongoDB: Database,
  Redis: Database,
  Elasticsearch: Search,
  Firebase: Database,

  // DevOps
  Docker: Boxes,
  Kubernetes: Cloud,
  AWS: Cloud,
  GCP: Cloud,
  Azure: Cloud,
  "CI/CD": Workflow,
  Jenkins: Workflow,
  Terraform: Wrench,

  // その他
  Git: GitBranch,
  Jest: Wrench,
  "Testing Library": Wrench,
  Cypress: Wrench,
  Storybook: MonitorSmartphone,
  Figma: Puzzle,
  Webpack: Boxes,
  Vite: Boxes,
  Analytics: BarChart,
};

// デフォルトアイコン（マッピングにない場合）
const defaultIcons: Record<string, any> = {
  frontend: Code,
  backend: Server,
  database: Database,
  devops: Cloud,
  other: Wrench,
};

interface TechSkill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "other";
  iconName?: string; // アイコン名（オプション）
}

interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  location: string;
  email: string;
  isCheckedIn: boolean;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
    website: string;
  };
}

export default function ProfileCard() {
  const { user } = useUser();

  const defaultProfile: ProfileData = {
    name: user?.fullName || "ゲストユーザー",
    title: "フルスタックエンジニア",
    bio: "5年以上の経験を持つフルスタックエンジニア。Webアプリケーション開発とクラウドインフラに特化しています。",
    avatar: user?.imageUrl || "/placeholder.svg?height=150&width=150",
    location: "日本, 東京",
    email: user?.primaryEmailAddress?.emailAddress || "メール未設定",
    isCheckedIn: true,
    social: {
      github: "https://github.com/your-profile",
      twitter: "https://twitter.com/your-profile",
      linkedin: "https://linkedin.com/in/your-profile",
      website: "https://your-website.dev",
    },
  };

  const defaultTechSkills: TechSkill[] = [
    { id: "1", name: "React", category: "frontend", iconName: "React" },
    { id: "2", name: "Next.js", category: "frontend", iconName: "Next.js" },
    {
      id: "3",
      name: "TypeScript",
      category: "frontend",
      iconName: "TypeScript",
    },
    {
      id: "4",
      name: "Tailwind CSS",
      category: "frontend",
      iconName: "Tailwind CSS",
    },
    { id: "5", name: "HTML/CSS", category: "frontend", iconName: "HTML/CSS" },
    // { id: "6", name: "Node.js", category: "backend", iconName: "Node.js" },
    // { id: "7", name: "Express", category: "backend", iconName: "Express" },
    // { id: "8", name: "Python", category: "backend", iconName: "Python" },
    // { id: "9", name: "Django", category: "backend", iconName: "Django" },
    // {
    //   id: "10",
    //   name: "PostgreSQL",
    //   category: "database",
    //   iconName: "PostgreSQL",
    // },
    // { id: "11", name: "MongoDB", category: "database", iconName: "MongoDB" },
    // { id: "12", name: "Redis", category: "database", iconName: "Redis" },
    // { id: "13", name: "Docker", category: "devops", iconName: "Docker" },
    // { id: "14", name: "AWS", category: "devops", iconName: "AWS" },
    // { id: "15", name: "CI/CD", category: "devops", iconName: "CI/CD" },
    // { id: "16", name: "Git", category: "other", iconName: "Git" },
    // { id: "17", name: "GraphQL", category: "other", iconName: "GraphQL" },
    // { id: "18", name: "Jest", category: "other", iconName: "Jest" },
  ];
  const [activeTab, setActiveTab] = useState("all");
  const [profile, setProfile] = useState(defaultProfile);
  const [techSkills, setTechSkills] = useState<TechSkill[]>(defaultTechSkills);
  const [editMode, setEditMode] = useState(false);
  const [editingProfile, setEditingProfile] = useState({ ...defaultProfile });
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState<Omit<TechSkill, "id">>({
    name: "",
    category: "frontend",
    iconName: "",
  });
  const [editingSkill, setEditingSkill] = useState<TechSkill | null>(null);
  const [searchIcon, setSearchIcon] = useState("");

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
      iconName: "",
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

  const toggleCheckedInStatus = () => {
    if (!editMode) {
      setProfile({ ...profile, isCheckedIn: !profile.isCheckedIn });
    }
  };

  const getIconForSkill = (skill: TechSkill) => {
    // アイコン名が指定されていて、マッピングに存在する場合はそれを使用
    if (skill.iconName && techIcons[skill.iconName]) {
      const IconComponent = techIcons[skill.iconName];
      return <IconComponent className="h-5 w-5" />;
    }

    // 名前がマッピングに存在する場合はそれを使用
    if (techIcons[skill.name]) {
      const IconComponent = techIcons[skill.name];
      return <IconComponent className="h-5 w-5" />;
    }

    // デフォルトアイコンを使用
    const DefaultIcon = defaultIcons[skill.category];
    return <DefaultIcon className="h-5 w-5" />;
  };

  // アイコン選択用のフィルタリング
  const filteredIcons = Object.entries(techIcons).filter(([name]) =>
    name.toLowerCase().includes(searchIcon.toLowerCase())
  );

  return (
    <TooltipProvider>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleProfileCancel}
                >
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
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{profile.name}</CardTitle>
                    <CardDescription className="text-lg font-medium text-muted-foreground">
                      {profile.title}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground">
                      {profile.location}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={toggleCheckedInStatus}
                    className="p-0 h-auto ml-4"
                  >
                    {profile.isCheckedIn ? (
                      <Badge className="text-base px-3 py-1.5 bg-green-500">
                        在室中
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-base px-3 py-1.5"
                      >
                        不在
                      </Badge>
                    )}
                  </Button>
                </div>
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
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
            </div>
          )}
        </CardHeader>
        <CardContent className="pb-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">技術スタック</h3>
            <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  スキル追加
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
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
                    <Label>アイコン選択</Label>
                    <Input
                      placeholder="アイコンを検索..."
                      value={searchIcon}
                      onChange={(e) => setSearchIcon(e.target.value)}
                      className="mb-2"
                    />
                    <div className="border rounded-md p-2">
                      <ScrollArea className="h-40">
                        <div className="grid grid-cols-4 gap-2 p-1">
                          {filteredIcons.map(([name, Icon]) => (
                            <Tooltip key={name}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={
                                    newSkill.iconName === name
                                      ? "default"
                                      : "outline"
                                  }
                                  size="icon"
                                  className="h-10 w-10"
                                  onClick={() =>
                                    setNewSkill({ ...newSkill, iconName: name })
                                  }
                                >
                                  <Icon className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{name}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {filteredIcons.length === 0 && (
                            <p className="col-span-4 text-center text-sm text-muted-foreground py-4">
                              アイコンが見つかりません
                            </p>
                          )}
                        </div>
                      </ScrollArea>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredSkills.map((skill) => (
                  <Tooltip key={skill.id}>
                    <TooltipTrigger asChild>
                      <div className="relative group">
                        <div className="flex flex-col items-center justify-center p-4 rounded-md border bg-background hover:bg-accent transition-colors">
                          <div className="mb-2 p-2 rounded-full bg-muted flex items-center justify-center">
                            {getIconForSkill(skill)}
                          </div>
                          <span className="text-sm font-medium text-center truncate w-full">
                            {skill.name}
                          </span>
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSkill(skill);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 bg-background/80 backdrop-blur-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSkill(skill.id);
                              }}
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{skill.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                {filteredSkills.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    このカテゴリーにはスキルがありません。「スキル追加」ボタンから追加してください。
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <Dialog
            open={editingSkill !== null}
            onOpenChange={(open) => {
              if (!open) setEditingSkill(null);
              else setSearchIcon("");
            }}
          >
            <DialogContent className="max-w-md">
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
                    <Label htmlFor="edit-skill-category">カテゴリー</Label>
                    <Select
                      value={editingSkill.category}
                      onValueChange={(value: any) =>
                        setEditingSkill({ ...editingSkill, category: value })
                      }
                    >
                      <SelectTrigger id="edit-skill-category">
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
                    <Label>アイコン選択</Label>
                    <Input
                      placeholder="アイコンを検索..."
                      value={searchIcon}
                      onChange={(e) => setSearchIcon(e.target.value)}
                      className="mb-2"
                    />
                    <div className="border rounded-md p-2">
                      <ScrollArea className="h-40">
                        <div className="grid grid-cols-4 gap-2 p-1">
                          {filteredIcons.map(([name, Icon]) => (
                            <Tooltip key={name}>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={
                                    editingSkill.iconName === name
                                      ? "default"
                                      : "outline"
                                  }
                                  size="icon"
                                  className="h-10 w-10"
                                  onClick={() =>
                                    setEditingSkill({
                                      ...editingSkill,
                                      iconName: name,
                                    })
                                  }
                                >
                                  <Icon className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{name}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {filteredIcons.length === 0 && (
                            <p className="col-span-4 text-center text-sm text-muted-foreground py-4">
                              アイコンが見つかりません
                            </p>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingSkill(null)}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveEditSkill}>保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
