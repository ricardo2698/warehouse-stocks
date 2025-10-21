"use client";

import {
  Modal,
  Form,
  InputNumber,
  Space,
  Typography,
  Tag,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { Product } from "@/services/productService";

const { Text } = Typography;

interface StockModalProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (id: string, newStock: number) => Promise<void>;
}

export const StockModal = ({
  open,
  product,
  onClose,
  onSubmit,
}: StockModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product) {
      form.setFieldsValue({ stock: product.stock });
    }
  }, [open, product, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      if (product?.id) {
        await onSubmit(product.id, values.stock);
        message.success("Stock actualizado correctamente");
        onClose();
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.error("Por favor ingresa un stock válido");
      } else {
        message.error("Error al actualizar el stock");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Modificar Stock"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Actualizar"
      cancelText="Cancelar"
      width="95%"
      style={{ maxWidth: 400 }}
    >
      {product && (
        <div className="mb-4">
          <Space direction="vertical" className="w-full">
            <div>
              <Text strong>Producto:</Text> {product.producto}
            </div>
            <div>
              <Text strong>SKU:</Text> {product.sku}
            </div>
            <div>
              <Text strong>Stock actual:</Text>{" "}
              <Tag
                color={
                  product.stock > 20
                    ? "green"
                    : product.stock > 0
                    ? "orange"
                    : "red"
                }
              >
                {product.stock}
              </Tag>
            </div>
          </Space>
        </div>
      )}

      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="stock"
          label="Nuevo Stock"
          rules={[
            { required: true, message: "Ingresa el nuevo stock" },
            {
              type: "number",
              min: 0,
              message: "El stock debe ser mayor o igual a 0",
            },
          ]}
        >
          <InputNumber
            min={0}
            className="w-full"
            placeholder="Ingresa el nuevo stock"
            size="large"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
