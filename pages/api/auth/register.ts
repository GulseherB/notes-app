/**
 * Kullanıcı Kayıt API Endpoint
 * POST /api/auth/register
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Sadece POST isteği kabul edilir' });
  }

  try {
    // MongoDB'ye bağlan
    await connectDB();

    const { first_name, last_name, email, password, phone } = req.body;

    // Zorunlu alanları kontrol et
    if (!first_name || !last_name || !email || !password || !phone) {
      return res.status(400).json({ 
        message: 'Tüm alanlar zorunludur' 
      });
    }

    // E-posta zaten kayıtlı mı kontrol et
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Bu e-posta adresi zaten kayıtlı' 
      });
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password, // Şifre model içinde otomatik hashlenecek
      phone,
      role: 'user', // Yeni kullanıcılar otomatik olarak 'user' rolüne atanır
      is_active: true,
      is_verified: false,
    });

    // Başarılı yanıt döndür (şifreyi gösterme)
    return res.status(201).json({
      message: 'Kayıt başarılı',
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Kayıt hatası:', error);
    
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
