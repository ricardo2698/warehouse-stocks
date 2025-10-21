"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  Badge,
  Tooltip,
  Modal,
  Table,
  Tag,
  Button,
  Segmented,
  Empty,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  InboxOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Product, productService } from "@/services/productService";

type ViewMode = "grid" | "list";

interface LocationProducts {
  [key: string]: Product[];
}

interface LocationStats {
  pasillo: string;
  estanteria: string;
  nivel: string;
  productos: Product[];
  count: number;
}

// Configuración de la estructura de la bodega
const BODEGA_CONFIG = {
  pasillos: 3, // P1, P2, P3
  estanterias: 4, // E1, E2, E3, E4
  niveles: ["N3", "N2", "N1"], // De arriba a abajo
};

export default function BodegaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationStats | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  // Agrupar productos por ubicación
  const groupByLocation = (): LocationProducts => {
    const grouped: LocationProducts = {};
    products.forEach((product) => {
      const location = product.ubicacion;
      if (!grouped[location]) {
        grouped[location] = [];
      }
      grouped[location].push(product);
    });
    return grouped;
  };

  // Generar estructura completa de la bodega (incluyendo ubicaciones vacías)
  const getBodegaStructure = () => {
    const locations = groupByLocation();
    const structure: {
      [pasillo: string]: {
        [estanteria: string]: { [nivel: string]: Product[] };
      };
    } = {};

    // Crear TODA la estructura de la bodega
    for (let p = 1; p <= BODEGA_CONFIG.pasillos; p++) {
      const pasillo = `P${p}`;
      structure[pasillo] = {};

      for (let e = 1; e <= BODEGA_CONFIG.estanterias; e++) {
        const estanteria = `E${e}`;
        structure[pasillo][estanteria] = {};

        BODEGA_CONFIG.niveles.forEach((nivel) => {
          // Inicializar con array vacío
          structure[pasillo][estanteria][nivel] = [];
        });
      }
    }

    // Llenar con productos existentes
    Object.entries(locations).forEach(([ubicacion, productos]) => {
      const [pasillo, estanteria, nivel] = ubicacion.split("-");

      if (
        structure[pasillo] &&
        structure[pasillo][estanteria] &&
        structure[pasillo][estanteria][nivel] !== undefined
      ) {
        structure[pasillo][estanteria][nivel] = productos;
      }
    });

    return structure;
  };

  const structure = getBodegaStructure();
  const pasillos = Object.keys(structure).sort();

  // Calcular volumen de un producto en cm³
  const calculateVolume = (producto: Product) => {
    const { dimensiones } = producto;
    let largo = dimensiones.largo;
    let ancho = dimensiones.ancho;
    let alto = dimensiones.alto;

    // Convertir a cm si está en metros
    if (dimensiones.unidad === "m") {
      largo *= 100;
      ancho *= 100;
      alto *= 100;
    } else if (dimensiones.unidad === "in") {
      largo *= 2.54;
      ancho *= 2.54;
      alto *= 2.54;
    }

    return largo * ancho * alto;
  };

  // Calcular estadísticas de ubicación
  const getLocationStats = (productos: Product[]) => {
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const totalVolume = productos.reduce(
      (sum, p) => sum + calculateVolume(p) * p.stock,
      0
    );
    const productCount = productos.length;

    return { totalStock, totalVolume, productCount };
  };

  // Obtener color según stock y volumen
  const getOccupancyColor = (productos: Product[]) => {
    if (productos.length === 0) return "bg-gray-100 border-gray-300";

    const { totalStock, totalVolume } = getLocationStats(productos);

    // Considerando stock y volumen
    // Volumen en litros (1000 cm³ = 1 litro)
    const volumeInLiters = totalVolume / 1000;

    // Criterios combinados
    if (totalStock === 0) return "bg-gray-100 border-gray-300";
    if (totalStock <= 10 && volumeInLiters <= 50)
      return "bg-gradient-to-br from-green-400 to-green-600 border-green-500";
    if (totalStock <= 30 && volumeInLiters <= 200)
      return "bg-gradient-to-br from-yellow-400 to-orange-500 border-orange-600";
    return "bg-gradient-to-br from-red-400 to-red-600 border-red-700";
  };

  const getOccupancyLabel = (productos: Product[]) => {
    if (productos.length === 0) return { text: "Vacío", color: "default" };

    const { totalStock, totalVolume } = getLocationStats(productos);
    const volumeInLiters = totalVolume / 1000;

    if (totalStock === 0) return { text: "Vacío", color: "default" };
    if (totalStock <= 10 && volumeInLiters <= 50)
      return { text: "Bajo", color: "success" };
    if (totalStock <= 30 && volumeInLiters <= 200)
      return { text: "Medio", color: "warning" };
    return { text: "Alto", color: "error" };
  };

  // Manejar click en ubicación
  const handleLocationClick = (
    pasillo: string,
    estanteria: string,
    nivel: string,
    productos: Product[]
  ) => {
    setSelectedLocation({
      pasillo,
      estanteria,
      nivel,
      productos,
      count: productos.length,
    });
    setModalOpen(true);
  };

  // Columnas para la tabla del modal
  const columns = [
    {
      title: "Producto",
      dataIndex: "producto",
      key: "producto",
      width: 200,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 120,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      render: (stock: number) => (
        <Tag color={stock > 20 ? "green" : stock > 0 ? "orange" : "red"}>
          {stock} unidades
        </Tag>
      ),
    },
    {
      title: "Dimensiones",
      key: "dimensiones",
      width: 150,
      render: (_: any, record: Product) => (
        <span className="text-xs">
          {record.dimensiones.largo} x {record.dimensiones.ancho} x{" "}
          {record.dimensiones.alto} {record.dimensiones.unidad}
        </span>
      ),
    },
    {
      title: "Volumen Unitario",
      key: "volumen",
      width: 120,
      render: (_: any, record: Product) => {
        const volume = calculateVolume(record);
        return <span className="text-xs">{(volume / 1000).toFixed(2)} L</span>;
      },
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      width: 120,
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
  ];

  // Calcular estadísticas
  const totalLocations =
    BODEGA_CONFIG.pasillos *
    BODEGA_CONFIG.estanterias *
    BODEGA_CONFIG.niveles.length;

  const occupiedLocations = Object.values(groupByLocation()).filter(
    (p) => p.length > 0
  ).length;

  const occupancyRate =
    totalLocations > 0
      ? ((occupiedLocations / totalLocations) * 100).toFixed(1)
      : 0;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                <EnvironmentOutlined className="mr-2 text-base md:text-2xl" />
                Mapa de Bodega
              </h1>
              <p className="text-sm md:text-base text-gray-600 mt-1">
                Visualiza la distribución de productos en la bodega
              </p>
            </div>
            <Segmented
              options={[
                {
                  label: <span className="hidden sm:inline">Cuadrícula</span>,
                  value: "grid",
                  icon: <AppstoreOutlined />,
                },
                {
                  label: <span className="hidden sm:inline">Lista</span>,
                  value: "list",
                  icon: <UnorderedListOutlined />,
                },
              ]}
              value={viewMode}
              onChange={(value) => setViewMode(value as ViewMode)}
              size="middle"
            />
          </div>

          {/* Estadísticas */}
          <Row gutter={[8, 8]} className="mb-4 md:mb-6 md:gutter-16">
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title={
                    <span className="text-xs md:text-sm">
                      Ubicaciones Totales
                    </span>
                  }
                  value={totalLocations}
                  prefix={<InboxOutlined className="text-sm md:text-base" />}
                  valueStyle={{ color: "#1890ff", fontSize: "20px" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title={
                    <span className="text-xs md:text-sm">
                      Ubicaciones Ocupadas
                    </span>
                  }
                  value={occupiedLocations}
                  prefix={<InboxOutlined className="text-sm md:text-base" />}
                  valueStyle={{ color: "#52c41a", fontSize: "20px" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title={
                    <span className="text-xs md:text-sm">
                      Tasa de Ocupación
                    </span>
                  }
                  value={occupancyRate}
                  suffix="%"
                  valueStyle={{ color: "#faad14", fontSize: "20px" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Leyenda */}
          <Card className="mb-4 md:mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 flex-wrap">
              <div className="font-semibold text-sm md:text-base text-gray-700">
                Nivel de Ocupación:
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gray-100 border-2 border-gray-300 rounded"></div>
                <span className="text-xs md:text-sm">Vacío</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-green-400 to-green-600 border-2 border-green-500 rounded"></div>
                <span className="text-xs md:text-sm">Bajo (≤10u / ≤50L)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-orange-600 rounded"></div>
                <span className="text-xs md:text-sm">Medio (≤30u / ≤200L)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-red-400 to-red-600 border-2 border-red-700 rounded"></div>
                <span className="text-xs md:text-sm">Alto (31+ / 201+L)</span>
              </div>
            </div>
          </Card>

          {/* Vista de Cuadrícula */}
          {viewMode === "grid" && (
            <div className="space-y-4 md:space-y-8">
              {pasillos.map((pasillo) => (
                <Card
                  key={pasillo}
                  title={
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-base md:text-xl font-bold">
                        Pasillo {pasillo.replace("P", "")}
                      </span>
                    </div>
                  }
                  className="shadow-lg"
                  headStyle={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
                    {Object.keys(structure[pasillo])
                      .sort()
                      .map((estanteria) => (
                        <div
                          key={estanteria}
                          className="space-y-1 md:space-y-2"
                        >
                          <div className="text-center text-xs md:text-sm font-semibold text-gray-700 bg-gray-100 py-1 md:py-2 rounded-t-lg">
                            Est. {estanteria.replace("E", "")}
                          </div>
                          <div className="space-y-2">
                            {BODEGA_CONFIG.niveles.map((nivel) => {
                              const productos =
                                structure[pasillo][estanteria][nivel] || [];
                              const count = productos.length;
                              const stats = getLocationStats(productos);
                              const occupancy = getOccupancyLabel(productos);

                              return (
                                <Tooltip
                                  key={nivel}
                                  title={
                                    <div className="space-y-1">
                                      <div className="font-semibold text-base">
                                        {pasillo}-{estanteria}-{nivel}
                                      </div>
                                      {count === 0 ? (
                                        <div className="text-sm text-gray-300">
                                          📭 Ubicación vacía
                                        </div>
                                      ) : (
                                        <>
                                          <div className="text-sm">
                                            📦 {count} producto
                                            {count !== 1 ? "s" : ""}
                                          </div>
                                          <div className="text-sm">
                                            📊 Stock Total: {stats.totalStock}{" "}
                                            unidades
                                          </div>
                                          <div className="text-sm">
                                            📐 Volumen Total:{" "}
                                            {(stats.totalVolume / 1000).toFixed(
                                              2
                                            )}{" "}
                                            L
                                          </div>
                                          <div className="text-xs mt-2 text-blue-300">
                                            Click para ver detalles
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  }
                                >
                                  <div
                                    className={`
                                        ${getOccupancyColor(productos)}
                                        border-2 rounded-lg p-2 md:p-3
                                        transition-all duration-200
                                        ${
                                          count === 0
                                            ? "cursor-default opacity-60"
                                            : "cursor-pointer hover:scale-105 hover:shadow-lg"
                                        }
                                      `}
                                    onClick={() =>
                                      count > 0 &&
                                      handleLocationClick(
                                        pasillo,
                                        estanteria,
                                        nivel,
                                        productos
                                      )
                                    }
                                  >
                                    <div className="text-center space-y-0.5 md:space-y-1">
                                      <div
                                        className={`text-[10px] md:text-xs font-bold ${
                                          count === 0
                                            ? "text-gray-500"
                                            : "text-white"
                                        }`}
                                      >
                                        {nivel}
                                      </div>
                                      {count > 0 ? (
                                        <>
                                          <div className="text-[10px] md:text-xs text-white font-semibold">
                                            {stats.totalStock} u
                                          </div>
                                          <Badge
                                            count={count}
                                            style={{
                                              backgroundColor: "#fff",
                                              color: "#000",
                                              fontWeight: "bold",
                                              fontSize: "9px",
                                            }}
                                            overflowCount={99}
                                          />
                                        </>
                                      ) : (
                                        <div className="text-[9px] md:text-xs text-gray-400">
                                          Vacío
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Vista de Lista */}
          {viewMode === "list" && (
            <Card>
              <Table
                dataSource={(() => {
                  const allLocations: {
                    key: string;
                    ubicacion: string;
                    cantidad: number;
                    productos: Product[];
                  }[] = [];
                  for (let p = 1; p <= BODEGA_CONFIG.pasillos; p++) {
                    for (let e = 1; e <= BODEGA_CONFIG.estanterias; e++) {
                      BODEGA_CONFIG.niveles.forEach((nivel) => {
                        const ubicacion = `P${p}-E${e}-${nivel}`;
                        const productos =
                          structure[`P${p}`][`E${e}`][nivel] || [];
                        allLocations.push({
                          key: ubicacion,
                          ubicacion,
                          cantidad: productos.length,
                          productos,
                        });
                      });
                    }
                  }
                  return allLocations;
                })()}
                columns={[
                  {
                    title: "Ubicación",
                    dataIndex: "ubicacion",
                    key: "ubicacion",
                    render: (text: string) => (
                      <Tag color="purple" className="font-mono text-sm">
                        {text}
                      </Tag>
                    ),
                  },
                  {
                    title: "Productos",
                    dataIndex: "cantidad",
                    key: "cantidad",
                    render: (_: any, record: any) => {
                      return (
                        <div className="space-y-1">
                          <div>{record.cantidad} tipos</div>
                          <div className="text-xs text-gray-500">
                            {getLocationStats(record.productos).totalStock}{" "}
                            unidades totales
                          </div>
                        </div>
                      );
                    },
                    sorter: (a, b) => a.cantidad - b.cantidad,
                  },
                  {
                    title: "Volumen Total",
                    key: "volumen",
                    render: (_: any, record: any) => {
                      const stats = getLocationStats(record.productos);
                      return (
                        <Tag color="cyan">
                          {(stats.totalVolume / 1000).toFixed(2)} L
                        </Tag>
                      );
                    },
                    sorter: (a, b) => {
                      const volA = getLocationStats(a.productos).totalVolume;
                      const volB = getLocationStats(b.productos).totalVolume;
                      return volA - volB;
                    },
                  },
                  {
                    title: "Ocupación",
                    key: "ocupacion",
                    render: (_: any, record: any) => {
                      const occupancy = getOccupancyLabel(record.productos);
                      return (
                        <Tag color={occupancy.color}>{occupancy.text}</Tag>
                      );
                    },
                  },
                  {
                    title: "Acciones",
                    key: "actions",
                    render: (_, record) => {
                      const [pasillo, estanteria, nivel] =
                        record.ubicacion.split("-");
                      return (
                        <Button
                          type="link"
                          onClick={() =>
                            handleLocationClick(
                              pasillo,
                              estanteria,
                              nivel,
                              record.productos
                            )
                          }
                        >
                          Ver Productos
                        </Button>
                      );
                    },
                  },
                ]}
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showTotal: (total) => `Total ${total} ubicaciones`,
                }}
              />
            </Card>
          )}

          {/* Modal de Detalles */}
          <Modal
            title={
              selectedLocation && (
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <EnvironmentOutlined className="text-white text-base md:text-xl" />
                  </div>
                  <div>
                    <div className="text-base md:text-xl font-bold">
                      {selectedLocation.pasillo}-{selectedLocation.estanteria}-
                      {selectedLocation.nivel}
                    </div>
                    <div className="text-xs md:text-sm font-normal text-gray-500">
                      {selectedLocation.count} producto
                      {selectedLocation.count !== 1 ? "s" : ""} •{" "}
                      {getLocationStats(selectedLocation.productos).totalStock}{" "}
                      unid. •{" "}
                      {(
                        getLocationStats(selectedLocation.productos)
                          .totalVolume / 1000
                      ).toFixed(2)}{" "}
                      L
                    </div>
                  </div>
                </div>
              )
            }
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            footer={null}
            width="95%"
            style={{ maxWidth: 800 }}
          >
            {selectedLocation && (
              <>
                <div className="mb-4 p-3 md:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <Row gutter={[8, 16]}>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title={
                          <span className="text-xs md:text-sm">
                            Total Productos
                          </span>
                        }
                        value={selectedLocation.count}
                        prefix="📦"
                        valueStyle={{ fontSize: "20px" }}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title={
                          <span className="text-xs md:text-sm">
                            Stock Total
                          </span>
                        }
                        value={
                          getLocationStats(selectedLocation.productos)
                            .totalStock
                        }
                        suffix={<span className="text-xs">unidades</span>}
                        prefix="📊"
                        valueStyle={{ fontSize: "20px", color: "#52c41a" }}
                      />
                    </Col>
                    <Col xs={24} sm={8}>
                      <Statistic
                        title={
                          <span className="text-xs md:text-sm">
                            Volumen Total
                          </span>
                        }
                        value={(
                          getLocationStats(selectedLocation.productos)
                            .totalVolume / 1000
                        ).toFixed(2)}
                        suffix="L"
                        prefix="📐"
                        valueStyle={{ fontSize: "20px", color: "#1890ff" }}
                      />
                    </Col>
                  </Row>
                </div>
                <Table
                  dataSource={selectedLocation.productos}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  scroll={{ x: 600 }}
                  size="small"
                />
              </>
            )}
          </Modal>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
