# 📚 Guía de Configuración de Usuario en Firebase

## 🔥 PASO 1: Crear Usuario en Firebase Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **"warehouse-stocks"**
3. Click en **"Authentication"** en el menú lateral
4. Si es la primera vez:

   - Click en **"Get started"**
   - Selecciona **"Email/Password"** en "Sign-in method"
   - Activa el primer switch
   - Guarda

5. Ve a la pestaña **"Users"**
6. Click en **"Add user"**
7. Ingresa los datos:
   ```
   Email: admin@test.com
   Password: Admin123!
   ```
8. Click en **"Add user"**
9. **⚠️ IMPORTANTE**: Copia el **UID** del usuario (aparece en la columna "User UID")

---

## 📊 PASO 2: Habilitar Firestore Database

1. En Firebase Console, ve a **"Firestore Database"** en el menú lateral
2. Click en **"Create database"**
3. Selecciona modo:
   - **Test mode** (recomendado para desarrollo)
   - O **Production mode** (más seguro, requiere reglas)
4. Selecciona ubicación: **us-east1** (o la más cercana)
5. Click en **"Enable"**

---

## 📝 PASO 3: Crear Documento de Usuario en Firestore

### Opción A: Manualmente en Firebase Console

1. En Firestore Database, click en **"Start collection"**
2. Nombre de la colección: `users`
3. Click en **"Next"**
4. En "Document ID", pega el **UID del usuario** que copiaste en el Paso 1
5. Agrega los siguientes campos:

| Campo     | Tipo      | Valor                      |
| --------- | --------- | -------------------------- |
| uid       | string    | (el mismo UID del usuario) |
| email     | string    | admin@test.com             |
| name      | string    | Admin                      |
| lastName  | string    | User                       |
| role      | string    | admin                      |
| createdAt | timestamp | (click en "Add timestamp") |

6. Click en **"Save"**

### Opción B: Usando la Consola del Navegador

1. Inicia sesión en tu aplicación con el usuario que creaste
2. Abre las **DevTools** del navegador (F12)
3. Ve a la pestaña **"Console"**
4. Copia y pega este código (reemplaza el UID con el tuyo):

```javascript
const { db } = await import("./src/config/firebase");
const { doc, setDoc } = await import("firebase/firestore");

await setDoc(doc(db, "users", "TU_UID_AQUI"), {
  uid: "TU_UID_AQUI",
  email: "admin@test.com",
  name: "Admin",
  lastName: "User",
  role: "admin",
  createdAt: new Date(),
});

console.log("✅ Perfil de usuario creado correctamente!");
```

---

## 🎯 PASO 4: Verificar que Todo Funciona

1. Inicia sesión en tu aplicación:

   ```
   Email: admin@test.com
   Password: Admin123!
   ```

2. Deberías ver en el Dashboard:
   - Tu nombre completo en la esquina superior derecha
   - Tu rol (ADMIN) con un tag rojo
   - Tu información completa en la tarjeta de bienvenida

---

## 👥 Roles Disponibles

La aplicación soporta 3 tipos de roles:

- **admin** 🔴 - Administrador con todos los permisos
- **user** 🔵 - Usuario normal con permisos básicos
- **viewer** 🟢 - Solo puede ver, sin permisos de edición

---

## 🔐 Reglas de Seguridad Recomendadas para Firestore

Ve a **Firestore Database > Rules** y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir que usuarios autenticados lean su propio perfil
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      // Solo admins pueden escribir
      allow write: if request.auth != null &&
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Reglas para otras colecciones
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🆘 Solución de Problemas

### Error: "No se pudo obtener el perfil del usuario"

- Verifica que el documento en Firestore tenga el mismo UID que el usuario en Authentication
- Verifica que todos los campos estén escritos correctamente (name, lastName, role)

### No veo mi información en el Dashboard

- Abre las DevTools (F12) y revisa la consola por errores
- Verifica que el documento existe en Firestore con el UID correcto
- Cierra sesión y vuelve a iniciar sesión

### Error de permisos en Firestore

- Verifica que las reglas de Firestore permitan la lectura
- En modo de desarrollo, puedes usar reglas más permisivas temporalmente

---

## 📧 Crear Más Usuarios

Para crear más usuarios, repite el proceso:

1. Authentication > Users > Add user
2. Crea el documento en Firestore con el UID del nuevo usuario
3. Ajusta los campos `name`, `lastName`, y `role` según necesites

**Ejemplo de usuario viewer:**

```
uid: [UID_DEL_USUARIO]
email: viewer@test.com
name: Vista
lastName: Solo
role: viewer
createdAt: [timestamp]
```

