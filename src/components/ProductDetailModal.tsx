"use client";

import { Modal, Descriptions, Tag, Divider } from "antd";
import { Product } from "@/services/productService";

interface ProductDetailModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal = ({
  open,
  product,
  onClose,
}: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <Modal
      title="Detalle del Producto"
      open={open}
      onCancel={onClose}
      footer={null}
      width="95%"
      style={{ maxWidth: 700 }}
    >
      <Descriptions bordered column={{ xs: 1, sm: 2 }} className="mt-4">
        <Descriptions.Item label="SKU" span={2}>
          <Tag color="blue">{product.sku}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Producto" span={2}>
          <strong>{product.producto}</strong>
        </Descriptions.Item>

        <Descriptions.Item label="Categoría">
          <Tag color="blue">{product.categoria}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Tamaño">
          <Tag
            color={
              product.tamaño === "grande"
                ? "purple"
                : product.tamaño === "mediano"
                ? "cyan"
                : "default"
            }
          >
            {product.tamaño}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Descripción" span={2}>
          {product.descripcion}
        </Descriptions.Item>

        <Descriptions.Item label="Stock">
          <Tag
            color={
              product.stock > 20
                ? "green"
                : product.stock > 0
                ? "orange"
                : "red"
            }
          >
            {product.stock} unidades
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Ubicación">
          {product.ubicacion}
        </Descriptions.Item>

        <Descriptions.Item label="Peso">
          {product.peso} {product.unidad_peso}
        </Descriptions.Item>

        <Descriptions.Item label="Fecha de Registro">
          {product.fecha_registro}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Dimensiones</Divider>
      <Descriptions bordered column={{ xs: 2, sm: 4 }}>
        <Descriptions.Item label="Largo">
          {product.dimensiones.largo} {product.dimensiones.unidad}
        </Descriptions.Item>
        <Descriptions.Item label="Ancho">
          {product.dimensiones.ancho} {product.dimensiones.unidad}
        </Descriptions.Item>
        <Descriptions.Item label="Alto">
          {product.dimensiones.alto} {product.dimensiones.unidad}
        </Descriptions.Item>
        <Descriptions.Item label="Volumen">
          {(
            product.dimensiones.largo *
            product.dimensiones.ancho *
            product.dimensiones.alto
          ).toFixed(2)}{" "}
          {product.dimensiones.unidad}³
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
