import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Image, Camera, Users, Mountain, Shapes, Settings, Menu, X } from "lucide-react";
import type { Category } from "@shared/schema";

interface SidebarProps {
  categories: Category[];
  currentSlug: string;
  onUploadClick: () => void;
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case "digital-art": return Sparkles;
    case "photography": return Camera;
    case "portraits": return Users;
    case "landscapes": return Mountain;
    case "abstract": return Shapes;
    default: return Image;
  }
};

const getCategoryColor = (slug: string) => {
  switch (slug) {
    case "digital-art": return "text-primary";
    case "photography": return "text-blue-400";
    case "portraits": return "text-yellow-400";
    case "landscapes": return "text-blue-400";
    case "abstract": return "text-accent";
    default: return "text-muted-foreground";
  }
};

export default function Sidebar({ categories, currentSlug, onUploadClick }: SidebarProps) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-card md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-200 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:w-80 flex flex-col
        `}
      >
        {/* Close button for mobile */}
        <div className="flex justify-end p-2 md:hidden">
          <button onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Logo & Header */}
        <div className="p-1 border-b border-border">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="text-primary-foreground h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">PromptSnap</h1>
              <p className="text-sm text-muted-foreground">The Art of AI Prompts</p>
            </div>
          </div>

          {/* Upload Button */}
          {/* <Button onClick={onUploadClick} ...>Upload Image</Button> */}
        </div>

        {/* Categories */}
        <div className="flex-1 p-6 overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Categories
          </h3>
          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              const isActive = currentSlug === category.slug;
              const colorClass = isActive ? "text-white bg-primary" : getCategoryColor(category.slug);
              const bgClass = isActive ? "bg-primary/10" : "hover:bg-muted/50";

              return (
                <Link
                  key={category.id}
                  href={category.slug === "all" ? "/" : `/category/${category.slug}`}
                >
                  <div
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group cursor-pointer ${bgClass} ${isActive ? colorClass : "text-muted-foreground hover:text-foreground hover:bg-purple-200"}`}
                    data-testid={`link-category-${category.slug}`}
                    onClick={() => setOpen(false)} // close sidebar on mobile
                  >
                    <div className={`w-8 h-8 ${isActive ? "bg-primary/20" : "bg-muted"} rounded-md flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${isActive ? colorClass : "text-muted-foreground group-hover:text-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{category.name}</span>
                      <div className={`text-xs ${isActive ? "opacity-80" : "text-muted-foreground"}`}>
                        {category.count} photos
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Link */}
        <div className="p-6 border-t border-border">
          <Link href="/admin/musa/upload">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-admin">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Admin Panel</span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
