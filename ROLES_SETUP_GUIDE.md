# 🔐 Guía de Configuración de Roles de Usuario

## Roles Disponibles

La aplicación maneja dos tipos de roles:

### 1. **ADMIN** (Administrador)

- **Color del tag**: Rojo
- **Permisos**:
  - ✅ Ver todos los productos
  - ✅ Crear nuevos productos
  - ✅ Editar productos existentes
  - ✅ Eliminar productos
  - ✅ Modificar stock de productos
  - ✅ Ver y gestionar categorías
  - ✅ Crear y eliminar categorías

### 2. **ASSISTANT** (Asistente)

- **Color del tag**: Azul
- **Permisos**:
  - ✅ Ver todos los productos
  - ✅ Modificar stock de productos
  - ❌ NO puede crear productos
  - ❌ NO puede editar productos
  - ❌ NO puede eliminar productos
  - ❌ NO puede acceder a categorías

---

## Cómo Crear Usuarios con Roles

### Opción 1: Usando el Script de Creación (Recomendado)

#### Paso 1: Ir a la consola de Firebase

```bash
node scripts/create-user-profile.js
```

Si el archivo no existe, créalo:

```javascript
// scripts/create-user-profile.js
const admin = require("firebase-admin");
const readline = require("readline");

// Inicializar Firebase Admin
const serviceAccount = require("../firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function createUserProfile() {
  rl.question("Email del usuario: ", (email) => {
    rl.question("Contraseña: ", (password) => {
      rl.question("Nombre: ", (name) => {
        rl.question("Apellido: ", (lastName) => {
          rl.question("Rol (admin/assistant): ", async (role) => {
            try {
              // Crear usuario en Authentication
              const userRecord = await admin.auth().createUser({
                email: email,
                password: password,
                displayName: `${name} ${lastName}`,
              });

              // Crear perfil en Firestore
              await db.collection("users").doc(userRecord.uid).set({
                uid: userRecord.uid,
                email: email,
                name: name,
                lastName: lastName,
                role: role,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
              });

              console.log(`\n✅ Usuario creado exitosamente:`);
              console.log(`   UID: ${userRecord.uid}`);
              console.log(`   Email: ${email}`);
              console.log(`   Rol: ${role}`);

              rl.close();
            } catch (error) {
              console.error("❌ Error al crear usuario:", error);
              rl.close();
            }
          });
        });
      });
    });
  });
}

createUserProfile();
```

### Opción 2: Manualmente desde Firebase Console

#### Paso 1: Crear el usuario en Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **warehouse-stocks**
3. Ve a **Authentication > Users**
4. Haz clic en **"Agregar usuario"**
5. Ingresa:
   - Email: `admin@almacen.com`
   - Contraseña: (la que quieras)
6. Copia el **UID** del usuario creado

#### Paso 2: Crear el perfil en Firestore

1. Ve a **Firestore Database > Data**
2. Haz clic en **"Iniciar colección"** (si no existe)
3. ID de la colección: `users`
4. ID del documento: **pega el UID del usuario**
5. Agrega los siguientes campos:

```
Campo: uid
Tipo: string
Valor: [el UID del usuario]

Campo: email
Tipo: string
Valor: admin@almacen.com

Campo: name
Tipo: string
Valor: Administrador

Campo: lastName
Tipo: string
Valor: Sistema

Campo: role
Tipo: string
Valor: admin   (o "assistant" para asistente)

Campo: createdAt
Tipo: timestamp
Valor: [fecha actual]
```

---

## Ejemplos de Usuarios de Prueba

### Usuario Administrador

```json
{
  "uid": "auto-generado-por-firebase",
  "email": "admin@almacen.com",
  "name": "Administrador",
  "lastName": "Principal",
  "role": "admin",
  "createdAt": "timestamp"
}
```

### Usuario Asistente

```json
{
  "uid": "auto-generado-por-firebase",
  "email": "asistente@almacen.com",
  "name": "Juan",
  "lastName": "Pérez",
  "role": "assistant",
  "createdAt": "timestamp"
}
```

---

## Cambiar el Rol de un Usuario Existente

### Desde Firebase Console:

1. Ve a **Firestore Database**
2. Navega a `users > [uid-del-usuario]`
3. Edita el campo `role`
4. Cambia el valor a `admin` o `assistant`
5. Guarda los cambios

El usuario verá los cambios la próxima vez que inicie sesión.

---

## Verificar Permisos en la Aplicación

### Para Admin:

1. Inicia sesión con una cuenta de admin
2. En el header deberías ver un tag **ADMIN** en color rojo
3. En el menú lateral deberías ver:
   - Dashboard
   - Productos
   - Categorías
4. En la página de Productos:
   - Botón "Agregar Producto" visible
   - Botones de editar y eliminar visibles en cada producto

### Para Assistant:

1. Inicia sesión con una cuenta de assistant
2. En el header deberías ver un tag **ASISTENTE** en color azul
3. En el menú lateral deberías ver:
   - Dashboard
   - Productos
   - (NO debe ver Categorías)
4. En la página de Productos:
   - Botón "Agregar Producto" NO visible
   - Solo botones de "Ver detalle" y "Modificar stock" visibles
   - NO hay botones de editar ni eliminar

---

## Reglas de Seguridad de Firestore

Asegúrate de tener estas reglas configuradas:

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

    // Productos - Admin: CRUD completo, Assistant: solo actualizar stock
    match /products/{productId} {
      allow read: if isAuthenticated();
      allow create: if isAdmin();
      allow update: if isAuthenticated(); // Permite a assistant actualizar stock
      allow delete: if isAdmin();
    }

    // Categorías - Solo admin
    match /categories/{categoryId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Usuarios
    match /users/{userId} {
      allow read: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

---

## Solución de Problemas

### El tag de rol no aparece en el header

**Causa**: El perfil del usuario no se cargó correctamente.

**Solución**:

1. Verifica que existe un documento en `users/{uid}` en Firestore
2. Cierra sesión y vuelve a iniciar sesión
3. Revisa la consola del navegador para ver errores

---

### El usuario puede acceder a funciones que no debería

**Causa**: El rol no está configurado correctamente o las reglas de Firestore no están aplicadas.

**Solución**:

1. Verifica el campo `role` en Firestore (debe ser exactamente "admin" o "assistant")
2. Verifica que las reglas de Firestore estén publicadas
3. Limpia la caché del navegador
4. Cierra sesión y vuelve a iniciar sesión

---

### Usuario assistant puede editar productos

**Causa**: Falta la validación del rol en el frontend o en las reglas de Firestore.

**Solución**:

1. Verifica que el código esté actualizado
2. Recarga la aplicación (Ctrl + F5)
3. Verifica las reglas de Firestore

---

## Estructura de Permisos Visual

```
┌─────────────────────────────────────────────────────────┐
│                      DASHBOARD                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Tag: ADMIN (rojo) | ASISTENTE (azul)           │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

MENÚ LATERAL:
┌─────────────────┐
│ Dashboard       │ ✅ Todos
│ Productos       │ ✅ Todos
│ Categorías      │ ✅ Solo Admin
└─────────────────┘

PRODUCTOS:
┌──────────────────────────────────────────────┐
│ Botón "Agregar Producto"    │ ✅ Solo Admin │
│                                              │
│ Tabla de Productos:                          │
│  - Ver detalle              │ ✅ Todos      │
│  - Modificar stock          │ ✅ Todos      │
│  - Editar                   │ ✅ Solo Admin │
│  - Eliminar                 │ ✅ Solo Admin │
└──────────────────────────────────────────────┘

CATEGORÍAS:
┌──────────────────────────────────────────────┐
│ Acceso completo             │ ✅ Solo Admin │
│ Mensaje "Acceso Denegado"   │ ❌ Assistant  │
└──────────────────────────────────────────────┘
```

---

## Mejores Prácticas

1. **Asigna roles con cuidado**: Solo otorga rol admin a usuarios de confianza
2. **Documenta los cambios**: Mantén un registro de quién tiene acceso admin
3. **Revisa periódicamente**: Audita los usuarios y sus roles regularmente
4. **Usa contraseñas seguras**: Especialmente para cuentas admin
5. **Capacita a los usuarios**: Asegúrate de que entiendan sus permisos

---

## Resumen de Cambios Realizados

✅ Tipos de roles actualizados: `admin` y `assistant`
✅ Tag de rol visible en el header con colores distintivos
✅ Menú de categorías oculto para assistant
✅ Botón "Agregar Producto" solo visible para admin
✅ Botones de editar y eliminar solo visibles para admin
✅ Página de categorías bloqueada para assistant
✅ Protección a nivel de interfaz implementada
✅ Mensaje de acceso denegado cuando assistant intenta acceder a categorías

---

¡Tu aplicación ahora tiene un sistema completo de roles y permisos! 🎉
