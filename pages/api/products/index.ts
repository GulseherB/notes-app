/**
 * Ürünler (Baharatlar) API Endpoint
 * GET /api/products - Tüm ürünleri listele
 * POST /api/products - Yeni ürün oluştur (Admin)
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
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

    // GET - Ürünleri listele
    if (req.method === 'GET') {
      const { category, search, limit } = req.query;

      // Filtre oluştur
      const filter: any = { is_active: true };

      // Kategoriye göre filtrele
      if (category && category !== 'all') {
        const categoryDoc = await Category.findOne({ alias: category });
        if (categoryDoc) {
          filter.category_id = categoryDoc._id;
        }
      }

      // Arama yapılıyorsa
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { descriptions: { $regex: search, $options: 'i' } },
        ];
      }

      // Ürünleri getir ve kategoriye populate et
      let query = Product.find(filter)
        .populate('category_id', 'name alias')
        .sort({ created_at: -1 });

      // Limit varsa uygula
      if (limit) {
        query = query.limit(Number(limit));
      }

      const products = await query;

      return res.status(200).json({
        data: products,
        total: products.length,
      });
    }

    // POST - Yeni ürün oluştur (Admin)
    if (req.method === 'POST') {
      // Kullanıcı rolü kontrolü
      const userRole = await getUserRole(req, res);
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Bu işlem için admin yetkisi gerekli' });
      }

      const { 
        name, 
        descriptions, 
        quantity, 
        weight, 
        price, 
        sku, 
        category_id, 
        storage_files 
      } = req.body;

      // Zorunlu alanları kontrol et
      if (!name || !descriptions || !weight || !price || !category_id) {
        return res.status(400).json({ 
          message: 'Gerekli alanlar eksik' 
        });
      }

      // Kategori var mı kontrol et
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(404).json({ 
          message: 'Kategori bulunamadı' 
        });
      }

      // SKU zaten var mı kontrol et
      if (sku) {
        const existingProduct = await Product.findOne({ sku: sku.toUpperCase() });
        if (existingProduct) {
          return res.status(400).json({ 
            message: 'Bu SKU kodu zaten kullanılıyor' 
          });
        }
      }

      // Yeni ürün oluştur
      const product = await Product.create({
        name,
        descriptions,
        quantity: quantity || 0,
        weight,
        price,
        sku,
        category_id,
        storage_files: storage_files || [],
        is_active: true,
      });

      // Populate ile kategori bilgisini ekle
      await product.populate('category_id', 'name alias');

      return res.status(201).json({
        message: 'Ürün başarıyla oluşturuldu',
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
