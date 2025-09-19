import { type Category, type InsertCategory, type Image, type InsertImage, type ImageWithCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategoryCount(categoryId: string, increment: number): Promise<void>;

  // Images
  getImages(categorySlug?: string): Promise<ImageWithCategory[]>;
  getImageById(id: string): Promise<ImageWithCategory | undefined>;
  createImage(image: InsertImage): Promise<Image>;
  deleteImage(id: string): Promise<boolean>;
  incrementLikes(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private images: Map<string, Image>;

  constructor() {
    this.categories = new Map();
    this.images = new Map();
    this.initializeDefaultCategories();
  }

  private initializeDefaultCategories() {
    const defaultCategories = [
      { name: "All Images", slug: "all" },
      { name: "Digital Art", slug: "digital-art" },
      { name: "Photography", slug: "photography" },
      { name: "Portraits", slug: "portraits" },
      { name: "Landscapes", slug: "landscapes" },
      { name: "Abstract", slug: "abstract" },
    ];

    defaultCategories.forEach(cat => {
      const id = randomUUID();
      const category: Category = { 
        id, 
        name: cat.name, 
        slug: cat.slug, 
        count: 0 
      };
      this.categories.set(id, category);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id, count: 0 };
    this.categories.set(id, category);
    return category;
  }

  async updateCategoryCount(categoryId: string, increment: number): Promise<void> {
    const category = this.categories.get(categoryId);
    if (category) {
      category.count += increment;
      this.categories.set(categoryId, category);
    }
  }

  async getImages(categorySlug?: string): Promise<ImageWithCategory[]> {
    let images = Array.from(this.images.values());
    
    if (categorySlug && categorySlug !== "all") {
      const category = await this.getCategoryBySlug(categorySlug);
      if (category) {
        images = images.filter(img => img.categoryId === category.id);
      }
    }

    return Promise.all(
      images.map(async (image) => {
        const category = this.categories.get(image.categoryId);
        return {
          ...image,
          category: category!,
        };
      })
    );
  }

  async getImageById(id: string): Promise<ImageWithCategory | undefined> {
    const image = this.images.get(id);
    if (!image) return undefined;

    const category = this.categories.get(image.categoryId);
    if (!category) return undefined;

    return {
      ...image,
      category,
    };
  }

  async createImage(insertImage: InsertImage): Promise<Image> {
    const id = randomUUID();
    const image: Image = {
      ...insertImage,
      id,
      likes: 0,
      uploadDate: new Date(),
    };
    this.images.set(id, image);
    
    // Update category count
    await this.updateCategoryCount(insertImage.categoryId, 1);
    
    return image;
  }

  async deleteImage(id: string): Promise<boolean> {
    const image = this.images.get(id);
    if (!image) return false;

    this.images.delete(id);
    
    // Update category count
    await this.updateCategoryCount(image.categoryId, -1);
    
    return true;
  }

  async incrementLikes(id: string): Promise<void> {
    const image = this.images.get(id);
    if (image) {
      image.likes += 1;
      this.images.set(id, image);
    }
  }
}

export const storage = new MemStorage();
