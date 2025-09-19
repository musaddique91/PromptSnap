import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Sidebar from "@/components/sidebar";
import ImageCard from "@/components/image-card";
import UploadModal from "@/components/upload-modal";
import PromptModal from "@/components/prompt-modal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { ImageWithCategory, Category } from "@shared/schema";

export default function Home() {
  const { slug } = useParams();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageWithCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: images = [], isLoading } = useQuery<ImageWithCategory[]>({
    queryKey: ["/api/images", { category: slug || "all" }],
  });

  const currentCategory = categories.find(cat => cat.slug === (slug || "all")) || 
    { name: "All Images", slug: "all", count: images.length };

  const filteredImages = images.filter(image =>
    image.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes;
      case "name":
        return a.originalName.localeCompare(b.originalName);
      case "latest":
      default:
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    }
  });

  const handleImageClick = (image: ImageWithCategory) => {
    setSelectedImage(image);
    setPromptModalOpen(true);
  };

  const handlePromptClick = (e: React.MouseEvent, image: ImageWithCategory) => {
    e.stopPropagation();
    setSelectedImage(image);
    setPromptModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar 
        categories={categories}
        currentSlug={slug || "all"}
        onUploadClick={() => setUploadModalOpen(true)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" data-testid="page-title">
                {currentCategory.name}
              </h2>
              <p className="text-muted-foreground">
                Explore AI-generated {currentCategory.name.toLowerCase()} and their prompts
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10"
                  data-testid="input-search"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40" data-testid="select-sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Sort by Latest</SelectItem>
                  <SelectItem value="popular">Sort by Popular</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-muted"></div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-4 bg-muted rounded w-12"></div>
                    </div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl text-muted-foreground mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">No images found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Be the first to upload an image!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedImages.map((image) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onClick={() => handleImageClick(image)}
                  onPromptClick={(e) => handlePromptClick(e, image)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        categories={categories}
      />

      <PromptModal
        open={promptModalOpen}
        onOpenChange={setPromptModalOpen}
        image={selectedImage}
      />
    </div>
  );
}
