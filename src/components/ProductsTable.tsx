"use client";

import { Table, Button, Space, Tag, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Product } from "@/services/productService";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onViewDetail: (product: Product) => void;
  onUpdateStock: (product: Product) => void;
  userRole?: "admin" | "assistant";
}

export const ProductsTable = ({
  products,
  loading,
  onEdit,
  onDelete,
  onViewDetail,
  onUpdateStock,
  userRole = "assistant",
}: ProductsTableProps) => {
  const columns: ColumnsType<Product> = [
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      width: 100,
      fixed: window.innerWidth > 768 ? "left" : false,
      render: (text: string) => (
        <span className="text-xs md:text-sm">{text}</span>
      ),
    },
    {
      title: "Producto",
      dataIndex: "producto",
      key: "producto",
      width: 180,
      fixed: window.innerWidth > 768 ? "left" : false,
      render: (text: string) => (
        <span className="text-xs md:text-sm">{text}</span>
      ),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      key: "categoria",
      width: 100,
      render: (categoria: string) => (
        <Tag color="blue" className="text-xs">
          {categoria}
        </Tag>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      width: 80,
      align: "center",
      render: (stock: number) => (
        <Tag
          color={stock > 20 ? "green" : stock > 0 ? "orange" : "red"}
          className="text-xs"
        >
          {stock}
        </Tag>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Tamaño",
      dataIndex: "tamaño",
      key: "tamaño",
      width: 90,
      responsive: ["md"] as any,
      render: (tamaño: string) => (
        <Tag
          color={
            tamaño === "grande"
              ? "purple"
              : tamaño === "mediano"
              ? "cyan"
              : "default"
          }
          className="text-xs"
        >
          {tamaño}
        </Tag>
      ),
    },
    {
      title: "Ubicación",
      dataIndex: "ubicacion",
      key: "ubicacion",
      width: 100,
      render: (text: string) => (
        <span className="text-xs md:text-sm">{text}</span>
      ),
    },
    {
      title: "Peso",
      key: "peso",
      width: 90,
      responsive: ["lg"] as any,
      render: (_, record) => (
        <span className="text-xs">{`${record.peso} ${record.unidad_peso}`}</span>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: window.innerWidth > 768 ? 180 : 120,
      fixed: window.innerWidth > 768 ? "right" : false,
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Ver detalle">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Modificar stock">
            <Button
              type="text"
              icon={<InboxOutlined />}
              onClick={() => onUpdateStock(record)}
              size="small"
            />
          </Tooltip>
          {/* Solo admin puede editar y eliminar */}
          {userRole === "admin" && (
            <>
              <Tooltip title="Editar">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
                  size="small"
                />
              </Tooltip>
              <Popconfirm
                title="Eliminar producto"
                description="¿Estás seguro de eliminar este producto?"
                onConfirm={() => record.id && onDelete(record.id)}
                okText="Sí, eliminar"
                cancelText="Cancelar"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Eliminar">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                  />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      rowKey="id"
      scroll={{ x: 800 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} productos`,
        responsive: true,
        simple: window.innerWidth < 768,
      }}
      size={window.innerWidth < 768 ? "small" : "middle"}
      className="responsive-table"
    />
  );
};
