/**
 * Kullanıcı Giriş API Endpoint
 * POST /api/auth/login
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';

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

    const { email, password } = req.body;

    // Zorunlu alanları kontrol et
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'E-posta ve şifre zorunludur' 
      });
    }

    // Kullanıcıyı bul (şifre dahil)
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        message: 'E-posta veya şifre hatalı' 
      });
    }

    // Kullanıcı aktif mi kontrol et
    if (!user.is_active) {
      return res.status(403).json({ 
        message: 'Hesabınız deaktif edilmiş' 
      });
    }

    // Şifreyi doğrula
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'E-posta veya şifre hatalı' 
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Başarılı giriş yanıtı
    return res.status(200).json({
      access_token: token,
      refresh_token: token,
      expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 gün
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        is_active: user.is_active,
        is_verified: user.is_verified,
        email_verified_at: user.email_verified_at,
      },
    });
  } catch (error: any) {
    console.error('Giriş hatası:', error);
    return res.status(500).json({ 
      message: 'Sunucu hatası oluştu' 
    });
  }
}
