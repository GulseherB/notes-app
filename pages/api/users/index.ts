/**
 * Kullanıcılar API Endpoint
 * GET /api/users - Tüm kullanıcıları listele (Admin)
 * POST /api/users - Yeni kullanıcı oluştur
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
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

    // GET - Kullanıcıları listele
    if (req.method === 'GET') {
      // Kullanıcı rolü kontrolü
      const userRole = await getUserRole(req, res);
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
      }

      // Tüm kullanıcıları getir (şifre hariç)
      const users = await User.find({}).select('-password').sort({ created_at: -1 });

      return res.status(200).json({
        data: users,
        total: users.length,
      });
    }

    // POST - Yeni kullanıcı oluştur (Kayıt)
    if (req.method === 'POST') {
      const { first_name, last_name, email, password, phone, role } = req.body;

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
        password,
        phone,
        role: role || 'user',
        is_active: true,
        is_verified: false,
      });

      // Başarılı yanıt
      return res.status(201).json({
        message: 'Kullanıcı başarıyla oluşturuldu',
        data: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    // Desteklenmeyen HTTP metodu
    return res.status(405).json({ message: 'Metod desteklenmiyor' });
  } catch (error: any) {
    console.error('Kullanıcı API hatası:', error);
    
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
