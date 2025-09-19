// storage/types.ts
import {
  Category,
  InsertCategory,
  Image,
  InsertImage,
  ImageWithCategory,
} from "@shared/schema";

export interface IStorage {
  // ---------- Categories ----------
  /** Get all categories */
  getCategories(): Promise<Category[]>;

  /** Find a category by its slug */
  getCategoryBySlug(slug: string): Promise<Category | undefined>;

  /** Create a new category */
  createCategory(category: InsertCategory): Promise<Category>;

  /** Increase or decrease the `count` field on a category */
  updateCategoryCount(categoryId: string, increment: number): Promise<void>;

  // ---------- Images ----------
  /**
   * Get all images, optionally filtered by category slug.
   * Returns an array of `ImageWithCategory` (image + category info).
   */
  getImages(categorySlug?: string): Promise<ImageWithCategory[]>;

  /** Find a single image by its id (includes category info) */
  getImageById(id: string): Promise<ImageWithCategory | undefined>;

  /** Create a new image */
  createImage(image: InsertImage): Promise<Image>;

  /** Delete an image and update the category’s count */
  deleteImage(id: string): Promise<boolean>;

  /** Increment the number of likes on an image */
  incrementLikes(id: string): Promise<void>;
}
