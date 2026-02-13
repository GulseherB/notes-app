/**
 * Admin Ürünler Listesi Sayfası
 * Tüm ürünleri listeler ve düzenleme/silme imkanı sağlar
 */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { NextPageWithLayout } from '@/pages/_app';
import { getProducts, deleteProduct } from '@/data/api/products';

const ProductsList: NextPageWithLayout = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Ürünleri yükle
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data.data || []);
    } catch (err) {
      console.error('Ürün yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ürün sil
  const handleDelete = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setDeleteLoading(productId);
      const token = (session as any)?.access_token;
      await deleteProduct(productId);
      
      // Listeyi güncelle
      setProducts(products.filter(p => p._id !== productId));
      alert('Ürün başarıyla silindi');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ürün silinirken hata oluştu');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Row className="py-4 px-3">
      <Col>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Ürünler</h2>
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard/products/add')}
          >
            + Yeni Ürün Ekle
          </Button>
        </div>

        {loading ? (
          <Alert variant="info">Yükleniyor...</Alert>
        ) : products.length === 0 ? (
          <Alert variant="warning">
            Henüz ürün eklenmemiş. Yeni ürün eklemek için yukarıdaki butona tıklayın.
          </Alert>
        ) : (
          <Table responsive bordered hover>
            <thead className="bg-light">
              <tr>
                <th>Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Ağırlık</th>
                <th>Stok</th>
                <th>SKU</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.storage_files?.[0]?.image_url ? (
                      <Image
                        src={product.storage_files[0].image_url}
                        alt={product.name}
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover' }}
                        unoptimized
                      />
                    ) : (
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: '#e9ecef',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ fontSize: '10px' }}>Görsel Yok</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{product.name}</strong>
                    <br />
                    <small className="text-muted">
                      {product.descriptions?.substring(0, 50)}...
                    </small>
                  </td>
                  <td>{product.category_id?.name || 'N/A'}</td>
                  <td>
                    <strong>{product.price} TL</strong>
                  </td>
                  <td>{product.weight}g</td>
                  <td>
                    <Badge bg={product.quantity > 0 ? 'success' : 'danger'}>
                      {product.quantity}
                    </Badge>
                  </td>
                  <td>
                    <code>{product.sku}</code>
                  </td>
                  <td>
                    <Badge bg={product.is_active ? 'success' : 'secondary'}>
                      {product.is_active ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() => router.push(`/dashboard/products/edit/${product._id}`)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={deleteLoading === product._id}
                      onClick={() => handleDelete(product._id)}
                    >
                      {deleteLoading === product._id ? 'Siliniyor...' : 'Sil'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

ProductsList.getLayout = function getLayout(page: React.ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProductsList;
