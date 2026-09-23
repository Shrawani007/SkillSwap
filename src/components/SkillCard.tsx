import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SkillCardProps {
  name: string;
  category?: string;
  description?: string;
  user?: { fullName?: string; username?: string; avatar?: string };
  onRequest?: () => void;
}

const SkillCard = ({ name, category, description, user, onRequest }: SkillCardProps) => {
  return (
    <div className="glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {category && (
            <Badge variant="secondary" className="mb-2">
              {category}
            </Badge>
          )}
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          {description && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>}
          {user && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                {(user.fullName || user.username || "U").charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground">{user.fullName || user.username}</span>
            </div>
          )}
        </div>
      </div>
      {onRequest && (
        <Button className="mt-4 w-full rounded-xl" size="sm" onClick={onRequest}>
          Send Request
        </Button>
      )}
    </div>
  );
};

export default SkillCard;
