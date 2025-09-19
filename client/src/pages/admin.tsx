import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminHeader from "@/components/admin-header";
import AdminTable from "@/components/admin-table";
import UploadModal from "@/components/upload-modal";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Upload } from "lucide-react";
import type { ImageWithCategory, Category } from "@shared/schema";

export default function Admin() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: images = [], isLoading } = useQuery<ImageWithCategory[]>({
    queryKey: ["/api/images"],
  });

  const filteredImages = images.filter(image => {
    const matchesSearch = image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || image.category.slug === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-card border-r border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold gradient-text">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Content Management</p>
          </div>
          
          <nav className="p-6 space-y-2">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
              <Upload className="h-4 w-4" />
              <span>Image Management</span>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start space-x-3 text-muted-foreground hover:text-foreground"
              onClick={() => setUploadModalOpen(true)}
              data-testid="button-admin-upload"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Images</span>
            </Button>
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 text-muted-foreground hover:text-foreground"
                data-testid="link-back-gallery"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Gallery</span>
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Admin Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
          />

          <div className="flex-1 overflow-y-auto p-8">
            <AdminTable
              images={filteredImages}
              isLoading={isLoading}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground" data-testid="text-pagination-info">
                Showing 1-{filteredImages.length} of {filteredImages.length} images
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled data-testid="button-pagination-prev">
                  Previous
                </Button>
                <Button variant="default" size="sm" data-testid="button-pagination-current">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled data-testid="button-pagination-next">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        categories={categories}
      />
    </div>
  );
}
