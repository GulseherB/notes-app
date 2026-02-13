/**
 * Tekil Ürün API Endpoint
 * GET /api/products/[id] - Ürün detayını getir
 * PUT /api/products/[id] - Ürün güncelle (Admin)
 * DELETE /api/products/[id] - Ürün sil (Admin)
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getToken } from 'next-auth/jwt';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import mongoose from 'mongoose';

// Kullanıcı kimlik doğrulama
async function getUserRole(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
  // Önce getToken dene
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.role) {
    return token.role as string;
  }

  // Fallback: unstable_getServerSession
  const session = await unstable_getServerSession(req, res, authOptions);
  if ((session as any)?.role) {
    return (session as any).role;
  }

  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // MongoDB'ye bağlan
    await connectDB();

    const { id } = req.query;

    // GET - Ürün detayını getir
    if (req.method === 'GET') {
      const product = await Product.findById(id).populate('category_id', 'name alias');
      
      if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }

      return res.status(200).json({ data: product });
    }

    // PUT - Ürün güncelle (Admin)
    if (req.method === 'PUT') {
      // Kullanıcı rolü kontrolü
      const userRole = await getUserRole(req, res);
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Bu işlem için admin yetkisi gerekli' });
      }

      const updateData = req.body;

      // Kategori değişiyorsa, var mı kontrol et
      if (updateData.category_id) {
        const category = await Category.findById(updateData.category_id);
        if (!category) {
          return res.status(404).json({ message: 'Kategori bulunamadı' });
        }
      }

      // SKU değişiyorsa, başka ürün kullanıyor mu kontrol et
      if (updateData.sku) {
        const existingProduct = await Product.findOne({ 
          sku: updateData.sku.toUpperCase(),
          _id: { $ne: new mongoose.Types.ObjectId(id as string) }
        });
        if (existingProduct) {
          return res.status(400).json({ 
            message: 'Bu SKU kodu başka bir ürün tarafından kullanılıyor' 
          });
        }
      }

      // Ürünü güncelle
      const product = await Product.findByIdAndUpdate(
        id,
        { ...updateData, updated_at: new Date() },
        { new: true, runValidators: true }
      ).populate('category_id', 'name alias');

      if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }

      return res.status(200).json({
        message: 'Ürün başarıyla güncellendi',
        data: product,
      });
    }

    // DELETE - Ürün sil (soft delete - is_active = false)
    if (req.method === 'DELETE') {
      // Kullanıcı rolü kontrolü
      const userRole = await getUserRole(req, res);
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Bu işlem için admin yetkisi gerekli' });
      }

      // Ürünü pasif yap (soft delete)
      const product = await Product.findByIdAndUpdate(
        id,
        { is_active: false, updated_at: new Date() },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }

      return res.status(200).json({
        message: 'Ürün başarıyla silindi',
        data: product,
      });
    }

    // Desteklenmeyen HTTP metodu
    return res.status(405).json({ message: 'Metod desteklenmiyor' });
  } catch (error: any) {
    console.error('Ürün API hatası:', error);
    
    // Mongoose validasyon hatası
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    return res.status(500).json({ 
      message: 'Sunucu hatası oluştu' 
    });
  }
}
