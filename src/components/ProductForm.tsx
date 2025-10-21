"use client";

import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { Product } from "@/services/productService";
import { Category } from "@/services/categoryService";

interface ProductFormProps {
  open: boolean;
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSubmit: (product: Omit<Product, "id">) => Promise<void>;
}

export const ProductForm = ({
  open,
  product,
  categories,
  onClose,
  onSubmit,
}: ProductFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && product) {
      form.setFieldsValue(product);
    } else if (open) {
      form.resetFields();
    }
  }, [open, product, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Validar SKU único
      const { productService } = await import("@/services/productService");
      const skuCheck = await productService.checkSkuExists(
        values.sku,
        product?.id
      );

      if (skuCheck.exists) {
        message.error(
          `El SKU "${values.sku}" ya está registrado en el producto: ${skuCheck.product?.producto}`
        );
        setLoading(false);
        return;
      }

      // Agregar fecha de registro automáticamente
      const productData = {
        ...values,
        fecha_registro: new Date().toLocaleDateString("es-ES"),
      };

      await onSubmit(productData);
      message.success(
        product
          ? "Producto actualizado correctamente"
          : "Producto creado correctamente"
      );
      form.resetFields();
      onClose();
    } catch (error: any) {
      if (error.errorFields) {
        message.error("Por favor completa todos los campos requeridos");
      } else {
        message.error("Error al guardar el producto");
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
      title={product ? "Editar Producto" : "Agregar Producto"}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width="95%"
      style={{ maxWidth: 800 }}
      okText={product ? "Actualizar" : "Crear"}
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="producto"
              label="Nombre del Producto"
              rules={[
                { required: true, message: "Ingresa el nombre del producto" },
              ]}
            >
              <Input placeholder="Ej: Bandeja plástica reciclada" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="categoria"
              label="Categoría"
              rules={[{ required: true, message: "Selecciona una categoría" }]}
            >
              <Select placeholder="Selecciona una categoría">
                {categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[{ required: true, message: "Ingresa una descripción" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Descripción detallada del producto"
          />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="sku"
              label="SKU"
              rules={[{ required: true, message: "Ingresa el SKU" }]}
            >
              <Input placeholder="Ej: ECO-HOG-001" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true, message: "Ingresa el stock" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="ubicacion"
              label="Ubicación"
              rules={[{ required: true, message: "Ingresa la ubicación" }]}
            >
              <Input placeholder="Ej: P1-E1-N1" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="peso"
              label="Peso"
              rules={[{ required: true, message: "Ingresa el peso" }]}
            >
              <InputNumber
                min={0}
                step={0.01}
                className="w-full"
                placeholder="0.0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="unidad_peso"
              label="Unidad de Peso"
              rules={[{ required: true, message: "Selecciona la unidad" }]}
            >
              <Select placeholder="Selecciona">
                <Select.Option value="kg">kg</Select.Option>
                <Select.Option value="g">g</Select.Option>
                <Select.Option value="lb">lb</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="tamaño"
              label="Tamaño"
              rules={[{ required: true, message: "Selecciona el tamaño" }]}
            >
              <Select placeholder="Selecciona">
                <Select.Option value="pequeño">Pequeño</Select.Option>
                <Select.Option value="mediano">Mediano</Select.Option>
                <Select.Option value="grande">Grande</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <div className="mb-2 font-semibold">Dimensiones</div>
        <Row gutter={[16, 0]}>
          <Col xs={12} sm={6}>
            <Form.Item
              name={["dimensiones", "largo"]}
              label="Largo"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              name={["dimensiones", "ancho"]}
              label="Ancho"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              name={["dimensiones", "alto"]}
              label="Alto"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <InputNumber min={0} className="w-full" placeholder="0" />
            </Form.Item>
          </Col>
          <Col xs={12} sm={6}>
            <Form.Item
              name={["dimensiones", "unidad"]}
              label="Unidad"
              rules={[{ required: true, message: "Requerido" }]}
            >
              <Select placeholder="Unidad">
                <Select.Option value="cm">cm</Select.Option>
                <Select.Option value="m">m</Select.Option>
                <Select.Option value="in">in</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
