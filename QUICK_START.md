# 🚀 Inicio Rápido - Crear Usuario en Firebase

## ⚡ 3 Pasos Simples

### 1️⃣ Crear usuario en Firebase Authentication

1. Ve a: https://console.firebase.google.com/
2. Proyecto: **warehouse-stocks**
3. **Authentication** > **Users** > **Add user**
4. Crea usuario:
   - **Email**: `admin@test.com`
   - **Password**: `Admin123!`
5. **⚠️ COPIA EL UID** que aparece en la tabla

---

### 2️⃣ Habilitar Firestore (si no está habilitado)

1. **Firestore Database** > **Create database**
2. Modo: **Test mode**
3. Ubicación: **us-east1**
4. **Enable**

---

### 3️⃣ Crear perfil en Firestore

#### Método Fácil: Firebase Console

1. En **Firestore Database**, click **Start collection**
2. Collection ID: `users`
3. Document ID: **[Pega el UID que copiaste]**
4. Agrega estos campos:

```
uid       → string    → [el mismo UID]
email     → string    → admin@test.com
name      → string    → Admin
lastName  → string    → User
role      → string    → admin
createdAt → timestamp → [fecha actual]
```

5. **Save**

---

#### Método Alternativo: Script

```bash
node scripts/create-user-profile.js
```

Sigue las instrucciones y te generará el código necesario.

---

## ✅ Verificar

1. Inicia tu aplicación: `npm run dev`
2. Ve a: http://localhost:3000
3. Login con:
   - Email: `admin@test.com`
   - Password: `Admin123!`
4. Deberías ver tu nombre y rol en el Dashboard

---

## 📚 Más Detalles

Para instrucciones completas, revisa: [SETUP_USER_GUIDE.md](./SETUP_USER_GUIDE.md)

