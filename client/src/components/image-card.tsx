import { Button } from "@/components/ui/button";
import { Heart, Sparkles } from "lucide-react";
import type { ImageWithCategory } from "@shared/schema";

interface ImageCardProps {
  image: ImageWithCategory;
  onClick: () => void;
  onPromptClick: (e: React.MouseEvent) => void;
}

const getCategoryColor = (slug: string) => {
  switch (slug) {
    case "digital-art":
      return "bg-primary/20 text-primary";
    case "photography":
      return "bg-blue-500/20 text-blue-400";
    case "portraits":
      return "bg-yellow-500/20 text-yellow-400";
    case "landscapes":
      return "bg-blue-500/20 text-blue-400";
    case "abstract":
      return "bg-accent/20 text-accent";
    default:
      return "bg-muted/20 text-muted-foreground";
  }
};

export default function ImageCard({ image, onClick, onPromptClick }: ImageCardProps) {
  const categoryColorClass = getCategoryColor(image.category.slug);

  return (
    <div
      className="bg-card rounded-xl overflow-hidden image-hover-effect group cursor-pointer"
      onClick={onClick}
      data-testid={`card-image-${image.id}`}
    >
      <img
        src={image.filePath}
        alt={image.originalName}
        className="w-full h-64 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${categoryColorClass}`}>
            {image.category.name}
          </span>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Heart className="h-3 w-3" />
            <span data-testid={`text-likes-${image.id}`}>{image.likes}</span>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="w-full transition-colors flex items-center justify-center space-x-2"
          onClick={onPromptClick}
          data-testid={`button-prompt-${image.id}`}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span>View Prompt</span>
        </Button>
      </div>
    </div>
  );
}
