// storage/mongo.ts
import {
  Category,
  InsertCategory,
  Image,
  InsertImage,
  ImageWithCategory,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { getDb } from "./db/db";
import { IStorage } from "./db/storage.interface";

export class MongoStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    const db = await getDb();
    return db.collection<Category>("categories").find().toArray();
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const db = await getDb();
    const doc = await db.collection<Category>("categories").findOne({ slug });
    return (doc as Category) ?? undefined;
  }


  async createCategory(insert: InsertCategory): Promise<Category> {
    const db = await getDb();
    const category: Category = { id: randomUUID(), count: 0, ...insert };
    await db.collection<Category>("categories").insertOne(category);
    return category;
  }

  async updateCategoryCount(categoryId: string, increment: number): Promise<void> {
    const db = await getDb();
    await db
      .collection<Category>("categories")
      .updateOne({ id: categoryId }, { $inc: { count: increment } });
  }

  async getImages(categorySlug?: string): Promise<ImageWithCategory[]> {
    const db = await getDb();
    let filter: Record<string, unknown> = {};
    if (categorySlug && categorySlug !== "all") {
      const cat = await this.getCategoryBySlug(categorySlug);
      if (!cat) return [];
      filter = { categoryId: cat.id };
    }
    const images = await db.collection<Image>("images").find(filter).toArray();
    const cats = await this.getCategories();
    const catMap = new Map(cats.map((c) => [c.id, c]));
    return images.map((img) => ({
      ...img,
      category: catMap.get(img.categoryId) ?? {
        id: "unknown",
        name: "Unknown",
        slug: "unknown",
        count: 0,
      },
    }));
  }

  async getImageById(id: string): Promise<ImageWithCategory | undefined> {
    const db = await getDb();
    const image = await db.collection<Image>("images").findOne({ id });
    if (!image) return undefined;
    const category = await db
      .collection<Category>("categories")
      .findOne({ id: image.categoryId });
    if (!category) return undefined;
    return { ...image, category };
  }

  async createImage(insert: InsertImage): Promise<Image> {
    const db = await getDb();
    const image: Image = {
      id: randomUUID(),
      likes: 0,
      uploadDate: new Date(),
      ...insert,
    };
    await db.collection<Image>("images").insertOne(image);
    await this.updateCategoryCount(insert.categoryId, 1);
    return image;
  }

  async deleteImage(id: string): Promise<boolean> {
    const db = await getDb();
    const image = await db.collection<Image>("images").findOne({ id });
    if (!image) return false;
    await db.collection<Image>("images").deleteOne({ id });
    await this.updateCategoryCount(image.categoryId, -1);
    return true;
  }

  async incrementLikes(id: string): Promise<void> {
    const db = await getDb();
    await db.collection<Image>("images").updateOne({ id }, { $inc: { likes: 1 } });
  }
}

export const storage = new MongoStorage();
