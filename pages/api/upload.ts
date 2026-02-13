/**
 * Görsel Yükleme API
 * Admin kullanıcıları buradan görsel yükleyebilir
 */
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

// Body parser'ı devre dışı bırak, formidable kullanacağız
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), 'public', 'images'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    // Upload klasörünü oluştur
    const uploadDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ message: 'Dosya yükleme hatası', error: err.message });
      }

      const file = files.file as File | File[];
      const uploadedFile = Array.isArray(file) ? file[0] : file;

      if (!uploadedFile) {
        return res.status(400).json({ message: 'Dosya bulunamadı' });
      }

      // Dosya adını temizle ve yeniden adlandır
      const originalName = uploadedFile.originalFilename || 'unnamed';
      const timestamp = Date.now();
      const extension = path.extname(originalName);
      const newFileName = `product_${timestamp}${extension}`;
      const newPath = path.join(uploadDir, newFileName);

      // Dosyayı taşı
      fs.renameSync(uploadedFile.filepath, newPath);

      // URL'i döndür
      const imageUrl = `/images/${newFileName}`;
      return res.status(200).json({
        message: 'Dosya başarıyla yüklendi',
        url: imageUrl,
      });
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
}
