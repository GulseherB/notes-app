/**
 * Kategori Modeli
 * Baharat kategorilerini saklar (örn: Biber, Kimyon, Tarçın vb.)
 */
import mongoose, { Schema, Model } from 'mongoose';

// Kategori tipini tanımla
export interface ICategory extends mongoose.Document {
  name: string;
  alias: string;
  image_url?: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// Kategori şeması
const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Kategori adı zorunludur'],
      trim: true,
      unique: true,
    },
    alias: {
      type: String,
      required: [true, 'Kategori alias zorunludur'],
      trim: true,
      lowercase: true,
      unique: true,
    },
    image_url: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// URL dostu alias oluştur
CategorySchema.pre('save', function () {
  if (this.isModified('name') && !this.alias) {
    this.alias = this.name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
});

// Modeli oluştur veya mevcut modeli kullan
const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
