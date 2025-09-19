import mongoose, { Schema, Model, Document } from 'mongoose';
import { type Category, type Image, type InsertImage } from "@shared/schema";

// Define the Mongoose Category Schema
interface ICategory extends Omit<Category, 'id'>, Document {}
const categorySchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

// Define the Mongoose Image Schema
interface IImage extends Omit<Image, 'id'>, Document {}
const imageSchema: Schema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  categoryId: { type: String, required: true },
  likes: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
});

// Create Mongoose Models
export const CategoryModel: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);
export const ImageModel: Model<IImage> = mongoose.model<IImage>('Image', imageSchema);