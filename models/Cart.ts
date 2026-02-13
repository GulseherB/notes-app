/**
 * Cart Model - Kullanıcı Sepeti
 * Her kullanıcının kendine ait bir sepeti olur
 */
import mongoose, { Schema, model, Document } from 'mongoose';

export interface ICartItem {
  product_id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  image_url?: string;
}

export interface ICart extends Document {
  user_id: mongoose.Types.ObjectId;
  items: ICartItem[];
  total_amount: number;
  created_at: Date;
  updated_at: Date;
}

const CartItemSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  weight: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
  },
});

const CartSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Her kullanıcının sadece 1 sepeti olabilir
  },
  items: [CartItemSchema],
  total_amount: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Her kayıt güncellendiğinde updated_at'i güncelle
CartSchema.pre('save', async function() {
  this.updated_at = new Date();
  
  // Total amount'u hesapla
  this.total_amount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

export default mongoose.models.Cart || model<ICart>('Cart', CartSchema);
