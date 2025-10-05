import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ImageWithCategory } from "@shared/schema";

interface PromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: ImageWithCategory | null;
}

export default function PromptModal({ open, onOpenChange, image }: PromptModalProps) {
  const { toast } = useToast();

  if (!image) return null;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(image.prompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.filePath;
    link.download = image.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl" data-testid="modal-prompt">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            AI Generation Details
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              data-testid="button-close-prompt"
            >
              <X className="h-4 w-4" />
            </Button> */}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <img
              src={image.filePath}
              alt={image.originalName}
              className="w-full rounded-lg"
              data-testid="img-preview"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs">
                {image.category.name}
              </span>
              <span data-testid="text-upload-date">
                {formatDate(image.uploadDate)}
              </span>
            </div>
          </div>

          {/* Prompt Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">AI Prompt</h4>
              <div
                className="bg-muted rounded-lg p-4 text-sm max-h-64 overflow-y-auto"
                data-testid="text-prompt"
              >
                {image.prompt}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Image Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Filename:</span>
                  <span data-testid="text-filename">{image.originalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span data-testid="text-filesize">
                    {(image.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likes:</span>
                  <span data-testid="text-likes">{image.likes}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-border">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleCopyPrompt}
                data-testid="button-copy-prompt"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Prompt
              </Button>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleDownload}
                data-testid="button-download"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
