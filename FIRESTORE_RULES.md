# Configuración de Reglas de Firestore

## Pasos para configurar las reglas de seguridad en Firebase Console:

### 1. Ve a Firebase Console

- Accede a https://console.firebase.google.com/
- Selecciona tu proyecto: **warehouse-stocks**

### 2. Configurar Firestore Database

- En el menú lateral, haz clic en **"Firestore Database"**
- Si aún no has creado la base de datos, haz clic en **"Crear base de datos"**
- Selecciona la ubicación más cercana a tus usuarios
- Comienza en **modo de prueba** (luego cambiaremos las reglas)

### 3. Configurar las Reglas de Seguridad

- Ve a la pestaña **"Reglas"** en Firestore Database
- Reemplaza las reglas existentes con las siguientes:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Función para verificar si el usuario está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }

    // Función para verificar si el usuario es admin
    function isAdmin() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Reglas para la colección de productos
    match /products/{productId} {
      // Todos los usuarios autenticados pueden leer
      allow read: if isAuthenticated();

      // Solo admin puede crear productos
      allow create: if isAdmin();

      // Todos pueden actualizar (para que assistant pueda modificar stock)
      allow update: if isAuthenticated();

      // Solo admin puede eliminar productos
      allow delete: if isAdmin();
    }

    // Reglas para la colección de categorías
    match /categories/{categoryId} {
      // Todos los usuarios autenticados pueden leer
      allow read: if isAuthenticated();

      // Solo admin puede crear y eliminar categorías
      allow create: if isAdmin();
      allow delete: if isAdmin();
    }

    // Reglas para los perfiles de usuario
    match /users/{userId} {
      // Permitir lectura solo del propio perfil
      allow read: if isAuthenticated() && request.auth.uid == userId;

      // Permitir actualización solo del propio perfil
      allow update: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

### 4. Publicar las Reglas

- Haz clic en **"Publicar"**
- Confirma que las reglas se aplicaron correctamente

### 5. Configurar Índices (Importante)

- Ve a la pestaña **"Índices"** en Firestore Database
- Firebase creará automáticamente los índices necesarios cuando intentes hacer consultas
- Si recibes errores sobre índices faltantes, Firebase te dará un enlace directo para crearlos

## Índices que se crearán automáticamente:

### Para productos:

- Campo: `createdAt`
- Orden: Descendente

### Para categorías:

- Campo: `nombre`
- Orden: Ascendente

## Notas Importantes:

⚠️ **Estas reglas requieren que los usuarios estén autenticados**. Asegúrate de que tu sistema de autenticación esté funcionando correctamente antes de usarlas en producción.

🔒 **Seguridad**: Las reglas actuales permiten que cualquier usuario autenticado pueda leer, crear, actualizar y eliminar productos y categorías. Si necesitas permisos más específicos (como roles de administrador), deberás ajustar estas reglas.

💡 **Tip**: Si necesitas probar la aplicación sin autenticación temporalmente, puedes usar estas reglas de desarrollo (NO recomendado para producción):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Solo para desarrollo
    }
  }
}
```

## Verificación de Configuración

Para verificar que todo funciona correctamente:

1. Inicia tu aplicación: `npm run dev`
2. Inicia sesión en la aplicación
3. Intenta crear una categoría
4. Intenta crear un producto
5. Verifica en Firebase Console > Firestore Database que los datos se están guardando

Si recibes errores de permisos, revisa:

- Que estés autenticado en la aplicación
- Que las reglas estén publicadas correctamente
- Que los índices necesarios estén creados
