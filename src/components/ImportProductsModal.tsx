"use client";

import { useState } from "react";
import {
  Modal,
  Upload,
  Button,
  Alert,
  Table,
  Tag,
  Progress,
  Divider,
  Space,
} from "antd";
import {
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { read, utils } from "xlsx";
import type { UploadFile } from "antd/es/upload/interface";
import { Product, productService } from "@/services/productService";
import { Category } from "@/services/categoryService";

interface ImportProductsModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onImportComplete: () => void;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  products: Omit<Product, "id">[];
}

interface ImportResult {
  producto: string;
  status: "success" | "error";
  message: string;
}

const REQUIRED_FIELDS = [
  "producto",
  "categoria",
  "descripcion",
  "sku",
  "stock",
  "ubicacion",
  "peso",
  "unidad_peso",
  "tamaño",
];

export const ImportProductsModal = ({
  open,
  onClose,
  categories,
  onImportComplete,
}: ImportProductsModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [importProgress, setImportProgress] = useState(0);

  const downloadTemplate = () => {
    // Crear datos de ejemplo para la plantilla
    const templateData = [
      {
        producto: "Bandeja Plástica Grande",
        categoria: categories[0]?.nombre || "Plásticos",
        descripcion: "Bandeja plástica reciclada de gran tamaño",
        sku: "BAND-001",
        stock: 50,
        ubicacion: "P1-E1-N1",
        peso: 0.5,
        unidad_peso: "kg",
        tamaño: "grande",
        "dimensiones.largo": 40,
        "dimensiones.ancho": 30,
        "dimensiones.alto": 10,
        "dimensiones.unidad": "cm",
      },
      {
        producto: "Contenedor Mediano",
        categoria: categories[0]?.nombre || "Plásticos",
        descripcion: "Contenedor plástico para almacenamiento",
        sku: "CONT-002",
        stock: 30,
        ubicacion: "P1-E2-N1",
        peso: 0.8,
        unidad_peso: "kg",
        tamaño: "mediano",
        "dimensiones.largo": 35,
        "dimensiones.ancho": 25,
        "dimensiones.alto": 15,
        "dimensiones.unidad": "cm",
      },
      {
        producto: "Botella Reciclada 1L",
        categoria: categories[1]?.nombre || "Botellas",
        descripcion: "Botella plástica reciclada de 1 litro",
        sku: "BOT-003",
        stock: 100,
        ubicacion: "P2-E1-N2",
        peso: 0.2,
        unidad_peso: "kg",
        tamaño: "pequeño",
        "dimensiones.largo": 25,
        "dimensiones.ancho": 8,
        "dimensiones.alto": 8,
        "dimensiones.unidad": "cm",
      },
    ];

    // Convertir a formato Excel
    const ws = utils.json_to_sheet(templateData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Productos");

    // Descargar
    import("xlsx").then((XLSX) => {
      XLSX.writeFile(wb, "plantilla_productos.xlsx");
    });
  };

  const handleFileChange = async (info: any) => {
    const { file, fileList: newFileList } = info;

    // Actualizar la lista de archivos
    setFileList(newFileList.slice(-1)); // Solo mantener el último archivo
    setValidationResult(null);
    setImportResults([]);
    setImportProgress(0);

    // Obtener el archivo real (puede estar en originFileObj o directamente en file)
    const realFile = file.originFileObj || file;

    // Solo procesar si tenemos un archivo
    if (realFile) {
      try {
        // Leer el archivo usando FileReader para mayor compatibilidad
        const fileReader = new FileReader();

        fileReader.onload = async (e) => {
          try {
            const data = e.target?.result;

            if (!data) {
              throw new Error("No se pudo leer el contenido del archivo");
            }

            // Leer el workbook
            const workbook = read(data, { type: "array" });

            // Verificar que el workbook tenga hojas
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
              throw new Error("El archivo no contiene hojas de cálculo");
            }

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet);

            const result = validateData(jsonData);
            setValidationResult(result);
          } catch (error: any) {
            console.error("Error al procesar archivo:", error);
            setValidationResult({
              valid: false,
              errors: [
                "Error al leer el archivo. Asegúrate de que sea un archivo CSV o Excel válido.",
                error.message ? `Detalle: ${error.message}` : "",
              ].filter(Boolean),
              warnings: [],
              products: [],
            });
          }
        };

        fileReader.onerror = () => {
          setValidationResult({
            valid: false,
            errors: ["Error al leer el archivo. Por favor intenta nuevamente."],
            warnings: [],
            products: [],
          });
        };

        // Leer el archivo como ArrayBuffer
        fileReader.readAsArrayBuffer(realFile);
      } catch (error: any) {
        console.error("Error al procesar archivo:", error);
        setValidationResult({
          valid: false,
          errors: [
            "Error al procesar el archivo.",
            error.message ? `Detalle: ${error.message}` : "",
          ].filter(Boolean),
          warnings: [],
          products: [],
        });
      }
    }
  };

  const validateData = (data: any[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const products: Omit<Product, "id">[] = [];

    // Regla 1: Debe haber al menos 1 producto
    if (data.length === 0) {
      errors.push(
        "❌ El archivo está vacío. Debe contener al menos 1 producto."
      );
      return { valid: false, errors, warnings, products };
    }

    if (data.length === 1) {
      errors.push("❌ El archivo debe contener más de 1 producto.");
      return { valid: false, errors, warnings, products };
    }

    // Verificar que tenga los campos requeridos en la primera fila
    const firstRow = data[0];
    const fileFields = Object.keys(firstRow);
    const missingFields = REQUIRED_FIELDS.filter(
      (field) => !fileFields.includes(field)
    );

    if (missingFields.length > 0) {
      errors.push(
        `❌ Faltan los siguientes campos requeridos: ${missingFields.join(
          ", "
        )}`
      );
      return { valid: false, errors, warnings, products };
    }

    // Validar SKUs duplicados dentro del archivo
    const skusInFile = data.map((row) => row.sku).filter(Boolean);
    const duplicateSkusInFile = skusInFile.filter(
      (sku, index) => skusInFile.indexOf(sku) !== index
    );

    if (duplicateSkusInFile.length > 0) {
      const uniqueDuplicates = [...new Set(duplicateSkusInFile)];
      errors.push(
        `❌ SKUs duplicados dentro del archivo: ${uniqueDuplicates.join(", ")}`
      );
      return { valid: false, errors, warnings, products };
    }

    // Validar cada producto
    const categoryNames = categories.map((cat) => cat.nombre);
    const validProducts: Omit<Product, "id">[] = [];
    const invalidProducts: string[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 porque índice 0 + fila de encabezado
      const productName = row.producto || `Producto en fila ${rowNumber}`;

      // Validar campos requeridos
      const rowErrors: string[] = [];

      REQUIRED_FIELDS.forEach((field) => {
        if (!row[field] && row[field] !== 0) {
          rowErrors.push(`Campo "${field}" vacío`);
        }
      });

      // Regla 3: Validar que la categoría exista
      if (row.categoria && !categoryNames.includes(row.categoria)) {
        rowErrors.push(
          `Categoría "${
            row.categoria
          }" no existe. Categorías disponibles: ${categoryNames.join(", ")}`
        );
      }

      // Validar dimensiones (pueden venir como dimensiones.largo o como objeto anidado)
      const dimLargo =
        row["dimensiones.largo"] || row.dimensiones?.largo || null;
      const dimAncho =
        row["dimensiones.ancho"] || row.dimensiones?.ancho || null;
      const dimAlto = row["dimensiones.alto"] || row.dimensiones?.alto || null;
      const dimUnidad =
        row["dimensiones.unidad"] || row.dimensiones?.unidad || null;

      if (!dimLargo || !dimAncho || !dimAlto || !dimUnidad) {
        rowErrors.push(
          "Dimensiones incompletas. Debe incluir: dimensiones.largo, dimensiones.ancho, dimensiones.alto, dimensiones.unidad"
        );
      }

      if (rowErrors.length > 0) {
        invalidProducts.push(
          `Fila ${rowNumber} (${productName}): ${rowErrors.join(", ")}`
        );
      } else {
        // Producto válido
        validProducts.push({
          producto: row.producto,
          categoria: row.categoria,
          descripcion: row.descripcion,
          sku: row.sku,
          stock: Number(row.stock) || 0,
          ubicacion: row.ubicacion,
          peso: Number(row.peso) || 0,
          unidad_peso: row.unidad_peso,
          tamaño: row.tamaño,
          dimensiones: {
            largo: Number(dimLargo) || 0,
            ancho: Number(dimAncho) || 0,
            alto: Number(dimAlto) || 0,
            unidad: dimUnidad || "cm",
          },
          fecha_registro: new Date().toLocaleDateString("es-ES"),
        });
      }
    });

    if (invalidProducts.length > 0) {
      invalidProducts.forEach((error) => errors.push(`❌ ${error}`));
    }

    if (validProducts.length === 0 && invalidProducts.length > 0) {
      return { valid: false, errors, warnings, products: [] };
    }

    if (validProducts.length > 0 && invalidProducts.length > 0) {
      warnings.push(
        `⚠️ Se encontraron ${invalidProducts.length} productos inválidos que serán omitidos.`
      );
    }

    return {
      valid: validProducts.length > 0,
      errors,
      warnings,
      products: validProducts,
    };
  };

  const handleImport = async () => {
    if (!validationResult || !validationResult.valid) return;

    setImporting(true);
    setImportProgress(0);
    const results: ImportResult[] = [];
    const total = validationResult.products.length;

    for (let i = 0; i < validationResult.products.length; i++) {
      const product = validationResult.products[i];
      try {
        // Verificar si el SKU ya existe en la base de datos
        const skuCheck = await productService.checkSkuExists(product.sku);

        if (skuCheck.exists) {
          results.push({
            producto: product.producto,
            status: "error",
            message: `SKU "${product.sku}" ya existe en: ${skuCheck.product?.producto}`,
          });
        } else {
          await productService.create(product);
          results.push({
            producto: product.producto,
            status: "success",
            message: "Importado correctamente",
          });
        }
      } catch (error: any) {
        results.push({
          producto: product.producto,
          status: "error",
          message: error.message || "Error al importar",
        });
      }
      setImportProgress(Math.round(((i + 1) / total) * 100));
    }

    setImportResults(results);
    setImporting(false);

    // Recargar productos en la página principal
    onImportComplete();

    // Si todos fueron exitosos, cerrar el modal después de 2 segundos
    const successCount = results.filter((r) => r.status === "success").length;
    if (successCount === results.length) {
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    setFileList([]);
    setValidationResult(null);
    setImportResults([]);
    setImportProgress(0);
    onClose();
  };

  const uploadProps = {
    accept:
      ".csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv",
    beforeUpload: () => false,
    onChange: handleFileChange,
    fileList,
    maxCount: 1,
  };

  const resultColumns = [
    {
      title: "Producto",
      dataIndex: "producto",
      key: "producto",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "success" ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Exitoso
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Error
          </Tag>
        ),
    },
    {
      title: "Mensaje",
      dataIndex: "message",
      key: "message",
    },
  ];

  return (
    <Modal
      title={
        <span className="text-sm md:text-base">
          Importar Productos Masivamente
        </span>
      }
      open={open}
      onCancel={handleClose}
      width="95%"
      style={{ maxWidth: 800 }}
      footer={
        importResults.length > 0
          ? [
              <Button key="close" type="primary" onClick={handleClose}>
                Cerrar
              </Button>,
            ]
          : [
              <Button key="cancel" onClick={handleClose}>
                Cancelar
              </Button>,
              <Button
                key="import"
                type="primary"
                disabled={!validationResult?.valid || importing}
                loading={importing}
                onClick={handleImport}
              >
                {importing ? "Importando..." : "Importar Productos"}
              </Button>,
            ]
      }
    >
      <div className="space-y-4">
        {/* Botón para descargar plantilla */}
        <div className="flex justify-center">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            onClick={downloadTemplate}
            className="w-full text-xs md:text-sm"
          >
            <span className="hidden sm:inline">
              Descargar Plantilla de Ejemplo (Excel)
            </span>
            <span className="sm:hidden">Descargar Plantilla</span>
          </Button>
        </div>

        {/* Instrucciones detalladas */}
        <Alert
          message={
            <span className="text-xs md:text-sm">
              📖 Cómo Crear el Archivo de Importación
            </span>
          }
          description={
            <div className="space-y-3">
              <div>
                <p className="font-semibold mb-2 text-xs md:text-sm">
                  Opción 1: Usar la plantilla (Recomendado) ⭐
                </p>
                <ol className="list-decimal ml-5 space-y-1 text-xs md:text-sm">
                  <li>
                    Haz clic en &ldquo;Descargar Plantilla de Ejemplo&rdquo;
                    arriba
                  </li>
                  <li>
                    Abre el archivo con Excel, Google Sheets o LibreOffice
                  </li>
                  <li>Reemplaza los productos de ejemplo con tus datos</li>
                  <li>
                    Asegúrate de mantener la primera fila con los nombres de las
                    columnas
                  </li>
                  <li>Guarda el archivo y súbelo usando el botón de abajo</li>
                </ol>
              </div>

              <Divider className="my-2" />

              <div>
                <p className="font-semibold mb-2 text-xs md:text-sm">
                  Opción 2: Crear desde cero 📝
                </p>
                <ol className="list-decimal ml-5 space-y-1 text-xs md:text-sm">
                  <li>Abre Excel, Google Sheets o cualquier editor de CSV</li>
                  <li>
                    En la <strong>primera fila</strong>, escribe estos nombres
                    de columnas exactamente:
                    <div className="mt-1 p-2 bg-gray-100 rounded text-xs font-mono">
                      producto | categoria | descripcion | sku | stock |
                      ubicacion | peso | unidad_peso | tamaño |
                      dimensiones.largo | dimensiones.ancho | dimensiones.alto |
                      dimensiones.unidad
                    </div>
                  </li>
                  <li>
                    A partir de la <strong>segunda fila</strong>, agrega tus
                    productos (mínimo 2 productos)
                  </li>
                  <li>
                    Asegúrate de que cada producto tenga todos los campos
                    completos
                  </li>
                  <li>
                    Guarda como <strong>.XLSX</strong> o <strong>.CSV</strong>
                  </li>
                </ol>
              </div>

              <Divider className="my-2" />

              <div>
                <p className="font-semibold mb-2 flex items-center gap-2 text-xs md:text-sm">
                  <InfoCircleOutlined className="text-blue-500" />
                  Valores Permitidos:
                </p>
                <ul className="list-disc ml-5 space-y-1 text-[10px] md:text-xs">
                  <li>
                    <strong>sku:</strong> Debe ser ÚNICO. No puede repetirse ni
                    dentro del archivo ni con productos existentes
                  </li>
                  <li>
                    <strong>categoria:</strong> Debe ser una de las categorías
                    existentes (ver abajo)
                  </li>
                  <li>
                    <strong>stock:</strong> Número entero (ej: 50, 100, 0)
                  </li>
                  <li>
                    <strong>ubicacion:</strong> Formato P#-E#-N# (ej: P1-E1-N1,
                    P2-E3-N2)
                  </li>
                  <li>
                    <strong>unidad_peso:</strong> kg, g, o lb
                  </li>
                  <li>
                    <strong>tamaño:</strong> pequeño, mediano, o grande
                  </li>
                  <li>
                    <strong>dimensiones.unidad:</strong> cm, m, o in
                  </li>
                </ul>
              </div>
            </div>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
        />

        {/* Categorías disponibles */}
        <Alert
          message={
            <span className="text-xs md:text-sm">Categorías Disponibles</span>
          }
          description={
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Tag key={cat.id} color="blue">
                  {cat.nombre}
                </Tag>
              ))}
            </div>
          }
          type="success"
          showIcon
        />

        {/* Upload */}
        <div className="mt-4">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} size="large" block>
              Seleccionar Archivo (CSV o Excel)
            </Button>
          </Upload>
        </div>

        {/* Resultados de Validación */}
        {validationResult && (
          <div className="mt-4">
            <Divider>Resultados de Validación</Divider>

            {validationResult.errors.length > 0 && (
              <Alert
                message={
                  <span className="text-xs md:text-sm">
                    Errores Encontrados
                  </span>
                }
                description={
                  <ul className="list-disc ml-5 text-xs">
                    {validationResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                }
                type="error"
                showIcon
                icon={<CloseCircleOutlined />}
                className="mb-3"
              />
            )}

            {validationResult.warnings.length > 0 && (
              <Alert
                message={
                  <span className="text-xs md:text-sm">Advertencias</span>
                }
                description={
                  <ul className="list-disc ml-5 text-xs">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                }
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                className="mb-3"
              />
            )}

            {validationResult.valid && (
              <Alert
                message={
                  <span className="text-xs md:text-sm">Validación Exitosa</span>
                }
                description={
                  <span className="text-xs">{`✅ Se encontraron ${validationResult.products.length} productos válidos listos para importar.`}</span>
                }
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
              />
            )}
          </div>
        )}

        {/* Progreso de Importación */}
        {importing && (
          <div className="mt-4">
            <Divider>Importando Productos</Divider>
            <Progress percent={importProgress} status="active" />
          </div>
        )}

        {/* Resultados de Importación */}
        {importResults.length > 0 && (
          <div className="mt-4">
            <Divider>Resultados de Importación</Divider>
            <Space direction="vertical" className="w-full mb-3">
              <Alert
                message={`${
                  importResults.filter((r) => r.status === "success").length
                } productos importados exitosamente`}
                type="success"
                showIcon
              />
              {importResults.filter((r) => r.status === "error").length > 0 && (
                <Alert
                  message={`${
                    importResults.filter((r) => r.status === "error").length
                  } productos fallaron`}
                  type="error"
                  showIcon
                />
              )}
            </Space>
            <Table
              dataSource={importResults}
              columns={resultColumns}
              pagination={false}
              size="small"
              rowKey={(record) => record.producto}
              scroll={{ x: 400 }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
