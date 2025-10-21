# 🚀 Guía de Deployment en Vercel

## Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio en GitHub (✅ Ya lo tienes)
3. Configuración de Firebase

---

## 📝 Pasos para Desplegar

### 1. Subir cambios a GitHub

```bash
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

### 2. Configurar Vercel

1. Ve a [vercel.com](https://vercel.com) y inicia sesión con GitHub
2. Click en **"Add New Project"**
3. Selecciona tu repositorio: `warehouse-stocks`
4. Vercel detectará automáticamente que es Next.js

### 3. Configurar Variables de Entorno

En la configuración del proyecto en Vercel, agrega estas variables de entorno:

```
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

**⚠️ IMPORTANTE:** Estos valores los obtienes de tu proyecto Firebase:

- Firebase Console → Project Settings → General → Your apps → SDK setup and configuration

### 4. Deploy

- Click en **"Deploy"**
- Vercel construirá y desplegará tu aplicación
- Te dará una URL como: `https://warehouse-stocks.vercel.app`

---

## 🔄 Deployments Automáticos

Una vez configurado, cada vez que hagas `git push` a la rama `main`, Vercel desplegará automáticamente los cambios.

---

## 🔧 Troubleshooting

### Error: "Build failed"

- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Vercel

### Error: "Firebase not configured"

- Asegúrate de que las variables de entorno tengan el prefijo `NEXT_PUBLIC_`
- Verifica que los valores sean correctos

### Error: "Module not found"

- Vercel debería instalar automáticamente las dependencias
- Si falla, verifica que `package.json` esté correcto

---

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Next.js en Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variables de Entorno](https://vercel.com/docs/projects/environment-variables)
