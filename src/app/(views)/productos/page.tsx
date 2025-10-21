"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProductsTable } from "@/components/ProductsTable";
import { ProductForm } from "@/components/ProductForm";
import { StockModal } from "@/components/StockModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { ImportProductsModal } from "@/components/ImportProductsModal";
import { Button, message, Card, Space } from "antd";
import { PlusOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Product, productService } from "@/services/productService";
import { Category, categoryService } from "@/services/categoryService";
import { useAuth } from "@/context/AuthContext";

export default function ProductosPage() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Verificar si es admin
  const isAdmin = userProfile?.role === "admin";

  // Cargar productos y categorías
  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      message.error("Error al cargar los datos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Agregar o editar producto
  const handleSubmitProduct = async (product: Omit<Product, "id">) => {
    try {
      if (selectedProduct?.id) {
        await productService.update(selectedProduct.id, product);
      } else {
        await productService.create(product);
      }
      await loadData();
    } catch (error) {
      throw error;
    }
  };

  // Eliminar producto
  const handleDeleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      message.success("Producto eliminado correctamente");
      await loadData();
    } catch (error) {
      message.error("Error al eliminar el producto");
      console.error(error);
    }
  };

  // Actualizar stock
  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      await productService.updateStock(id, newStock);
      await loadData();
    } catch (error) {
      throw error;
    }
  };

  // Abrir modal de edición
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  // Abrir modal de nuevo producto
  const handleNewProduct = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  // Abrir modal de stock
  const handleOpenStockModal = (product: Product) => {
    setSelectedProduct(product);
    setStockModalOpen(true);
  };

  // Abrir modal de detalle
  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Productos
            </h1>
            {/* Solo admin puede agregar productos */}
            {isAdmin && (
              <Space className="flex-wrap" size="small">
                <Button
                  type="default"
                  icon={<CloudUploadOutlined />}
                  onClick={() => setImportModalOpen(true)}
                  size="middle"
                  className="text-xs md:text-sm"
                >
                  <span className="hidden sm:inline">Importar Masivo</span>
                  <span className="sm:hidden">Importar</span>
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleNewProduct}
                  size="middle"
                  className="text-xs md:text-sm"
                >
                  <span className="hidden sm:inline">Agregar Producto</span>
                  <span className="sm:hidden">Agregar</span>
                </Button>
              </Space>
            )}
          </div>

          <Card>
            <ProductsTable
              products={products}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDeleteProduct}
              onViewDetail={handleViewDetail}
              onUpdateStock={handleOpenStockModal}
              userRole={userProfile?.role}
            />
          </Card>

          <ProductForm
            open={formOpen}
            product={selectedProduct}
            categories={categories}
            onClose={() => {
              setFormOpen(false);
              setSelectedProduct(null);
            }}
            onSubmit={handleSubmitProduct}
          />

          <StockModal
            open={stockModalOpen}
            product={selectedProduct}
            onClose={() => {
              setStockModalOpen(false);
              setSelectedProduct(null);
            }}
            onSubmit={handleUpdateStock}
          />

          <ProductDetailModal
            open={detailModalOpen}
            product={selectedProduct}
            onClose={() => {
              setDetailModalOpen(false);
              setSelectedProduct(null);
            }}
          />

          <ImportProductsModal
            open={importModalOpen}
            onClose={() => setImportModalOpen(false)}
            categories={categories}
            onImportComplete={loadData}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
