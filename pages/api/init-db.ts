/**
 * Veritabanı Başlatma Script
 * İlk admin kullanıcısı ve başlangıç kategorilerini oluşturur
 * POST /api/init-db
 * 
 * UYARI: Bu endpoint sadece bir kez çalıştırılmalıdır!
 * Production ortamında bu dosyayı silmelisiniz.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Category from '@/models/Category';
import Product from '@/models/Product';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST isteği kabul edilir' });
  }

  try {
    // MongoDB'ye bağlan
    await connectDB();

    // Admin kullanıcısı var mı kontrol et
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ 
        message: 'Veritabanı zaten başlatılmış. Admin kullanıcısı mevcut.' 
      });
    }

    // İlk admin kullanıcısını oluştur
    const admin = await User.create({
      first_name: 'Admin',
      last_name: 'Karadağ',
      email: 'admin@karadagbaharat.com',
      password: 'admin123', // UYARI: İlk girişten sonra şifreyi değiştirin!
      phone: '05551234567',
      role: 'admin',
      is_active: true,
      is_verified: true,
      email_verified_at: new Date(),
    });

    // Başlangıç kategorilerini oluştur
    const categories = await Category.insertMany([
      {
        name: 'Kırmızı Biber',
        alias: 'red-pepper',
        image_url: 'https://images.unsplash.com/photo-1583566278430-f33f7ee8f6c9?w=400',
        description: 'Taze ve aromalı kırmızı biber çeşitleri',
      },
      {
        name: 'Karabiber',
        alias: 'black-pepper',
        image_url: 'https://images.unsplash.com/photo-1599660675805-2603904dd562?w=400',
        description: 'Öğütülmüş ve tane karabiber',
      },
      {
        name: 'Kimyon',
        alias: 'cumin',
        image_url: 'https://images.unsplash.com/photo-1596040033229-a0b7e0b2e4a7?w=400',
        description: 'Kaliteli kimyon çeşitleri',
      },
      {
        name: 'Sumak',
        alias: 'sumac',
        image_url: 'https://images.unsplash.com/photo-1599909533113-d2b0e5f7bfa3?w=400',
        description: 'Ekşi ve aromalı sumak',
      },
      {
        name: 'Kekik',
        alias: 'thyme',
        image_url: 'https://images.unsplash.com/photo-1608481337062-7d59f6dadd1f?w=400',
        description: 'Doğal kekik yaprakları',
      },
      {
        name: 'Pul Biber',
        alias: 'chili-flakes',
        image_url: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=400',
        description: 'Acı ve lezzetli pul biber',
      },
    ]);

    // Örnek ürünler ekle (Her kategoriden 2 ürün)
    const sampleProducts = [
      {
        name: 'Maras Kırmızı Biber - 100gr',
        descriptions: 'Geleneksel Maraş usulü kırmızı biber. Orta acılıkta, aromalı.',
        quantity: 50,
        weight: 100,
        price: 45.00,
        sku: 'MRB-100',
        category_id: categories[0]._id,
        storage_files: [{
          image_url: 'https://images.unsplash.com/photo-1583566278430-f33f7ee8f6c9?w=600',
          type: 'image',
        }],
      },
      {
        name: 'Urfa Kırmızı Biber - 250gr',
        descriptions: 'Isot olarak da bilinen Urfa biberi. Hafif tatlı ve dumanlı aroma.',
        quantity: 30,
        weight: 250,
        price: 95.00,
        sku: 'URB-250',
        category_id: categories[0]._id,
        storage_files: [{
          image_url: 'https://images.unsplash.com/photo-1583566278430-f33f7ee8f6c9?w=600',
          type: 'image',
        }],
      },
      {
        name: 'Tane Karabiber - 50gr',
        descriptions: 'Öğütülmemiş, taze karabiber taneleri. Yoğun aroma.',
        quantity: 40,
        weight: 50,
        price: 35.00,
        sku: 'TKB-50',
        category_id: categories[1]._id,
        storage_files: [{
          image_url: 'https://images.unsplash.com/photo-1599660675805-2603904dd562?w=600',
          type: 'image',
        }],
      },
      {
        name: 'Öğütülmüş Karabiber - 100gr',
        descriptions: 'Taze öğütülmüş karabiber. Mutfağınızın vazgeçilmezi.',
        quantity: 60,
        weight: 100,
        price: 50.00,
        sku: 'OKB-100',
        category_id: categories[1]._id,
        storage_files: [{
          image_url: 'https://images.unsplash.com/photo-1599660675805-2603904dd562?w=600',
          type: 'image',
        }],
      },
      {
        name: 'Tane Kimyon - 100gr',
        descriptions: 'Doğal ve aromalı kimyon taneleri.',
        quantity: 45,
        weight: 100,
        price: 40.00,
        sku: 'TKY-100',
        category_id: categories[2]._id,
        storage_files: [{
          image_url: 'https://images.unsplash.com/photo-1596040033229-a0b7e0b2e4a7?w=600',
          type: 'image',
        }],
      },
      {
        name: 'Sumak - 150gr',
        descriptions: 'Ekşi ve ferahlatıcı sumak. Salatalar için ideal.',
        quantity: 35,
        weight: 150,
        price: 55.00,
        sku: 'SMK-150',
        category_id: categories[3]._id,
        storage_files: [{
          image_url: 'https://images.unsplash.com/photo-1599909533113-d2b0e5f7bfa3?w=600',
          type: 'image',
        }],
      },
    ];

    const products = await Product.insertMany(sampleProducts);

    return res.status(201).json({
      success: true,
      message: 'Veritabanı başarıyla başlatıldı!',
      data: {
        admin: {
          email: admin.email,
          password: 'admin123', // UI'de göster ki kullanıcı bilsin
        },
        categories_count: categories.length,
        products_count: products.length,
      },
      warning: 'İlk girişten sonra admin şifresini değiştirin!',
    });
  } catch (error: any) {
    console.error('Veritabanı başlatma hatası:', error);
    return res.status(500).json({ 
      message: 'Veritabanı başlatılırken hata oluştu',
      error: error.message 
    });
  }
}
