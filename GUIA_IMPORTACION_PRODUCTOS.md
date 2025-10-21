# 📦 Guía de Importación Masiva de Productos

Esta guía te ayudará a crear correctamente el archivo para importar productos de forma masiva al sistema Warehouse Stocks.

---

## 🎯 Requisitos del Archivo

### ✅ Reglas Obligatorias

1. **Formato:** El archivo debe ser `.CSV`, `.XLS` o `.XLSX`
2. **Encabezados:** La primera fila DEBE contener los nombres exactos de las columnas
3. **Cantidad mínima:** Debe haber **más de 1 producto** (mínimo 2)
4. **SKU único:** Cada SKU debe ser único (no puede repetirse ni dentro del archivo ni con productos existentes)
5. **Categorías:** Las categorías deben existir previamente en el sistema
6. **Todos los campos:** Cada producto debe tener todos los campos completos

---

## 📋 Estructura del Archivo

### Columnas Requeridas (en la primera fila):

```
producto | categoria | descripcion | sku | stock | ubicacion | peso | unidad_peso | tamaño | dimensiones.largo | dimensiones.ancho | dimensiones.alto | dimensiones.unidad
```

### Descripción de cada campo:

| Campo                | Tipo   | Ejemplo                       | Descripción                        |
| -------------------- | ------ | ----------------------------- | ---------------------------------- |
| `producto`           | Texto  | Bandeja Plástica Grande       | Nombre del producto                |
| `categoria`          | Texto  | Plásticos                     | Debe existir en el sistema         |
| `descripcion`        | Texto  | Bandeja plástica reciclada... | Descripción detallada              |
| `sku`                | Texto  | BAND-001                      | Código único del producto          |
| `stock`              | Número | 50                            | Cantidad en inventario             |
| `ubicacion`          | Texto  | P1-E1-N1                      | Formato: Pasillo-Estantería-Nivel  |
| `peso`               | Número | 0.5                           | Peso del producto                  |
| `unidad_peso`        | Texto  | kg                            | Opciones: kg, g, lb                |
| `tamaño`             | Texto  | grande                        | Opciones: pequeño, mediano, grande |
| `dimensiones.largo`  | Número | 40                            | Longitud del producto              |
| `dimensiones.ancho`  | Número | 30                            | Ancho del producto                 |
| `dimensiones.alto`   | Número | 10                            | Altura del producto                |
| `dimensiones.unidad` | Texto  | cm                            | Opciones: cm, m, in                |

---

## 📝 Ejemplo Visual (Excel/Google Sheets)

### Así debe verse tu archivo:

| producto                | categoria | descripcion                               | sku      | stock | ubicacion | peso | unidad_peso | tamaño  | dimensiones.largo | dimensiones.ancho | dimensiones.alto | dimensiones.unidad |
| ----------------------- | --------- | ----------------------------------------- | -------- | ----- | --------- | ---- | ----------- | ------- | ----------------- | ----------------- | ---------------- | ------------------ |
| Bandeja Plástica Grande | Plásticos | Bandeja plástica reciclada de gran tamaño | BAND-001 | 50    | P1-E1-N1  | 0.5  | kg          | grande  | 40                | 30                | 10               | cm                 |
| Contenedor Mediano      | Plásticos | Contenedor plástico para almacenamiento   | CONT-002 | 30    | P1-E2-N1  | 0.8  | kg          | mediano | 35                | 25                | 15               | cm                 |
| Botella Reciclada 1L    | Botellas  | Botella plástica reciclada de 1 litro     | BOT-003  | 100   | P2-E1-N2  | 0.2  | kg          | pequeño | 25                | 8                 | 8                | cm                 |

---

## 💡 Cómo Crear el Archivo

### Opción 1: Usar la Plantilla (Recomendado) ⭐

1. En el sistema, ve a **Productos** → Click en **"Importar Masivo"**
2. Click en **"Descargar Plantilla de Ejemplo (Excel)"**
3. Abre el archivo descargado con:
   - Microsoft Excel
   - Google Sheets (Archivo → Abrir)
   - LibreOffice Calc
4. **Reemplaza** los productos de ejemplo con tus datos
5. **Mantén la primera fila** con los nombres de las columnas
6. Guarda el archivo
7. Sube el archivo en el sistema

### Opción 2: Crear desde Cero

#### En Microsoft Excel:

1. Abre un nuevo libro de Excel
2. En la **fila 1**, escribe los nombres de las columnas (ver tabla arriba)
3. A partir de la **fila 2**, agrega tus productos (mínimo 2)
4. Guarda como: `Archivo → Guardar como → Libro de Excel (.xlsx)`

#### En Google Sheets:

1. Crea una nueva hoja de cálculo
2. En la **fila 1**, escribe los nombres de las columnas
3. A partir de la **fila 2**, agrega tus productos (mínimo 2)
4. Descarga como: `Archivo → Descargar → Microsoft Excel (.xlsx)`

#### Como CSV:

1. Crea el archivo en Excel o Google Sheets
2. Guarda/Descarga como `.CSV` (UTF-8)
3. Asegúrate de que use **coma (,)** como separador

---

## ⚠️ Errores Comunes

### 1. Archivo vacío o con solo 1 producto

❌ **Error:** "El archivo debe contener más de 1 producto"

✅ **Solución:** Agrega al menos 2 productos

---

### 2. Faltan columnas

❌ **Error:** "Faltan los siguientes campos requeridos: stock, ubicacion..."

✅ **Solución:** Asegúrate de que la primera fila contenga TODOS los nombres de columnas exactamente como se muestran arriba

---

### 3. Categoría no existe

❌ **Error:** "Categoría 'Metales' no existe"

✅ **Solución:**

- Ve a **Categorías** en el menú
- Agrega la categoría primero
- Luego intenta importar nuevamente

---

### 4. Dimensiones incompletas

❌ **Error:** "Dimensiones incompletas"

✅ **Solución:** Cada producto debe tener las 4 columnas de dimensiones:

- `dimensiones.largo`
- `dimensiones.ancho`
- `dimensiones.alto`
- `dimensiones.unidad`

---

### 5. SKU duplicado dentro del archivo

❌ **Error:** "SKUs duplicados dentro del archivo: BAND-001, CONT-002"

✅ **Solución:**

- Revisa el archivo y asegúrate de que cada SKU sea único
- Cada producto debe tener un código SKU diferente
- Usa un patrón secuencial (ej: PROD-001, PROD-002, PROD-003)

---

### 6. SKU ya existe en el sistema

❌ **Error:** 'SKU "BAND-001" ya existe en: Bandeja Plástica Grande'

✅ **Solución:**

- El SKU que intentas importar ya está registrado en otro producto
- Cambia el SKU en tu archivo por uno único
- Verifica tus productos existentes antes de importar

---

### 7. Formato de ubicación incorrecto

❌ **Error:** Ubicación: "Pasillo 1 Estanteria 2"

✅ **Correcto:** P1-E2-N1

Formato: `P[número]-E[número]-N[número]`

---

## 🎨 Valores Válidos por Campo

### unidad_peso:

- `kg` (kilogramos)
- `g` (gramos)
- `lb` (libras)

### tamaño:

- `pequeño`
- `mediano`
- `grande`

### dimensiones.unidad:

- `cm` (centímetros)
- `m` (metros)
- `in` (pulgadas)

### ubicacion:

- Formato: `P#-E#-N#`
- Ejemplos válidos:
  - `P1-E1-N1`
  - `P2-E3-N2`
  - `P3-E4-N3`

---

## 🔍 Proceso de Validación

Cuando subes un archivo, el sistema:

1. ✅ Verifica que tenga más de 1 producto
2. ✅ Valida que existan todos los campos requeridos en la primera fila
3. ✅ **Verifica que no haya SKUs duplicados dentro del archivo**
4. ✅ Comprueba que cada categoría exista en el sistema
5. ✅ Verifica que todos los campos estén completos
6. ✅ Muestra un resumen de productos válidos e inválidos
7. ✅ Te permite confirmar antes de importar
8. ✅ **Durante la importación, verifica que cada SKU no exista en la base de datos**

**Los productos inválidos serán omitidos**, solo se importarán los válidos.

**Productos con SKU duplicado** (tanto en el archivo como en la base de datos) serán rechazados automáticamente.

---

## 📊 Ejemplo Completo en CSV

```csv
producto,categoria,descripcion,sku,stock,ubicacion,peso,unidad_peso,tamaño,dimensiones.largo,dimensiones.ancho,dimensiones.alto,dimensiones.unidad
Bandeja Plástica Grande,Plásticos,Bandeja plástica reciclada de gran tamaño,BAND-001,50,P1-E1-N1,0.5,kg,grande,40,30,10,cm
Contenedor Mediano,Plásticos,Contenedor plástico para almacenamiento,CONT-002,30,P1-E2-N1,0.8,kg,mediano,35,25,15,cm
Botella Reciclada 1L,Botellas,Botella plástica reciclada de 1 litro,BOT-003,100,P2-E1-N2,0.2,kg,pequeño,25,8,8,cm
```

---

## 🚀 Consejos Pro

1. **Usa la plantilla:** Es la forma más fácil y segura de crear el archivo
2. **Verifica categorías primero:** Antes de importar, asegúrate de que todas las categorías existan
3. **SKU único y consistente:**
   - Cada SKU debe ser único en todo el sistema
   - Usa un patrón consistente (ej: CAT-TIPO-###)
   - Verifica que no existan en la base de datos antes de importar
   - Evita duplicados dentro del mismo archivo
4. **Prueba con pocos productos:** Haz una prueba con 2-3 productos antes de importar cientos
5. **Copia de seguridad:** Guarda una copia del archivo por si necesitas hacer ajustes
6. **Revisa el resumen:** Lee cuidadosamente el resumen de validación antes de confirmar
7. **Exporta primero:** Si ya tienes productos, revisa sus SKUs para evitar duplicados

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo importar productos con SKU duplicados?**  
R: No, cada SKU debe ser único.

**P: ¿Qué pasa si una categoría no existe?**  
R: El producto será marcado como inválido y no se importará.

**P: ¿Puedo importar 1000 productos a la vez?**  
R: Sí, pero se recomienda hacer pruebas con archivos pequeños primero.

**P: ¿El sistema me avisará si hay errores?**  
R: Sí, después de seleccionar el archivo verás un resumen completo de validación.

**P: ¿Se pueden importar productos sin stock (0)?**  
R: Sí, puedes poner stock: 0 para productos sin inventario.

---

## 📞 Soporte

Si tienes problemas con la importación:

1. Verifica esta guía
2. Descarga la plantilla de ejemplo
3. Asegúrate de seguir el formato exacto
4. Revisa los mensajes de error del sistema

---

**Última actualización:** Octubre 2024  
**Versión del sistema:** Warehouse Stocks v1.0
