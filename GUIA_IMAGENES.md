# 🎨 Guía para Agregar Favicon y Logo

Esta guía te ayudará a agregar el favicon y el logo de tu aplicación Warehouse Stocks.

---

## 📂 Estructura de Carpetas

```
warehouse-stocks/
├── public/                    ← Carpeta para archivos estáticos
│   ├── favicon.ico           ← Favicon (16x16 o 32x32 px)
│   └── logo.png              ← Logo de la aplicación (recomendado: 200x200 px o más)
└── src/
    └── app/
        ├── favicon.ico       ← Alternativa: favicon aquí (Next.js 14+)
        └── icon.png          ← Alternativa: favicon en PNG
```

---

## 📥 Dónde Colocar tus Imágenes

### Opción 1: En la carpeta `public/` (Recomendado)

**Coloca tus archivos así:**

```
public/
├── favicon.ico    ← Tu favicon (ícono de la pestaña del navegador)
└── logo.png       ← Tu logo (para login y dashboard)
```

### Opción 2: Para el favicon en `src/app/` (Moderno)

Si prefieres usar el sistema moderno de Next.js:

```
src/app/
├── favicon.ico    ← Favicon automático
└── icon.png       ← Se convierte en favicon automáticamente
```

---

## 🎯 Pasos para Agregar las Imágenes

### 1. **Preparar tus imágenes**

**Favicon:**

- Formato: `.ico` (recomendado) o `.png`
- Tamaño: 16x16, 32x32, o 48x48 píxeles
- Nombre sugerido: `favicon.ico`

**Logo:**

- Formato: `.png` (con fondo transparente) o `.svg`
- Tamaño recomendado: 200x200 px o más (se ajustará automáticamente)
- Nombre sugerido: `logo.png`

### 2. **Copiar archivos a la carpeta public**

**En Windows (PowerShell o CMD):**

```bash
# Desde la ubicación de tus imágenes
copy tu-favicon.ico C:\Users\LENOVO\Documents\projects\warehouse-stocks\public\favicon.ico
copy tu-logo.png C:\Users\LENOVO\Documents\projects\warehouse-stocks\public\logo.png
```

**Método alternativo (usando el explorador de archivos):**

1. Abre el explorador de Windows
2. Navega a: `C:\Users\LENOVO\Documents\projects\warehouse-stocks\public\`
3. Copia tus archivos ahí
4. Renombra si es necesario:
   - `favicon.ico` para el favicon
   - `logo.png` para el logo

### 3. **Actualizar el código**

Los archivos de código ya están preparados para usar tus imágenes. Solo necesitas colocar los archivos con estos nombres exactos:

- `public/favicon.ico`
- `public/logo.png`

---

## 🖼️ Nombres de Archivo Recomendados

### Estructura Final:

```
public/
├── favicon.ico              # Favicon principal
├── logo.png                 # Logo completo (con texto)
├── logo-icon.png            # Opcional: solo el ícono (sin texto)
└── logo-white.png           # Opcional: versión en blanco para fondos oscuros
```

---

## 💡 Formatos Soportados

| Tipo    | Formatos Aceptados     | Recomendado              |
| ------- | ---------------------- | ------------------------ |
| Favicon | `.ico`, `.png`, `.svg` | `.ico`                   |
| Logo    | `.png`, `.jpg`, `.svg` | `.png` con transparencia |

---

## 📐 Tamaños Recomendados

### Favicon:

- **Mínimo:** 16x16 px
- **Recomendado:** 32x32 px o multi-tamaño `.ico`
- **Óptimo:** Archivo `.ico` con múltiples tamaños (16, 32, 48)

### Logo:

- **Login:** 150-200 px de ancho
- **Dashboard (sidebar):** 40-50 px de alto (versión completa)
- **Dashboard (collapsed):** 40x40 px (solo ícono)

---

## 🚀 Cómo Usar las Imágenes en el Código

### En el Layout Principal (favicon):

```tsx
// src/app/layout.tsx
<head>
  <link rel="icon" href="/favicon.ico" />
</head>
```

### En el Login:

```tsx
// src/components/LoginForm.tsx
import Image from "next/image";

<Image src="/logo.png" alt="Warehouse Stocks" width={200} height={200} />;
```

### En el Dashboard:

```tsx
// src/components/DashboardLayout.tsx
<Image src="/logo.png" alt="WS" width={40} height={40} />
```

---

## ✅ Verificar que Funciona

Después de agregar las imágenes:

1. **Reinicia el servidor de desarrollo:**

   ```bash
   # Presiona Ctrl+C en la terminal donde corre npm run dev
   # Luego ejecuta nuevamente:
   npm run dev
   ```

2. **Verifica el favicon:**

   - Abre el navegador
   - Mira la pestaña del navegador
   - Deberías ver tu favicon

3. **Verifica el logo:**
   - Ve a la página de login (`/login`)
   - Ve al dashboard
   - Deberías ver tu logo

---

## 🔄 Caché del Navegador

Si no ves los cambios inmediatamente:

1. **Forzar recarga:**

   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Limpiar caché:**

   - Chrome: F12 → Application → Clear storage
   - Firefox: F12 → Storage → Clear All

3. **Modo incógnito:**
   - Abre una ventana de incógnito para ver los cambios sin caché

---

## 📝 Ejemplo Completo

### Estructura final esperada:

```
warehouse-stocks/
└── public/
    ├── favicon.ico          # 32x32 px, archivo .ico
    └── logo.png             # 200x200 px, PNG con transparencia
```

### URLs en tu aplicación:

```
Favicon:  /favicon.ico       → Aparece en la pestaña del navegador
Logo:     /logo.png          → Se usa en login y dashboard
```

---

## 🎨 Consejos de Diseño

### Para el Favicon:

- Usa colores contrastantes
- Evita detalles muy pequeños (se pierden a 16x16 px)
- Prueba en fondo claro y oscuro

### Para el Logo:

- Usa PNG con fondo transparente
- Mantén una versión cuadrada (1:1)
- Asegúrate de que sea legible en tamaños pequeños
- Considera una versión simplificada para la sidebar colapsada

---

## 🐛 Solución de Problemas

### El favicon no aparece:

1. Verifica que el archivo se llame exactamente `favicon.ico`
2. Verifica que esté en la carpeta `public/`
3. Limpia la caché del navegador
4. Reinicia el servidor de desarrollo

### El logo no carga:

1. Verifica que el archivo esté en `public/logo.png`
2. Verifica el nombre exacto del archivo
3. Revisa la consola del navegador (F12) para ver errores
4. Confirma que el formato sea compatible (.png, .jpg, .svg)

### La imagen se ve distorsionada:

1. Ajusta los valores de `width` y `height` en el código
2. Usa `layout="intrinsic"` o `layout="responsive"` en el componente Image
3. Asegúrate de que la imagen original tenga buena resolución

---

## 📞 Comandos Útiles

```bash
# Ver contenido de la carpeta public
dir public

# Copiar favicon desde otra ubicación
copy ruta\del\archivo\favicon.ico public\favicon.ico

# Copiar logo desde otra ubicación
copy ruta\del\archivo\logo.png public\logo.png
```

---

## 🎯 Resumen Rápido

1. ✅ Coloca `favicon.ico` en `public/favicon.ico`
2. ✅ Coloca `logo.png` en `public/logo.png`
3. ✅ Reinicia el servidor de desarrollo
4. ✅ Recarga el navegador con Ctrl+Shift+R
5. ✅ ¡Listo! Deberías ver tus imágenes

---

**¿Necesitas ayuda para convertir o preparar tus imágenes?**

- **Crear favicon .ico:** https://favicon.io/
- **Optimizar PNG:** https://tinypng.com/
- **Convertir formatos:** https://cloudconvert.com/

---

**Última actualización:** Octubre 2024  
**Versión:** Warehouse Stocks v1.0
