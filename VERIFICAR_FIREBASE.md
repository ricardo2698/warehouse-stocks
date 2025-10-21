# 🔍 Verificación de Conexión a Firebase

## Pasos para Diagnosticar

### 1. Reinicia el Servidor de Desarrollo

```bash
# Detén el servidor (Ctrl + C)
# Luego ejecuta:
npm run dev
```

### 2. Verifica el Proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. **IMPORTANTE**: Verifica que estés en el proyecto correcto: **`warehouse-stocks`**
3. Busca el selector de proyectos en la parte superior
4. Si ves otro proyecto, cámbialo a `warehouse-stocks`

### 3. Verifica que el Documento Existe

En Firebase Console:

1. Ve a **Firestore Database**
2. Busca la colección **`users`**
3. Busca el documento con ID: **`bhFK4DsQBXQ7IlOgyoHVrvTLqv83`**
4. Verifica que contenga:
   ```
   uid: "bhFK4DsQBXQ7IlOgyoHVrvTLqv83"
   email: "roxana.test@gmail.com"
   name: "Roxana"
   lastName: "Saucedo"
   role: "admin"
   createdAt: [timestamp]
   ```

### 4. Verifica los Logs Detallados

Después de reiniciar y hacer login, busca en la consola:

```
📍 Ruta completa: users/bhFK4DsQBXQ7IlOgyoHVrvTLqv83
📁 Ruta de la referencia: users/bhFK4DsQBXQ7IlOgyoHVrvTLqv83
```

Si la ruta NO coincide con el documento en Firestore, hay un problema.

### 5. Verifica las Reglas (De Nuevo)

Asegúrate de que las reglas incluyan la sección de `users`:

```javascript
match /users/{userId} {
  allow read: if isAuthenticated() && request.auth.uid == userId;
  allow update: if isAuthenticated() && request.auth.uid == userId;
}
```

---

## 🆘 Solución Alternativa

Si nada funciona, intenta **recrear el documento** siguiendo estos pasos exactos:

### Paso 1: Elimina el documento actual

1. Ve a Firestore Database > users
2. Haz clic en el documento
3. Haz clic en los 3 puntos (⋮)
4. Selecciona "Eliminar documento"

### Paso 2: Inicia sesión en la app

1. Ve a tu aplicación
2. Inicia sesión con `roxana.test@gmail.com`
3. Abre la consola (F12)
4. Copia el UID que aparece en: `👤 Usuario autenticado, UID: ...`

### Paso 3: Crea el documento manualmente

1. En Firestore, haz clic en "Agregar documento"
2. Colección: `users`
3. ID del documento: **PEGA el UID que copiaste** (Ctrl+V)
4. Agrega los campos:

| Campo     | Tipo      | Valor                     |
| --------- | --------- | ------------------------- |
| uid       | string    | [el UID que copiaste]     |
| email     | string    | roxana.test@gmail.com     |
| name      | string    | Roxana                    |
| lastName  | string    | Saucedo                   |
| role      | string    | admin                     |
| createdAt | timestamp | [selecciona fecha actual] |

5. Haz clic en "Guardar"

### Paso 4: Recarga la app

1. En la aplicación, haz Ctrl + Shift + R (recarga forzada)
2. O cierra sesión y vuelve a iniciar sesión

---

## 📋 Logs que Necesito Ver

Copia y envía TODOS estos logs de la consola:

```
📦 Instancia de Firestore: ...
📍 Ruta completa: ...
📝 Referencia del documento: ...
🔑 ID de la referencia: ...
📁 Ruta de la referencia: ...
📄 Documento existe: ...
🆔 ID del documento retornado: ...
```

---

## 🎯 Verificación del Proyecto

Ejecuta esto en la consola del navegador (F12):

```javascript
// Pega esto y presiona Enter
console.log("🔥 Firebase Config:");
console.log("Project ID:", "warehouse-stocks");
console.log("Auth Domain:", "warehouse-stocks.firebaseapp.com");
```

El Project ID DEBE ser exactamente: **`warehouse-stocks`**

Si es diferente, estás conectado al proyecto equivocado.
