/**
 * Ürün (Baharat) Modeli
 * Baharatların detaylı bilgilerini saklar
 */
import mongoose, { Schema, Model } from 'mongoose';

// Ürün görseli tipi
export interface IStorageFile {
  image_url: string;
  public_id?: string;
  type?: string;
  size?: string;
}

// Ürün tipini tanımla
export interface IProduct extends mongoose.Document {
  name: string;
  descriptions: string;
  quantity: number;
  weight: number;
  price: number;
  sku: string;
  category_id: mongoose.Types.ObjectId;
  storage_files: IStorageFile[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Görsel şeması
const StorageFileSchema = new Schema<IStorageFile>(
  {
    image_url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'image',
    },
    size: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

// Ürün şeması
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur'],
      trim: true,
    },
    descriptions: {
      type: String,
      required: [true, 'Ürün açıklaması zorunludur'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Stok miktarı zorunludur'],
      min: [0, 'Stok miktarı negatif olamaz'],
      default: 0,
    },
    weight: {
      type: Number,
      required: [true, 'Ağırlık (gram) zorunludur'],
      min: [0, 'Ağırlık negatif olamaz'],
    },
    price: {
      type: Number,
      required: [true, 'Fiyat zorunludur'],
      min: [0, 'Fiyat negatif olamaz'],
    },
    sku: {
      type: String,
      required: [true, 'SKU kodu zorunludur'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Kategori zorunludur'],
    },
    storage_files: {
      type: [StorageFileSchema],
      default: [],
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// SKU otomatik oluşturma (eğer sağlanmadıysa)
ProductSchema.pre('save', function () {
  if (!this.sku) {
    // Rastgele SKU kodu oluştur
    this.sku = `BHR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
});

// Modeli oluştur veya mevcut modeli kullan
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
