import { cn } from "@/lib/utils";

interface DefaultAvatarProps {
  firstName?: string;
  lastName?: string;
  className?: string;
}

export function DefaultAvatar({ firstName, lastName, className }: DefaultAvatarProps) {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center bg-primary text-primary-foreground rounded-full h-full w-full",
        className
      )}
    >
      {initials || "?"}
    </div>
  );
} 