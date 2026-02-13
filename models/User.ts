/**
 * Kullanıcı Modeli
 * Veritabanında kullanıcı bilgilerini saklar
 */
import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Kullanıcı tipini tanımla
export interface IUser extends mongoose.Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user';
  is_active: boolean;
  is_verified: boolean;
  email_verified_at?: Date;
  created_at: Date;
  updated_at: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Kullanıcı şeması
const UserSchema = new Schema<IUser>(
  {
    first_name: {
      type: String,
      required: [true, 'Ad zorunludur'],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, 'Soyad zorunludur'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'E-posta zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Geçerli bir e-posta adresi giriniz'],
    },
    password: {
      type: String,
      required: [true, 'Şifre zorunludur'],
      minlength: [6, 'Şifre en az 6 karakter olmalıdır'],
      select: false, // Varsayılan olarak şifreyi döndürme
    },
    phone: {
      type: String,
      required: [true, 'Telefon numarası zorunludur'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    email_verified_at: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Şifreyi kaydetmeden önce hashle
UserSchema.pre('save', async function () {
  // Şifre değiştirilmediyse devam et
  if (!this.isModified('password')) {
    return;
  }

  // Şifreyi hashle
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Modeli oluştur veya mevcut modeli kullan
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
