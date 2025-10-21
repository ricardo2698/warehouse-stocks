# Guía Rápida: Crear Usuarios con Roles

## Método Rápido - Firebase Console (Manual)

### Crear Usuario ADMIN

1. **Authentication**:

   - Ve a Firebase Console > Authentication > Users
   - Clic en "Agregar usuario"
   - Email: `admin@warehouse.com`
   - Password: `Admin123456`
   - Copia el UID generado

2. **Firestore**:
   - Ve a Firestore Database
   - Colección: `users`
   - Documento ID: [pega el UID]
   - Agrega estos campos:
     ```
     uid: [el UID]
     email: admin@warehouse.com
     name: Admin
     lastName: Sistema
     role: admin
     createdAt: [timestamp actual]
     ```

### Crear Usuario ASSISTANT

1. **Authentication**:

   - Email: `asistente@warehouse.com`
   - Password: `Asist123456`
   - Copia el UID generado

2. **Firestore**:
   - Colección: `users`
   - Documento ID: [pega el UID]
   - Agrega estos campos:
     ```
     uid: [el UID]
     email: asistente@warehouse.com
     name: Juan
     lastName: Asistente
     role: assistant
     createdAt: [timestamp actual]
     ```

---

## Verificación Rápida

### Usuario Admin debe ver:

- ✅ Tag rojo "ADMIN" en el header
- ✅ Menú: Dashboard, Productos, Categorías
- ✅ Botón "Agregar Producto"
- ✅ Botones editar y eliminar en productos

### Usuario Assistant debe ver:

- ✅ Tag azul "ASISTENTE" en el header
- ✅ Menú: Dashboard, Productos (NO Categorías)
- ❌ Sin botón "Agregar Producto"
- ✅ Solo botones ver detalle y modificar stock

---

## Cambiar Rol de Usuario

1. Ve a Firestore Database
2. Navega a `users > [uid-del-usuario]`
3. Edita el campo `role`
4. Cambia a `admin` o `assistant`
5. El usuario verá cambios al cerrar sesión e iniciar de nuevo

---

## Comandos Útiles de Firebase CLI

```bash
# Listar usuarios
firebase auth:export users.json

# Ver usuario específico
firebase auth:get user@example.com
```

---

## ¿Problemas?

### Rol no aparece en la app

- Verifica que el documento existe en `users/{uid}`
- Cierra sesión y vuelve a iniciar
- Revisa la consola del navegador (F12)

### Permisos incorrectos

- Verifica que el campo `role` sea exactamente "admin" o "assistant"
- Sin espacios, en minúsculas
- Publica las reglas de Firestore si las modificaste
