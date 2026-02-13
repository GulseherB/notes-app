/**
 * Cart API - Sepet İşlemleri
 * GET - Kullanıcının sepetini getir
 * POST - Sepete ürün ekle
 * PUT - Ürün miktarını güncelle
 * DELETE - Sepeti temizle
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import mongoose from 'mongoose';

async function getUserId(req: NextApiRequest, res: NextApiResponse): Promise<string | null> {
  // Önce getToken dene
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token?.sub) {
    return token.sub;
  }

  // Fallback: unstable_getServerSession
  const session = await unstable_getServerSession(req, res, authOptions);
  if ((session as any)?.sub) {
    return (session as any).sub;
  }
  if ((session?.user as any)?.id) {
    return (session?.user as any).id;
  }

  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  // Kullanıcı kimlik kontrolü
  const userId = await getUserId(req, res);

  if (!userId) {
    console.error('Cart API: Kullanıcı doğrulanamadı');
    return res.status(401).json({ success: false, message: 'Lütfen giriş yapın' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getCart(userId, res);
      
      case 'POST':
        return await addToCart(userId, req.body, res);
      
      case 'PUT':
        return await updateCartItem(userId, req.body, res);
      
      case 'DELETE':
        return await clearCart(userId, res);
      
      default:
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Cart API error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Sepeti getir
async function getCart(userId: string, res: NextApiResponse) {
  try {
    let cart = await Cart.findOne({ user_id: userId }).populate('items.product_id');
    
    // Sepet yoksa yeni oluştur
    if (!cart) {
      cart = await Cart.create({
        user_id: userId,
        items: [],
        total_amount: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Sepete ürün ekle
async function addToCart(userId: string, body: any, res: NextApiResponse) {
  try {
    console.log('Cart addToCart - userId:', userId);
    console.log('Cart addToCart - body:', JSON.stringify(body, null, 2));
    
    const { product_id, quantity = 1 } = body;

    if (!product_id) {
      console.error('Cart addToCart - product_id missing!');
      return res.status(400).json({ success: false, message: 'Ürün ID gerekli' });
    }

    // Ürünü kontrol et
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
    }

    // Sepeti bul veya oluştur
    let cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      cart = new Cart({
        user_id: userId,
        items: [],
        total_amount: 0,
      });
    }

    // Ürün sepette var mı kontrol et
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.product_id.toString() === product_id
    );

    if (existingItemIndex > -1) {
      // Varsa miktarını artır
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Yoksa yeni ekle
      const imageUrl = product.storage_files && product.storage_files.length > 0 
        ? product.storage_files[0].image_url 
        : '';

      cart.items.push({
        product_id: new mongoose.Types.ObjectId(product_id),
        name: product.name,
        price: product.price,
        quantity: quantity,
        weight: product.weight,
        image_url: imageUrl,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Ürün sepete eklendi',
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Sepetteki ürün miktarını güncelle
async function updateCartItem(userId: string, body: any, res: NextApiResponse) {
  try {
    const { product_id, quantity } = body;

    if (!product_id || quantity === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ürün ID ve miktar gerekli' 
      });
    }

    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Sepet bulunamadı' });
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.product_id.toString() === product_id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Ürün sepette bulunamadı' });
    }

    // Miktar 0 veya daha azsa ürünü kaldır
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Sepet güncellendi',
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Sepeti temizle
async function clearCart(userId: string, res: NextApiResponse) {
  try {
    const cart = await Cart.findOne({ user_id: userId });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Sepet bulunamadı' });
    }

    cart.items = [];
    cart.total_amount = 0;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Sepet temizlendi',
      data: cart,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
