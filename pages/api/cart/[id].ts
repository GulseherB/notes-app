/**
 * Cart Item API - Tek Ürün İşlemleri
 * DELETE - Sepetten ürün sil
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Kullanıcı token kontrolü
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token || !token.sub) {
    return res.status(401).json({ success: false, message: 'Lütfen giriş yapın' });
  }

  const userId = token.sub;
  const { id } = req.query; // product_id

  if (req.method === 'DELETE') {
    try {
      const cart = await Cart.findOne({ user_id: userId });
      
      if (!cart) {
        return res.status(404).json({ success: false, message: 'Sepet bulunamadı' });
      }

      // Ürünü sepetten kaldır
      cart.items = cart.items.filter(
        (item: any) => item.product_id.toString() !== id
      );

      await cart.save();

      return res.status(200).json({
        success: true,
        message: 'Ürün sepetten kaldırıldı',
        data: cart,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
