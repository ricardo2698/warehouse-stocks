"use client";

import { Modal, Descriptions, Tag, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { UserProfile } from "@/services/userService";

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
}

export const UserProfileModal = ({
  open,
  onClose,
  userProfile,
}: UserProfileModalProps) => {
  if (!userProfile) return null;

  const getRoleColor = (role: string) => {
    return role === "admin" ? "red" : "blue";
  };

  const getRoleLabel = (role: string) => {
    return role === "admin" ? "ADMINISTRADOR" : "ASISTENTE";
  };

  const formatDate = (date: any) => {
    if (!date) return "N/A";

    // Si es un timestamp de Firebase
    if (date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Si es una fecha normal
    if (date instanceof Date) {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    return "N/A";
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <Avatar size={48} icon={<UserOutlined />} className="bg-blue-500" />
          <div>
            <div className="text-base md:text-lg font-semibold">Mi Perfil</div>
            <div className="text-xs md:text-sm text-gray-500 font-normal">
              Información de tu cuenta
            </div>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width="95%"
      style={{ maxWidth: 600 }}
    >
      <div className="mt-6">
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item
            label={<span className="font-semibold">Nombre Completo</span>}
          >
            <span className="text-base">
              {userProfile.name} {userProfile.lastName}
            </span>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className="font-semibold">Correo Electrónico</span>}
          >
            <span className="text-base">{userProfile.email}</span>
          </Descriptions.Item>

          <Descriptions.Item label={<span className="font-semibold">Rol</span>}>
            <Tag color={getRoleColor(userProfile.role)} className="text-sm">
              {getRoleLabel(userProfile.role)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className="font-semibold">ID de Usuario</span>}
          >
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {userProfile.uid}
            </code>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className="font-semibold">Fecha de Registro</span>}
          >
            <span className="text-sm text-gray-600">
              {formatDate(userProfile.createdAt)}
            </span>
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">
            Permisos de tu Rol
          </h3>
          {userProfile.role === "admin" ? (
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Ver, crear, editar y eliminar productos</li>
              <li>✅ Gestionar inventario y stock</li>
              <li>✅ Administrar categorías</li>
              <li>✅ Acceso completo al sistema</li>
            </ul>
          ) : (
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Ver productos e inventario</li>
              <li>✅ Actualizar stock de productos</li>
              <li>❌ No puede crear o eliminar productos</li>
              <li>❌ No tiene acceso a categorías</li>
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
};
