"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, Row, Col, Statistic, Tag, Empty, Badge, Divider } from "antd";
import {
  ShoppingOutlined,
  InboxOutlined,
  AlertOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import { Product, productService } from "@/services/productService";

interface LowStockByCategory {
  categoria: string;
  productos: Product[];
}

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  // Productos con stock bajo (< 10 unidades) agrupados por categoría
  const lowStockProducts = products.filter((p) => p.stock < 10);
  const lowStockByCategory: LowStockByCategory[] = [];

  lowStockProducts.forEach((product) => {
    const existingCategory = lowStockByCategory.find(
      (cat) => cat.categoria === product.categoria
    );

    if (existingCategory) {
      existingCategory.productos.push(product);
    } else {
      lowStockByCategory.push({
        categoria: product.categoria,
        productos: [product],
      });
    }
  });

  // Ordenar por categoría
  lowStockByCategory.sort((a, b) => a.categoria.localeCompare(b.categoria));

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Dashboard
            </h1>
          </div>

          <Card className="mb-4 md:mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
              Bienvenido al Sistema{userProfile ? `, ${userProfile.name}` : ""}
            </h2>
            <p className="text-sm md:text-base text-gray-600">
              Este es tu panel de control para gestionar el inventario del
              almacén.
            </p>
          </Card>

          {/* Estadísticas Principales */}
          <Row gutter={[8, 8]} className="mb-4 md:mb-6 md:gutter-16">
            <Col xs={24} sm={12} lg={8}>
              <Card
                loading={loading}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Statistic
                  title={
                    <span className="text-xs md:text-sm">
                      Total de Productos
                    </span>
                  }
                  value={totalProducts}
                  prefix={<ShoppingOutlined className="text-sm md:text-base" />}
                  valueStyle={{ color: "#3f8600", fontSize: "20px" }}
                  suffix={<span className="text-xs md:text-sm">productos</span>}
                />
                <div className="text-xs text-gray-500 mt-1 md:mt-2">
                  Productos únicos registrados
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                loading={loading}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Statistic
                  title={
                    <span className="text-xs md:text-sm">Stock Total</span>
                  }
                  value={totalStock}
                  prefix={<InboxOutlined className="text-sm md:text-base" />}
                  valueStyle={{ color: "#1890ff", fontSize: "20px" }}
                  suffix={<span className="text-xs md:text-sm">unidades</span>}
                />
                <div className="text-xs text-gray-500 mt-1 md:mt-2">
                  Suma de todas las unidades
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                loading={loading}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Statistic
                  title={<span className="text-xs md:text-sm">Stock Bajo</span>}
                  value={lowStockProducts.length}
                  prefix={<AlertOutlined className="text-sm md:text-base" />}
                  valueStyle={{ color: "#cf1322", fontSize: "20px" }}
                  suffix={<span className="text-xs md:text-sm">productos</span>}
                />
                <div className="text-xs text-gray-500 mt-1 md:mt-2">
                  Productos con menos de 10 unidades
                </div>
              </Card>
            </Col>
          </Row>

          {/* Stock Bajo por Categorías */}
          <Card
            title={
              <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                <TagsOutlined className="text-red-500 text-sm md:text-base" />
                <span className="text-sm md:text-base">
                  Stock Bajo por Categorías
                </span>
                <Badge
                  count={lowStockProducts.length}
                  style={{ backgroundColor: "#cf1322" }}
                />
              </div>
            }
            loading={loading}
            className="shadow-md"
          >
            {lowStockByCategory.length === 0 ? (
              <Empty
                description="¡Excelente! No hay productos con stock bajo"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div className="space-y-4 md:space-y-6">
                {lowStockByCategory.map((categoryData) => (
                  <div key={categoryData.categoria}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2 md:mb-3">
                      <Tag
                        color="blue"
                        className="text-sm md:text-base font-semibold px-2 md:px-4 py-1 w-fit"
                      >
                        {categoryData.categoria}
                      </Tag>
                      <span className="text-xs md:text-sm text-gray-500">
                        ({categoryData.productos.length} producto
                        {categoryData.productos.length !== 1 ? "s" : ""} con
                        stock bajo)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                      {categoryData.productos.map((producto) => (
                        <Card
                          key={producto.id}
                          size="small"
                          className="border-l-4"
                          style={{
                            borderLeftColor:
                              producto.stock === 0
                                ? "#cf1322"
                                : producto.stock < 5
                                ? "#fa8c16"
                                : "#faad14",
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-sm md:text-base text-gray-800 mb-1">
                                {producto.producto}
                              </div>
                              <div className="text-xs text-gray-500 mb-2">
                                SKU: {producto.sku}
                              </div>
                              <div className="flex items-center gap-2">
                                <Tag
                                  color={
                                    producto.stock === 0
                                      ? "red"
                                      : producto.stock < 5
                                      ? "orange"
                                      : "gold"
                                  }
                                  className="font-semibold text-xs"
                                >
                                  {producto.stock === 0
                                    ? "SIN STOCK"
                                    : `${producto.stock} unidades`}
                                </Tag>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <Divider className="my-2 md:my-4" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
