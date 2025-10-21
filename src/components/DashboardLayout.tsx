"use client";

import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Space,
  Avatar,
  Popconfirm,
  Tag,
  Drawer,
} from "antd";
import {
  DashboardOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  TagsOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { UserProfileModal } from "./UserProfileModal";
import Image from "next/image";

const { Header, Sider, Content } = Layout;

export const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Detectar tamaño de pantalla
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Si cambia a desktop, cerrar el drawer
      if (!mobile) {
        setMobileDrawerOpen(false);
      }
    };

    // Ejecutar inmediatamente al montar
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getSelectedKey = () => {
    if (pathname === "/dashboard") return "1";
    if (pathname === "/productos") return "2";
    if (pathname === "/categorias") return "3";
    if (pathname === "/bodega") return "4";
    return "1";
  };

  const handleMenuItemClick = ({ key }: { key: string }) => {
    // Cerrar drawer en móviles después de navegar
    if (isMobile) {
      setMobileDrawerOpen(false);
    }

    switch (key) {
      case "1":
        router.push("/dashboard");
        break;
      case "2":
        router.push("/productos");
        break;
      case "3":
        router.push("/categorias");
        break;
      case "4":
        router.push("/bodega");
        break;
    }
  };

  // Filtrar menú según el rol del usuario
  const menuItems = [
    {
      key: "1",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,
      label: "Productos",
    },
    {
      key: "4",
      icon: <InboxOutlined />,
      label: "Bodega",
    },
    // Solo mostrar Categorías a admin
    ...(userProfile?.role === "admin"
      ? [
          {
            key: "3",
            icon: <TagsOutlined />,
            label: "Categorías",
          },
        ]
      : []),
  ];

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      setShowLogoutConfirm(true);
    } else if (key === "profile") {
      setProfileModalOpen(true);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Mi Perfil",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      danger: true,
    },
  ];

  // Componente del menú reutilizable
  const MenuContent = () => (
    <>
      <div className="m-4 text-center">
        {!isMobile && collapsed ? (
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="WS"
              width={45}
              height={45}
              className="object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/logo.png"
              alt="EcoPlast S.A."
              width={80}
              height={80}
              className="object-contain"
            />
            <span className="text-white font-bold text-sm">EcoPlast S.A.</span>
          </div>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        onClick={handleMenuItemClick}
      />
    </>
  );

  // Evitar problemas de hidratación mostrando un loading inicial
  if (!mounted) {
    return null;
  }

  return (
    <Layout className="h-screen">
      {/* Sidebar para Desktop - Oculto en móvil */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          className="h-screen"
          breakpoint="md"
        >
          <MenuContent />
        </Sider>
      )}

      {/* Drawer para Móvil */}
      <Drawer
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        closable={false}
        width={250}
        styles={{ body: { padding: 0, background: "#001529" } }}
      >
        <MenuContent />
      </Drawer>

      <Layout className="h-screen">
        <Header className="bg-white px-2 md:px-4 flex items-center justify-between shadow">
          <Button
            type="text"
            icon={
              isMobile ? (
                <MenuUnfoldOutlined />
              ) : collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
            onClick={() => {
              if (isMobile) {
                setMobileDrawerOpen(true);
              } else {
                setCollapsed(!collapsed);
              }
            }}
            className="text-lg"
          />
          <Space size="small" className="md:space-x-2">
            {/* Mostrar rol del usuario - ocultar texto en móviles pequeños */}
            {userProfile?.role && (
              <Tag
                color={userProfile.role === "admin" ? "red" : "blue"}
                className="font-semibold text-xs md:text-sm"
              >
                {userProfile.role === "admin" ? "ADMIN" : "ASISTENTE"}
              </Tag>
            )}
            <Popconfirm
              title="Cerrar Sesión"
              description="¿Estás seguro que deseas cerrar sesión?"
              open={showLogoutConfirm}
              onConfirm={handleLogout}
              onCancel={() => setShowLogoutConfirm(false)}
              okText="Sí, cerrar sesión"
              cancelText="Cancelar"
            >
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleMenuClick }}
                placement="bottomRight"
              >
                <Button
                  type="text"
                  className="flex items-center gap-1 md:gap-2"
                >
                  <Avatar icon={<UserOutlined />} size="small" />
                  <span className="hidden md:inline text-gray-800 text-sm text-white">
                    {userProfile?.name || user?.email} {userProfile?.lastName}
                  </span>
                </Button>
              </Dropdown>
            </Popconfirm>
          </Space>
        </Header>
        <Content className="m-2 md:m-6 p-3 md:p-6 bg-white rounded-lg shadow overflow-auto">
          {children}
        </Content>
      </Layout>

      {/* Modal de Perfil de Usuario */}
      <UserProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        userProfile={userProfile}
      />
    </Layout>
  );
};
