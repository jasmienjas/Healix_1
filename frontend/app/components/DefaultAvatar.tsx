import { User } from "lucide-react"

interface DefaultAvatarProps {
  firstName?: string;
  lastName?: string;
  className?: string;
}

export function DefaultAvatar({ firstName, lastName, className = "" }: DefaultAvatarProps) {
  if (firstName || lastName) {
    const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    return (
      <div className={`bg-primary text-primary-foreground flex items-center justify-center font-semibold ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`bg-muted flex items-center justify-center ${className}`}>
      <User className="h-6 w-6 text-muted-foreground" />
    </div>
  );
} 