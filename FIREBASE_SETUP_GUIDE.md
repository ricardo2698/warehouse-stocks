# 🔥 Guía Completa de Configuración de Firebase

## ✅ Paso 1: Crear el archivo de Variables de Entorno

Crea un archivo llamado `.env.local` en la raíz del proyecto y copia el siguiente contenido:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAU6XgBrnwaWCTU7bPcQRCfXtz0IeBBk8g
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=warehouse-stocks.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=warehouse-stocks
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=warehouse-stocks.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=895589155883
NEXT_PUBLIC_FIREBASE_APP_ID=1:895589155883:web:85b65b924fff522731d66e
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ENRC0LDN0T
```

**Opción rápida con terminal:**

```bash
copy .env.local.example .env.local
```

---

## ✅ Paso 2: Configurar Firestore Database

### 2.1 Crear la Base de Datos

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **warehouse-stocks**
3. En el menú lateral, haz clic en **"Firestore Database"**
4. Haz clic en **"Crear base de datos"**
5. Selecciona la ubicación (recomendado: `southamerica-east1` para América Latina)
6. Selecciona **"Comenzar en modo de prueba"** (cambiaremos las reglas después)
7. Haz clic en **"Habilitar"**

### 2.2 Configurar las Reglas de Seguridad

1. Ve a la pestaña **"Reglas"** en Firestore Database
2. Reemplaza todo el contenido con estas reglas:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Función para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }

    // Colección de productos
    match /products/{productId} {
      allow read, write: if isAuthenticated();
    }

    // Colección de categorías
    match /categories/{categoryId} {
      allow read, write: if isAuthenticated();
    }

    // Colección de usuarios
    match /users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

3. Haz clic en **"Publicar"**

---

## ✅ Paso 3: Configurar Authentication

### 3.1 Habilitar Email/Password

1. En Firebase Console, ve a **"Authentication"**
2. Haz clic en **"Get started"** (si es la primera vez)
3. Ve a la pestaña **"Sign-in method"**
4. Haz clic en **"Email/Password"**
5. Habilita la opción **"Email/Password"** (primera opción)
6. Haz clic en **"Guardar"**

### 3.2 Crear tu primer usuario (Opcional)

**Opción A - Desde Firebase Console:**

1. Ve a **Authentication > Users**
2. Haz clic en **"Agregar usuario"**
3. Ingresa email y contraseña
4. Haz clic en **"Agregar usuario"**

**Opción B - Desde tu aplicación:**

1. Simplemente usa el formulario de login de tu app
2. La primera vez que ingreses, se creará el usuario

---

## ✅ Paso 4: Verificar la Instalación

### 4.1 Instalar dependencias (si no lo has hecho)

```bash
npm install
```

### 4.2 Iniciar el servidor de desarrollo

```bash
npm run dev
```

### 4.3 Probar la aplicación

1. Abre tu navegador en `http://localhost:3000`
2. Inicia sesión con tu usuario
3. Ve a **Categorías** e intenta crear una categoría
4. Ve a **Productos** e intenta crear un producto

### 4.4 Verificar en Firebase Console

1. Ve a **Firestore Database** en Firebase Console
2. Deberías ver las colecciones `categories` y `products` creadas
3. Dentro de cada colección verás los documentos que creaste

---

## 🔧 Solución de Problemas Comunes

### Error: "Missing or insufficient permissions"

**Causa:** Las reglas de Firestore no están configuradas correctamente o no estás autenticado.

**Solución:**

1. Verifica que publicaste las reglas de seguridad
2. Asegúrate de estar autenticado en la aplicación
3. Revisa la consola del navegador para más detalles

---

### Error: "The query requires an index"

**Causa:** Firestore necesita crear un índice para la consulta.

**Solución:**

1. Firebase te mostrará un enlace en el error
2. Haz clic en el enlace para crear el índice automáticamente
3. Espera unos segundos a que se cree el índice
4. Recarga la página

**Índices necesarios:**

- **products**: Campo `createdAt`, Orden: Descendente
- **categories**: Campo `nombre`, Orden: Ascendente

Para crearlos manualmente:

1. Ve a **Firestore Database > Índices**
2. Haz clic en **"Crear índice"**
3. Configura según la tabla anterior

---

### Error: "Firebase configuration error"

**Causa:** El archivo `.env.local` no existe o está mal configurado.

**Solución:**

1. Verifica que el archivo `.env.local` esté en la raíz del proyecto
2. Verifica que todas las variables comiencen con `NEXT_PUBLIC_`
3. Reinicia el servidor de desarrollo (`npm run dev`)

---

### Los cambios no se reflejan en Firebase

**Causa:** Puede haber un problema de caché o conexión.

**Solución:**

1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Verifica tu conexión a Internet
4. Intenta hacer logout/login
5. Limpia la caché del navegador

---

## 📊 Estructura de Datos en Firestore

### Colección: `products`

```javascript
{
  producto: "Bandeja plástica reciclada",
  categoria: "Hogar",
  descripcion: "Bandeja ecológica de plástico reciclado",
  peso: 1.5,
  unidad_peso: "kg",
  dimensiones: {
    largo: 30,
    ancho: 20,
    alto: 5,
    unidad: "cm"
  },
  tamaño: "mediano",
  sku: "ECO-HOG-001",
  stock: 100,
  ubicacion: "P1-E1-N1",
  fecha_registro: "21/10/2025",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Colección: `categories`

```javascript
{
  nombre: "Hogar",
  createdAt: Timestamp
}
```

### Colección: `users`

```javascript
{
  email: "usuario@example.com",
  displayName: "Usuario",
  role: "admin",
  createdAt: Timestamp
}
```

---

## 🔒 Mejoras de Seguridad Recomendadas

### Para Producción:

1. **Implementar Roles de Usuario:**

   - Agregar un campo `role` en la colección `users`
   - Modificar las reglas para validar permisos según el rol

2. **Validación de Datos:**

   - Agregar validaciones en las reglas de Firestore
   - Validar tipos de datos, longitud de strings, etc.

3. **Limitar operaciones:**

   - Solo administradores pueden eliminar productos/categorías
   - Solo administradores pueden crear usuarios

4. **Reglas más restrictivas:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /products/{productId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated();
      allow delete: if isAdmin();
    }

    match /categories/{categoryId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow delete: if isAdmin();
    }
  }
}
```

---

## ✅ Checklist Final

- [ ] Archivo `.env.local` creado con las credenciales
- [ ] Firestore Database habilitado
- [ ] Reglas de seguridad publicadas
- [ ] Authentication con Email/Password habilitado
- [ ] Usuario de prueba creado
- [ ] Aplicación iniciada con `npm run dev`
- [ ] Prueba de crear categoría exitosa
- [ ] Prueba de crear producto exitosa
- [ ] Datos visibles en Firebase Console

---

## 🎉 ¡Listo!

Tu aplicación de gestión de almacén ahora está completamente conectada con Firebase. Puedes:

- ✅ Crear, editar y eliminar productos
- ✅ Gestionar categorías
- ✅ Actualizar stock de productos
- ✅ Ver detalles de productos
- ✅ Autenticación de usuarios

Si tienes algún problema, revisa la sección de **Solución de Problemas** o contacta al equipo de desarrollo.
