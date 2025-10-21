# 🔧 Solución de Problemas: UserProfile es null

## Problema

El usuario está autenticado pero `userProfile` sale como `null`.

---

## ✅ Solución Rápida (Más Común)

### Paso 1: Verificar que el UID coincida

El **ID del documento en Firestore** debe ser **exactamente igual** al **UID del usuario autenticado**.

1. Inicia sesión en la aplicación
2. Abre la consola del navegador (F12)
3. Busca el mensaje que dice: `👤 Usuario autenticado, UID: [tu-uid]`
4. Copia ese UID
5. Ve a Firebase Console > Firestore Database > users
6. **Verifica que exista un documento con ese EXACTO UID como ID**

Si el UID no coincide, elimina el documento y créalo de nuevo con el UID correcto.

---

### Paso 2: Actualizar las Reglas de Firestore

Las reglas actuales requieren que el usuario lea **su propio** documento. Asegúrate de tener estas reglas:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthenticated() {
      return request.auth != null;
    }

    // IMPORTANTE: Permitir que el usuario lea su propio perfil
    match /users/{userId} {
      allow read: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && request.auth.uid == userId;
    }
  }
}
```

**Pasos para aplicar:**

1. Ve a Firebase Console > Firestore Database > Reglas
2. Copia y pega las reglas de arriba
3. Haz clic en **"Publicar"**
4. Cierra sesión en la app y vuelve a iniciar sesión

---

### Paso 3: Verificar la Estructura del Documento

El documento en Firestore debe tener **todos** estos campos:

```json
{
  "uid": "bhFK4DsQBXQ7lIOgyoHVrvTLqv83",
  "email": "roxana.test@gmail.com",
  "name": "Roxana",
  "lastName": "Saucedo",
  "role": "admin",
  "createdAt": "timestamp"
}
```

**Verifica:**

- ✅ El campo `role` debe ser **"admin"** o **"assistant"** (minúsculas)
- ✅ Todos los campos son tipo **string** excepto `createdAt` que es **timestamp**
- ✅ No hay espacios extra en los valores

---

## 🔍 Diagnóstico con el Panel

1. Ve al Dashboard de tu aplicación
2. Verás un panel de diagnóstico en la parte superior
3. Abre la consola del navegador (F12)
4. Busca estos mensajes:

### Mensajes Normales (Todo OK):

```
🔐 Estado de autenticación cambió: roxana.test@gmail.com
👤 Usuario autenticado, UID: bhFK4DsQBXQ7lIOgyoHVrvTLqv83
🔍 Intentando obtener perfil del usuario: bhFK4DsQBXQ7lIOgyoHVrvTLqv83
📄 Documento existe: true
✅ Datos del perfil obtenidos: { uid: "...", email: "...", ... }
📋 Perfil obtenido: { uid: "...", email: "...", ... }
```

### Mensajes de Error:

#### Error 1: "Documento existe: false"

```
📄 Documento existe: false
⚠️ No existe el documento del usuario en Firestore
```

**Solución:**

- El documento no existe en Firestore
- Créalo manualmente siguiendo el Paso 3 de arriba

#### Error 2: "Missing or insufficient permissions"

```
❌ Error al obtener perfil de usuario: FirebaseError: Missing or insufficient permissions
```

**Solución:**

- Las reglas de Firestore están bloqueando el acceso
- Sigue el Paso 2 de arriba para actualizar las reglas

#### Error 3: El UID no coincide

```
👤 Usuario autenticado, UID: ABC123
🔍 Intentando obtener perfil del usuario: ABC123
📄 Documento existe: false
```

Pero en Firestore tienes un documento con ID `XYZ789`

**Solución:**

- Elimina el documento viejo
- Crea uno nuevo con el ID exacto del UID

---

## 🚀 Solución Definitiva: Recrear el Usuario

Si nada funciona, recrea el perfil del usuario:

### Opción A: Desde la Consola

1. **Elimina el documento viejo:**

   - Ve a Firestore Database > users
   - Elimina el documento del usuario

2. **Obtén el UID correcto:**

   - Inicia sesión en la app
   - Abre consola (F12) y busca: `👤 Usuario autenticado, UID: [copia-esto]`

3. **Crea el documento con el UID correcto:**

   - En Firestore, haz clic en "Iniciar colección" o "Agregar documento"
   - **Colección:** `users`
   - **ID del documento:** Pega el UID que copiaste (ej: `bhFK4DsQBXQ7lIOgyoHVrvTLqv83`)
   - **Campos:**
     ```
     uid: "bhFK4DsQBXQ7lIOgyoHVrvTLqv83"
     email: "roxana.test@gmail.com"
     name: "Roxana"
     lastName: "Saucedo"
     role: "admin"
     createdAt: [timestamp actual]
     ```

4. **Reinicia la sesión:**
   - Cierra sesión en la app
   - Vuelve a iniciar sesión
   - El perfil debería cargar correctamente

---

## 📋 Checklist de Verificación

- [ ] El UID del documento en Firestore coincide exactamente con el UID del usuario autenticado
- [ ] Las reglas de Firestore permiten que el usuario lea su propio perfil
- [ ] El documento tiene todos los campos requeridos (uid, email, name, lastName, role, createdAt)
- [ ] El campo `role` es "admin" o "assistant" (minúsculas)
- [ ] No hay errores en la consola del navegador
- [ ] He cerrado sesión e iniciado sesión de nuevo después de hacer cambios

---

## 🎯 Comando Rápido de Verificación

Ejecuta esto en la consola del navegador (F12):

```javascript
// Ver el UID del usuario actual
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("✅ UID del usuario:", user.uid);
    console.log("✅ Email:", user.email);
  } else {
    console.log("❌ No hay usuario autenticado");
  }
});
```

Luego verifica que exista un documento en `users/[ese-uid]` en Firestore.

---

## 💡 Tip Final

El error más común es que el **ID del documento** en Firestore **NO coincide** con el **UID del usuario autenticado**.

**Ejemplo de error:**

- Usuario UID: `bhFK4DsQBXQ7lIOgyoHVrvTLqv83`
- Documento ID: `roxana` ❌ INCORRECTO

**Correcto:**

- Usuario UID: `bhFK4DsQBXQ7lIOgyoHVrvTLqv83`
- Documento ID: `bhFK4DsQBXQ7lIOgyoHVrvTLqv83` ✅ CORRECTO

---

Si después de seguir todos estos pasos el problema persiste, comparte los logs de la consola del navegador para un diagnóstico más detallado.
