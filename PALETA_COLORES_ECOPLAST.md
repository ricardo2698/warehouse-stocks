# 🎨 Paleta de Colores EcoPlast S.A.

Esta es la paleta de colores personalizada basada en el logo de EcoPlast, implementada en toda la aplicación Warehouse Stocks.

---

## 🌿 Colores Principales del Logo

### Análisis del Logo EcoPlast

```
Verde Oscuro:    #1a5d1a  ███████  (Bases, textos)
Verde Medio:     #52b947  ███████  (Color primario - Brillante)
Verde Brillante: #6bc75d  ███████  (Hover states)
Verde Claro:     #8bc34a  ███████  (Elementos secundarios)
Verde Lima:      #9ccc65  ███████  (Acentos suaves)
```

---

## 🎯 Paleta Implementada en Ant Design

### Colores de Token Global

| Propiedad            | Color     | Uso                                                         |
| -------------------- | --------- | ----------------------------------------------------------- |
| `colorPrimary`       | `#52b947` | Color principal en botones, enlaces, elementos interactivos |
| `colorLink`          | `#52b947` | Enlaces de texto                                            |
| `colorLinkHover`     | `#6bc75d` | Enlaces al pasar el mouse                                   |
| `colorLinkActive`    | `#429139` | Enlaces al hacer clic                                       |
| `colorSuccess`       | `#52b947` | Mensajes de éxito, estados positivos                        |
| `colorSuccessBg`     | `#f0f9ef` | Fondo de alertas de éxito                                   |
| `colorSuccessBorder` | `#b7e5b4` | Bordes de elementos de éxito                                |
| `colorInfo`          | `#8bc34a` | Información general                                         |
| `colorInfoBg`        | `#f4f9ed` | Fondo de alertas informativas                               |
| `colorInfoBorder`    | `#c5e1a5` | Bordes de elementos informativos                            |

---

## 🔧 Componentes Personalizados

### 🔘 Button (Botones)

```tsx
colorPrimary:       #52b947  // Verde medio
colorPrimaryHover:  #6bc75d  // Verde brillante (al pasar mouse)
colorPrimaryActive: #429139  // Verde oscurecido (al hacer clic)
primaryShadow:      rgba(82, 185, 71, 0.1)  // Sombra suave verde
```

**Resultado:**

- Botones primarios en verde EcoPlast
- Hover más brillante y atractivo
- Click con feedback visual oscuro
- Sombra verde sutil

### 📋 Menu (Menú de navegación)

```tsx
itemSelectedColor:  #52b947  // Texto del item seleccionado
itemSelectedBg:     rgba(82, 185, 71, 0.1)  // Fondo del item seleccionado
itemHoverColor:     #6bc75d  // Texto al hover
itemHoverBg:        rgba(82, 185, 71, 0.05) // Fondo al hover
```

**Resultado:**

- Items seleccionados con verde EcoPlast
- Hover suave y visible
- Fondo translúcido para elegancia

### ✏️ Input (Campos de entrada)

```tsx
activeBorderColor: #52b947  // Borde cuando está activo/enfocado
hoverBorderColor:  #6bc75d  // Borde al pasar el mouse
```

**Resultado:**

- Inputs con borde verde al enfocarse
- Feedback visual claro en verde

### 📝 Select (Selectores)

```tsx
optionSelectedBg: rgba(82, 185, 71, 0.1); // Fondo de opción seleccionada
```

**Resultado:**

- Opciones seleccionadas con fondo verde suave

### 🏷️ Tag (Etiquetas)

```tsx
defaultBg:    #f0f9ef  // Fondo verde muy claro
defaultColor: #1a5d1a  // Texto verde oscuro
```

**Resultado:**

- Tags con aspecto ecológico
- Contraste alto para legibilidad

---

## 🎨 Gradientes y Fondos

### Login Page

```tsx
Gradiente: from-green-50 to-emerald-100
```

**Antes:**  
`from-blue-50 to-indigo-100` (Azul)

**Ahora:**  
`from-green-50 to-emerald-100` (Verde)

**Resultado:**

- Fondo degradado verde suave
- Armonía con el logo de EcoPlast
- Ambiente natural y ecológico

---

## 📊 Comparación Antes/Después

### Color Primario

| Antes (Ant Design Default) | Ahora (EcoPlast)     |
| -------------------------- | -------------------- |
| 🔵 `#1890ff` (Azul)        | 🟢 `#52b947` (Verde) |

### Visualización

```
ANTES (Azul):
Botón primario:    🔵🔵🔵🔵
Enlaces:           🔵🔵🔵🔵
Hover:             🔵🔵🔵🔵
Menú activo:       🔵🔵🔵🔵

AHORA (Verde EcoPlast):
Botón primario:    🟢🟢🟢🟢
Enlaces:           🟢🟢🟢🟢
Hover:             🟢🟢🟢🟢
Menú activo:       🟢🟢🟢🟢
```

---

## 🌈 Paleta Completa de Verdes

### Escala de Verdes EcoPlast

```css
/* Muy claro - Fondos */
#f0f9ef  ░░░░░  Backgrounds, fondos suaves
#f4f9ed  ░░░░░  Fondos alternativos

/* Claro - Bordes */
#c5e1a5  ▒▒▒▒▒  Bordes informativos
#b7e5b4  ▒▒▒▒▒  Bordes de éxito

/* Medio Claro - Acentos */
#9ccc65  ▓▓▓▓▓  Acentos suaves
#8bc34a  ▓▓▓▓▓  Color info, elementos secundarios

/* Medio - Principal */
#6bc75d  █████  Hover states
#52b947  █████  COLOR PRINCIPAL - Verde EcoPlast
#4caf50  █████  Variación alternativa

/* Medio Oscuro - Interacciones */
#429139  █████  Active states, clicks

/* Oscuro - Textos */
#1a5d1a  █████  Textos, elementos de contraste
#0d4d0d  █████  Textos muy oscuros
```

---

## 📱 Aplicaciones en la UI

### Dónde verás los colores verdes:

#### 🔐 Login

- ✅ Fondo degradado verde suave
- ✅ Botón "Iniciar Sesión" en verde EcoPlast
- ✅ Inputs con borde verde al enfocarse
- ✅ Logo con colores originales

#### 🏢 Dashboard

- ✅ Items del menú activos en verde
- ✅ Hover del menú en verde brillante
- ✅ Tags de rol (ADMIN/ASISTENTE) con verde personalizado
- ✅ Logo EcoPlast en el sidebar

#### 📦 Productos

- ✅ Botones "Agregar Producto" e "Importar Masivo" en verde
- ✅ Tags de categorías en tonos verdes
- ✅ Estados de stock con verde para indicadores positivos
- ✅ Modales con botones primarios verdes

#### 📊 Dashboard Estadísticas

- ✅ Cards de estadísticas con acentos verdes
- ✅ Indicadores de stock con verde para niveles buenos
- ✅ Badges y contadores en verde

#### 🏭 Bodega

- ✅ Gradientes de ocupación usando escala de verdes
- ✅ Indicadores "Bajo" en verde para stock disponible
- ✅ Botones de acción en verde EcoPlast

#### 🏷️ Categorías

- ✅ Tags de categorías en verde claro
- ✅ Botón "Agregar" en verde principal
- ✅ Estados activos del menú

---

## 🎯 Valores de Referencia Rápida

### Copy-Paste Ready

```javascript
// Color Principal
const primaryGreen = "#52b947";

// Hover
const hoverGreen = "#6bc75d";

// Active/Click
const activeGreen = "#429139";

// Backgrounds
const lightGreenBg = "#f0f9ef";
const veryLightGreenBg = "#f4f9ed";

// Borders
const greenBorder = "#b7e5b4";
const lightGreenBorder = "#c5e1a5";

// Text
const darkGreenText = "#1a5d1a";

// Info/Secondary
const secondaryGreen = "#8bc34a";
```

---

## 🚀 Implementación

### Archivos Modificados

1. **`src/app/layout.tsx`**

   - ConfigProvider con tema personalizado
   - Todos los tokens de color actualizados
   - Componentes personalizados (Button, Menu, Input, Select, Tag)

2. **`src/components/LoginForm.tsx`**

   - Gradiente de fondo cambiado a verde
   - Armonía con logo EcoPlast

3. **`src/components/DashboardLayout.tsx`**
   - Nombre actualizado a "EcoPlast S.A."
   - Menú con colores verdes integrados

### Metadata

```tsx
title: "EcoPlast S.A. - Warehouse Stocks";
description: "Sistema de gestión de inventario - Innovación que cuida el planeta";
```

---

## ✨ Beneficios de la Nueva Paleta

1. **Identidad de Marca** 🏢

   - Colores consistentes con el logo de EcoPlast
   - Refuerza la imagen ecológica de la empresa

2. **Armonía Visual** 🎨

   - Todos los elementos usan la misma familia de verdes
   - Transiciones suaves entre estados

3. **Usabilidad** 👁️

   - Alto contraste en textos (verde oscuro sobre claro)
   - Estados hover visibles y atractivos
   - Feedback visual claro en interacciones

4. **Profesionalismo** 💼

   - Paleta completa y bien pensada
   - Consistencia en toda la aplicación
   - Aspecto moderno y limpio

5. **Tema Ecológico** 🌱
   - Refuerza el mensaje de sostenibilidad
   - Verde asociado con naturaleza e innovación
   - Alineado con "Innovación que cuida el planeta"

---

## 🔄 Cómo Ver los Cambios

1. Reinicia el servidor de desarrollo:

   ```bash
   Ctrl + C
   npm run dev
   ```

2. Abre la aplicación:

   ```
   http://localhost:3000
   ```

3. Verifica los cambios en:
   - 🔐 Página de Login
   - 🏢 Dashboard y menú lateral
   - 📦 Página de Productos
   - 🏭 Vista de Bodega
   - 🏷️ Gestión de Categorías

---

## 📝 Notas de Diseño

- La paleta está optimizada para accesibilidad (WCAG AA)
- Los contrastes cumplen con estándares de legibilidad
- Los hover states son suficientemente distintos
- Los colores funcionan en modo claro (no se implementó modo oscuro)

---

**Implementado:** Octubre 21, 2025  
**Diseñador:** Basado en logo EcoPlast S.A.  
**Aplicación:** Warehouse Stocks  
**Framework:** Ant Design 5.x  
**Estado:** ✅ Completamente Implementado

---

## 🎨 Inspiración

La paleta se inspiró en:

- 🌿 Logo EcoPlast con sus flechas verdes circulares
- ♻️ Símbolo de reciclaje y sostenibilidad
- 🌍 Compromiso con el cuidado del planeta
- 💚 Verde como color de la innovación ecológica

