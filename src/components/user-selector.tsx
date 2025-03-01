import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type User = {
  id: number;
  name: string;
  avatar: string;
};

type UserSelectorProps = {
  users: User[];
  selectedUsers: User[];
  onToggleUser: (user: User) => void;
  activeUser: User | null;
  setActiveUser: (user: User) => void;
};

export default function UserSelector({
  users,
  selectedUsers,
  onToggleUser,
  activeUser,
  setActiveUser,
}: UserSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {users.map((user) => {
        const isSelected = selectedUsers.some((u) => u.id === user.id);
        const isActive = activeUser?.id === user.id;
        return (
          <Button
            key={user.id}
            variant={isSelected ? "default" : "outline"}
            className={`p-1 ${isActive ? "ring-2 ring-primary" : ""}`}
            onClick={() => {
              onToggleUser(user);
              setActiveUser(user);
            }}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        );
      })}
    </div>
  );
}
