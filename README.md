# Karadağ Baharat - E-Ticaret Platformu

Modern ve dinamik baharat satış platformu. Next.js, MongoDB Atlas ve React ile geliştirilmiştir.

## 🌟 Özellikler

- ✅ Kullanıcı kayıt ve giriş sistemi
- ✅ Admin paneli ile ürün yönetimi
- ✅ Kategori bazlı ürün listeleme
- ✅ Sepet sistemi (cookie bazlı)
- ✅ Responsive tasarım
- ✅ MongoDB Atlas ile veritabanı entegrasyonu
- ✅ Güvenli kimlik doğrulama (NextAuth.js)

## 📋 Gereksinimler

- Node.js 16.x veya üzeri
- MongoDB Atlas hesabı (ücretsiz tier yeterli)
- npm veya yarn paket yöneticisi

## 🚀 Kurulum

### 1. Projeyi İndirin

```bash
# Repo'yu klonlayın veya indirin
cd morning-bakery-main
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) sitesine gidin ve ücretsiz hesap oluşturun
2. Yeni bir Cluster oluşturun (ücretsiz tier yeterli)
3. Database Access bölümünden yeni bir kullanıcı oluşturun
4. Network Access bölümünden IP adresinizi ekleyin (veya 0.0.0.0/0 ile herkese açın)
5. Cluster'a tıklayıp "Connect" butonuna basın
6. "Connect your application" seçeneğini seçin
7. Connection string'i kopyalayın

### 4. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyasını açın ve MongoDB connection string'inizi yapıştırın:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/karadag-baharat?retryWrites=true&w=majority

# Diğer ayarlar
NEXTAUTH_SECRET=212b9736ea9652e2ac23670597419b7272b094a6a94424c5348480a67e183f8b
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE=http://localhost:3000/api
API_BASE=http://localhost:3000/api
```

**Önemli:** `<username>` ve `<password>` kısımlarını MongoDB Atlas'ta oluşturduğunuz kullanıcı bilgileriyle değiştirin.

### 5. Veritabanını Başlatın

İlk admin kullanıcısı ve örnek verileri oluşturmak için:

```bash
# Uygulamayı başlatın
npm run dev

# Tarayıcıda veya Postman'de şu endpoint'e POST isteği gönderin:
# POST http://localhost:3000/api/init-db
```

Veya cURL ile:

```bash
curl -X POST http://localhost:3000/api/init-db
```

Bu işlem şunları oluşturacak:

- 1 Admin kullanıcısı (email: admin@karadagbaharat.com, şifre: admin123)
- 6 Baharat kategorisi
- 6 Örnek ürün

**UYARI:** İlk girişten sonra admin şifresini değiştirmeyi unutmayın!

### 6. Uygulamayı Çalıştırın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 🔑 İlk Giriş

Admin paneline erişmek için:

- Email: `admin@karadagbaharat.com`
- Şifre: `admin123`

Giriş yaptıktan sonra:

1. Admin paneline gidin: [http://localhost:3000/dashboard/home](http://localhost:3000/dashboard/home)
2. Şifrenizi değiştirin
3. Yeni ürünler ve kategoriler ekleyin

## 📁 Proje Yapısı

```
├── components/        # React bileşenleri
│   ├── auth/         # Kimlik doğrulama bileşenleri
│   ├── cart/         # Sepet bileşenleri
│   ├── dashboard/    # Admin paneli bileşenleri
│   └── ...
├── lib/              # Yardımcı kütüphaneler
│   └── mongodb.ts    # MongoDB bağlantı yöneticisi
├── models/           # Veritabanı modelleri
│   ├── User.ts       # Kullanıcı modeli
│   ├── Product.ts    # Ürün modeli
│   └── Category.ts   # Kategori modeli
├── pages/            # Next.js sayfaları
│   ├── api/          # API route'ları
│   │   ├── auth/     # Kimlik doğrulama API'leri
│   │   ├── products/ # Ürün API'leri
│   │   ├── categories/ # Kategori API'leri
│   │   └── users/    # Kullanıcı API'leri
│   ├── dashboard/    # Admin paneli sayfaları
│   └── ...
└── ...
```

## 🛠️ API Endpoint'leri

### Kimlik Doğrulama

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi

### Ürünler

- `GET /api/products` - Tüm ürünleri listele
- `POST /api/products` - Yeni ürün ekle (Admin)
- `GET /api/products/[id]` - Ürün detayı
- `PUT /api/products/[id]` - Ürün güncelle (Admin)
- `DELETE /api/products/[id]` - Ürün sil (Admin)

### Kategoriler

- `GET /api/categories` - Tüm kategorileri listele
- `POST /api/categories` - Yeni kategori ekle (Admin)

### Kullanıcılar

- `GET /api/users` - Tüm kullanıcıları listele (Admin)
- `POST /api/users` - Yeni kullanıcı oluştur

## 🎨 Admin Paneli Özellikleri

Admin olarak giriş yaptıktan sonra:

1. **Dashboard:** Genel istatistikleri görüntüleyin
2. **Ürün Yönetimi:** Yeni ürün ekleyin, düzenleyin veya silin
3. **Kategori Yönetimi:** Kategoriler oluşturun ve yönetin
4. **Kullanıcı Yönetimi:** Kullanıcıları görüntüleyin ve yönetin

## 🔒 Güvenlik

- Şifreler bcrypt ile hashlenir
- JWT token ile oturum yönetimi
- Admin yetkisi kontrolü
- CORS ve güvenlik başlıkları

## 📝 Notlar

- Bu proje development amaçlıdır
- Production'a alırken `init-db.ts` dosyasını silin
- HTTPS kullanmayı unutmayın
- Güvenli şifreler kullanın
- MongoDB connection string'inizi asla paylaşmayın

## 🐛 Sorun Giderme

### MongoDB bağlantı hatası

- Connection string'in doğru olduğundan emin olun
- MongoDB Atlas'ta IP adresinizin ekli olduğunu kontrol edin
- Kullanıcı adı ve şifrenin doğru olduğundan emin olun

### API istekleri çalışmıyor

- `.env.local` dosyasının doğru yapılandırıldığından emin olun
- Sunucuyu yeniden başlatın (npm run dev)
- Tarayıcı konsolunu kontrol edin

## 📄 Lisans

Bu proje eğitim amaçlıdır.

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

## 📧 İletişim

Sorularınız için: info@karadagbaharat.com
