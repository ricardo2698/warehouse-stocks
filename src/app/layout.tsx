import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EcoPlast S.A. - Warehouse Stocks",
  description:
    "Sistema de gestión de inventario - Innovación que cuida el planeta",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="m-0 p-0">
      <body className={`${inter.className} m-0 p-0`}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                // Color primario: Verde brillante de EcoPlast
                colorPrimary: "#52b947",
                // Color de enlaces
                colorLink: "#52b947",
                colorLinkHover: "#6bc75d",
                colorLinkActive: "#429139",
                // Colores de éxito (verde)
                colorSuccess: "#52b947",
                colorSuccessBg: "#f0f9ef",
                colorSuccessBorder: "#b7e5b4",
                // Colores de info (verde más claro)
                colorInfo: "#8bc34a",
                colorInfoBg: "#f4f9ed",
                colorInfoBorder: "#c5e1a5",
                // Radio de bordes
                borderRadius: 6,
              },
              components: {
                Button: {
                  colorPrimary: "#52b947",
                  colorPrimaryHover: "#6bc75d",
                  colorPrimaryActive: "#429139",
                  primaryShadow: "0 2px 0 rgba(82, 185, 71, 0.1)",
                },
                Menu: {
                  itemSelectedColor: "#52b947",
                  itemSelectedBg: "rgba(82, 185, 71, 0.1)",
                  itemHoverColor: "#6bc75d",
                  itemHoverBg: "rgba(82, 185, 71, 0.05)",
                },
                Input: {
                  activeBorderColor: "#52b947",
                  hoverBorderColor: "#6bc75d",
                },
                Select: {
                  optionSelectedBg: "rgba(82, 185, 71, 0.1)",
                },
                Tag: {
                  defaultBg: "#f0f9ef",
                  defaultColor: "#1a5d1a",
                },
              },
            }}
          >
            <AuthProvider>{children}</AuthProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
