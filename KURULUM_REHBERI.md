# 🚀 Karadağ Baharat - Hızlı Başlangıç Rehberi

## ⚡ HIZLI BAŞLANGIÇ

### 1. Sunucuyu Başlatın

Terminal'de projeyi başlatın:

```bash
npm run dev
```

Uygulama şu adreste çalışacak: **http://localhost:3000**

---

## 🔐 ADMİN PANELİNE GİRİŞ

### Adım 1: Veritabanını Başlatın

İlk admin kullanıcısı ve örnek verileri oluşturmak için:

**Tarayıcıda** veya **Postman'de** şu adrese **POST** isteği gönderin:

```
POST http://localhost:3000/api/init-db
```

#### Tarayıcıda Yapmak İçin:

1. Tarayıcınızı açın
2. F12 tuşuna basın (Developer Tools)
3. Console sekmesine gidin
4. Şu kodu yapıştırın ve Enter'a basın:

```javascript
fetch("http://localhost:3000/api/init-db", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

#### Terminal'de cURL ile:

```bash
curl -X POST http://localhost:3000/api/init-db
```

#### PowerShell'de:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/init-db" -Method POST
```

**BAŞARILI SONUÇ:**

```json
{
  "success": true,
  "message": "Veritabanı başarıyla başlatıldı!",
  "data": {
    "admin": {
      "email": "admin@karadagbaharat.com",
      "password": "admin123"
    },
    "categories_count": 6,
    "products_count": 6
  }
}
```

---

### Adım 2: Admin Olarak Giriş Yapın

1. Tarayıcıda **http://localhost:3000/auth/signin** adresine gidin

2. Giriş bilgileri:
   - **Email:** `admin@karadagbaharat.com`
   - **Şifre:** `admin123`

3. "Sign In" butonuna tıklayın

---

### Adım 3: Admin Paneline Erişin

Giriş yaptıktan sonra:

- **Admin Paneli:** http://localhost:3000/dashboard/home
- **Ürünler:** http://localhost:3000/dashboard/products
- **Yeni Ürün Ekle:** http://localhost:3000/dashboard/products/add
- **Kullanıcılar:** http://localhost:3000/dashboard/users

---

## 🛠️ YENİ BAHARAT EKLEME

### Web Arayüzünden:

1. Admin paneline giriş yapın
2. Sol menüden **"Products"** seçin
3. Sağ üstteki **"+ Yeni Ürün Ekle"** butonuna tıklayın
4. Formu doldurun:
   - **Ürün Adı:** (Örn: Antep Fıstığı Biber)
   - **Açıklama:** Ürün hakkında bilgi
   - **Kategori:** Listeden seçin
   - **Fiyat:** TL cinsinden (Örn: 45.50)
   - **Ağırlık:** Gram cinsinden (Örn: 100)
   - **Stok:** Adet (Örn: 50)
   - **SKU:** Opsiyonel (boş bırakabilirsiniz)
   - **Görsel URL:** Unsplash'tan bir görsel URL'i

5. **"Ürün Ekle"** butonuna tıklayın

### Ücretsiz Görsel Kaynakları:

- **Unsplash:** https://unsplash.com/s/photos/spices
- **Pexels:** https://www.pexels.com/search/spices/

Görsel URL formatı: `https://images.unsplash.com/photo-xxxxx?w=600`

---

## 📊 MEVCUT VERİLER

Veritabanını başlattığınızda otomatik oluşturulanlar:

### Kategoriler:

1. Kırmızı Biber
2. Karabiber
3. Kimyon
4. Sumak
5. Kekik
6. Pul Biber

### Örnek Ürünler:

- Maraş Kırmızı Biber - 100gr (45 TL)
- Urfa Kırmızı Biber - 250gr (95 TL)
- Tane Karabiber - 50gr (35 TL)
- Öğütülmüş Karabiber - 100gr (50 TL)
- Tane Kimyon - 100gr (40 TL)
- Sumak - 150gr (55 TL)

---

## 🌐 SAYFA LİNKLERİ

### Kullanıcı Sayfaları:

- **Ana Sayfa:** http://localhost:3000
- **Hakkımızda:** http://localhost:3000/about-us
- **İletişim:** http://localhost:3000/contact-us
- **Sepet:** http://localhost:3000/cart
- **Ürünler:** http://localhost:3000/products/all
- **Kayıt:** http://localhost:3000/auth/signup
- **Giriş:** http://localhost:3000/auth/signin

### Admin Sayfaları:

- **Dashboard:** http://localhost:3000/dashboard/home
- **Ürünler Listesi:** http://localhost:3000/dashboard/products
- **Yeni Ürün Ekle:** http://localhost:3000/dashboard/products/add
- **Kullanıcılar:** http://localhost:3000/dashboard/users

---

## ❓ SORUN GİDERME

### "Veritabanı zaten başlatılmış" hatası:

- Bu normal! Zaten bir admin kullanıcısı var demektir
- Direkt giriş yapabilirsiniz

### Giriş yapamıyorum:

1. Email'i tamamen küçük harf olarak yazın: `admin@karadagbaharat.com`
2. Şifre: `admin123` (tam olarak böyle)
3. Veritabanının başlatıldığından emin olun

### MongoDB bağlantı hatası:

1. `.env.local` dosyasında `MONGODB_URI` değişkeninin doğru olduğundan emin olun
2. MongoDB Atlas'ta IP adresinizin ekli olduğunu kontrol edin
3. Şifrenizde özel karakterler varsa URL encode edin

### Ürünler görünmüyor:

1. Veritabanını başlattınız mı? (init-db endpoint'i)
2. Admin panelinden yeni ürün ekleyin
3. Tarayıcıyı yenileyin (Ctrl+R)

---

## 💡 İPUÇLARI

1. **Şifre Değiştirin:** İlk girişten sonra admin şifresini mutlaka değiştirin
2. **Görsel URL'leri:** Unsplash'tan kaliteli görseller kullanın
3. **SKU Kodları:** Boş bırakırsanız otomatik oluşturulur
4. **Kategori Ekle:** `/api/categories` endpoint'ini kullanarak yeni kategoriler ekleyin

---

## 🎯 SONRAKİ ADIMLAR

1. ✅ Admin olarak giriş yapın
2. ✅ Mevcut ürünleri inceleyin
3. ✅ Kendi baharatlarınızı ekleyin
4. ✅ Kullanıcı olarak kayıt olup alışveriş deneyin
5. ✅ Sepete ürün ekleyin ve test edin

---

## 📞 DESTEK

Sorun yaşarsanız:

- Terminalde hata mesajlarını kontrol edin
- Tarayıcı konsolunu (F12) kontrol edin
- MongoDB bağlantısını doğrulayın

**Başarılar! 🎉**
