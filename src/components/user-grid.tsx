import StudyTimer from "./study-timer";

interface User {
  id: number;
  name: string;
  studyTimeMinutes: number;
  currentMinutes: number;
}

interface UserGridProps {
  users: User[];
  currentUser: User;
}

export default function UserGrid({ users, currentUser }: UserGridProps) {
  const allUsers = [currentUser, ...users];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {allUsers.map((user) => (
        <div key={user.id} className="flex flex-col items-center">
          <StudyTimer
            isActive={user.currentMinutes > 0}
            totalMinutes={user.studyTimeMinutes}
            size={100}
            {...(user.id === currentUser.id ? {} : { onTimeUpdate: undefined })}
          />
          <p className="mt-2 text-sm font-medium text-center">{user.name}</p>
          <p className="text-xs text-muted-foreground text-center">
            {user.currentMinutes > 0
              ? `${Math.floor(user.currentMinutes)}/${user.studyTimeMinutes} 分`
              : "勉強していません"}
          </p>
        </div>
      ))}
    </div>
  );
}
