"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  message,
  Popconfirm,
  Form,
  Tag,
  Result,
} from "antd";
import { PlusOutlined, DeleteOutlined, LockOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { Category, categoryService } from "@/services/categoryService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CategoriasPage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);

  // Verificar si es admin
  const isAdmin = userProfile?.role === "admin";

  // Cargar categorías
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      message.error("Error al cargar las categorías");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Agregar categoría
  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      message.warning("Ingresa el nombre de la categoría");
      return;
    }

    setAdding(true);
    try {
      await categoryService.create(newCategory.trim());
      message.success("Categoría agregada correctamente");
      setNewCategory("");
      await loadCategories();
    } catch (error) {
      message.error("Error al agregar la categoría");
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  // Eliminar categoría
  const handleDeleteCategory = async (id: string) => {
    try {
      await categoryService.delete(id);
      message.success("Categoría eliminada correctamente");
      await loadCategories();
    } catch (error) {
      message.error("Error al eliminar la categoría");
      console.error(error);
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: "Categoría",
      dataIndex: "nombre",
      key: "nombre",
      render: (nombre: string) => <Tag color="blue">{nombre}</Tag>,
    },
    {
      title: "Acciones",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Eliminar categoría"
          description="¿Estás seguro de eliminar esta categoría?"
          onConfirm={() => record.id && handleDeleteCategory(record.id)}
          okText="Sí, eliminar"
          cancelText="Cancelar"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            Eliminar
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Si no es admin, mostrar mensaje de acceso denegado
  if (!isAdmin) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Result
            status="403"
            icon={<LockOutlined style={{ color: "#ff4d4f" }} />}
            title="Acceso Denegado"
            subTitle="Lo sentimos, solo los administradores pueden acceder a la gestión de categorías."
            extra={
              <Button type="primary" onClick={() => router.push("/dashboard")}>
                Volver al Dashboard
              </Button>
            }
          />
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Categorías
            </h1>
            <Card className="mb-4">
              <Form layout="vertical" className="md:flex md:flex-row md:gap-4">
                <Form.Item
                  label="Nueva Categoría"
                  className="flex-1 mb-3 md:mb-0"
                >
                  <Input
                    placeholder="Ej: Electrónica, Hogar, etc."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onPressEnter={handleAddCategory}
                    size="large"
                  />
                </Form.Item>
                <Form.Item className="mb-0 md:self-end">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddCategory}
                    loading={adding}
                    size="large"
                    className="w-full md:w-auto"
                  >
                    Agregar
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </div>

          <Card>
            <Table
              columns={columns}
              dataSource={categories}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total ${total} categorías`,
              }}
            />
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
