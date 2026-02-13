/**
 * Admin Ürün Ekleme Sayfası
 * Admin kullanıcıları buradan yeni baharat ekleyebilir
 */
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Card, Alert, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import AdminLayout from '@/components/layouts/AdminLayout';
import { NextPageWithLayout } from '@/pages/_app';
import { createProduct } from '@/data/api/products';
import { getCategories } from '@/data/api/category';

const AddProduct: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    descriptions: '',
    quantity: 0,
    weight: 0,
    price: 0,
    sku: '',
    category_id: '',
    image_url: '',
  });

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        console.error('Kategori yükleme hatası:', err);
      }
    };
    fetchCategories();
  }, []);

  // Form değişikliklerini handle et
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'weight' || name === 'price' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  // Dosya yükleme
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setError('Lütfen sadece görsel dosyası yükleyin');
      return;
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    try {
      setUploadingImage(true);
      setError('');

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedImageUrl(data.url);
        setFormData(prev => ({ ...prev, image_url: data.url }));
        setSuccess('Görsel başarıyla yüklendi!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Görsel yüklenemedi');
      }
    } catch (err) {
      setError('Görsel yüklenirken hata oluştu');
    } finally {
      setUploadingImage(false);
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError('');
    setSuccess('');

    // Debug: Alanları yazdır
    console.log('formData:', formData);
    console.log('uploadedImageUrl:', uploadedImageUrl);
    console.log('session:', session);

    // Session kontrolü
    if (!session) {
      setError('Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.');
      return;
    }

    // Validasyon (0 hariç boşlukları kontrol et)
    if (
      !formData.name.trim() ||
      !formData.descriptions.trim() ||
      !formData.category_id ||
      formData.price === null || formData.price === undefined || isNaN(Number(formData.price)) || Number(formData.price) < 0 ||
      formData.weight === null || formData.weight === undefined || isNaN(Number(formData.weight)) || Number(formData.weight) < 0
    ) {
      setError('Lütfen tüm zorunlu alanları doldurun');
      return;
    }

    if (!uploadedImageUrl) {
      setError('Lütfen bir ürün görseli yükleyin');
      return;
    }

    try {
      setLoading(true);
      const token = (session as any)?.access_token;

      // Ürün verisini hazırla
      const productData = {
        ...formData,
        storage_files: formData.image_url ? [{
          image_url: formData.image_url,
          type: 'image',
        }] : [],
      };

      // API'ye gönder
      const response = await createProduct(productData);
      
      if (response.data) {
        setSuccess('Ürün başarıyla eklendi!');
        // Formu temizle
        setFormData({
          name: '',
          descriptions: '',
          quantity: 0,
          weight: 0,
          price: 0,
          sku: '',
          category_id: '',
          image_url: '',
        });

        // 2 saniye sonra ürün listesine yönlendir
        setTimeout(() => {
          router.push('/dashboard/products');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ürün eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="py-4 px-3">
      <Col md={{ span: 8, offset: 2 }}>
        <Card>
          <Card.Header className="bg-primary text-white">
            <h4 className="mb-0">Yeni Baharat Ekle</h4>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ürün Adı *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Örn: Maraş Kırmızı Biber"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>SKU Kodu</Form.Label>
                    <Form.Control
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="Boş bırakılırsa otomatik oluşturulur"
                    />
                    <Form.Text className="text-muted">
                      Örn: MRB-100 (Boş bırakabilirsiniz)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Açıklama *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descriptions"
                  value={formData.descriptions}
                  onChange={handleChange}
                  placeholder="Ürün açıklamasını yazın..."
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Kategori *</Form.Label>
                    <Form.Select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Kategori Seçin</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ürün Görseli *</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                    />
                    <Form.Text className="text-muted">
                      Maksimum dosya boyutu: 5MB (JPG, PNG, GIF)
                    </Form.Text>
                    {uploadingImage && (
                      <div className="mt-2">
                        <span className="text-primary">Yükleniyor...</span>
                      </div>
                    )}
                    {uploadedImageUrl && (
                      <div className="mt-3">
                        <Image
                          src={uploadedImageUrl}
                          alt="Yüklenen görsel"
                          width={200}
                          height={200}
                          style={{ objectFit: 'cover', borderRadius: '8px' }}
                          unoptimized
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>


              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ağırlık (gram) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="100"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fiyat (₺) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0"
                      required
                      min={0}
                      step="0.01"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stok Miktarı</Form.Label>
                    <Form.Control
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex justify-content-between mt-4">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/dashboard/home')}
                >
                  İptal
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

AddProduct.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AddProduct;
