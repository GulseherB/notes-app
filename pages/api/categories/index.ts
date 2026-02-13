/**
 * Kategoriler API Endpoint
 * GET /api/categories - Tüm kategorileri listele
 * POST /api/categories - Yeni kategori oluştur (Admin)
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { getToken } from 'next-auth/jwt';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

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

    // GET - Kategorileri listele
    if (req.method === 'GET') {
      const categories = await Category.find({}).sort({ name: 1 });

      return res.status(200).json({
        data: categories,
        total: categories.length,
      });
    }

    // POST - Yeni kategori oluştur (Admin)
    if (req.method === 'POST') {
      // Kullanıcı rolü kontrolü
      const userRole = await getUserRole(req, res);
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Bu işlem için admin yetkisi gerekli' });
      }

      const { name, alias, image_url, description } = req.body;

      // Zorunlu alanları kontrol et
      if (!name) {
        return res.status(400).json({ 
          message: 'Kategori adı zorunludur' 
        });
      }

      // Aynı isimde kategori var mı kontrol et
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ 
          message: 'Bu isimde bir kategori zaten mevcut' 
        });
      }

      // Yeni kategori oluştur
      const category = await Category.create({
        name,
        alias,
        image_url,
        description,
      });

      return res.status(201).json({
        message: 'Kategori başarıyla oluşturuldu',
        data: category,
      });
    }

    // Desteklenmeyen HTTP metodu
    return res.status(405).json({ message: 'Metod desteklenmiyor' });
  } catch (error: any) {
    console.error('Kategori API hatası:', error);
    
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
