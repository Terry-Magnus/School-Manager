import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="flex gap-2 items-center">
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          {user?.photoUrl ? (
            <AvatarImage src="/avatars/01.png" alt="avatar" />
          ) : (
            <AvatarFallback>
              <p>{`${user?.name?.charAt(0).toUpperCase()}`}</p>
            </AvatarFallback>
          )}
        </Avatar>
      </Button>
      <div className="text-[10px]">
        <p className="font-bold">
          {user?.name} ({user?.role})
        </p>
        <p>{user?.email}</p>
      </div>
    </div>
  );
}
