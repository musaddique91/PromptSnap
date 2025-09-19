import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import type { ImageWithCategory } from "@shared/schema";

interface AdminTableProps {
  images: ImageWithCategory[];
  isLoading: boolean;
}

export default function AdminTable({ images, isLoading }: AdminTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const response = await apiRequest("DELETE", `/api/images/${imageId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    },
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

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

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading images...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-8 text-center">
          <div className="text-6xl text-muted-foreground mb-4">📷</div>
          <h3 className="text-lg font-semibold mb-2">No images found</h3>
          <p className="text-muted-foreground">Upload some images to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Prompt</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images.map((image) => (
            <TableRow key={image.id} className="hover:bg-muted/20" data-testid={`row-image-${image.id}`}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <img
                    src={image.filePath}
                    alt={image.originalName}
                    className="w-12 h-12 rounded-lg object-cover"
                    data-testid={`img-thumbnail-${image.id}`}
                  />
                  <div>
                    <div className="font-medium text-sm" data-testid={`text-filename-${image.id}`}>
                      {image.originalName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(image.fileSize / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="max-w-xs truncate text-sm"
                  title={image.prompt}
                  data-testid={`text-prompt-${image.id}`}
                >
                  {image.prompt}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${getCategoryColor(image.category.slug)}`}
                  data-testid={`badge-category-${image.id}`}
                >
                  {image.category.name}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground" data-testid={`text-date-${image.id}`}>
                {formatDate(image.uploadDate)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80"
                    data-testid={`button-edit-${image.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80"
                        data-testid={`button-delete-${image.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-testid={`dialog-delete-${image.id}`}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{image.originalName}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-testid={`button-cancel-delete-${image.id}`}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(image.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={deleteMutation.isPending}
                          data-testid={`button-confirm-delete-${image.id}`}
                        >
                          {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
