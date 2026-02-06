# 🚀 Guía Rápida de Deploy

## Deploy en 10 minutos

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Login en Vercel

```bash
vercel login
```

### 3. Deploy

```bash
cd agenda-madrid
vercel
```

Responde las preguntas:
- ✅ Set up and deploy? → **Yes**
- ✅ Which scope? → Tu cuenta personal
- ✅ Link to existing project? → **No**
- ✅ What's your project's name? → **agenda-madrid**
- ✅ In which directory is your code? → **./**
- ✅ Want to override the settings? → **No**

### 4. Configurar variables de entorno

```bash
vercel env add ANTHROPIC_API_KEY
```

Pega tu API key de Claude cuando te lo pida.

### 5. Crear base de datos

1. Ve a https://vercel.com/tu-usuario/agenda-madrid
2. Click en **Storage**
3. Click en **Create Database**
4. Selecciona **Postgres**
5. Nombre: `agenda-madrid-db`
6. Click **Create**

### 6. Ejecutar SQL inicial

1. En Vercel dashboard → Storage → tu DB → **Query**
2. Copia y pega el contenido de `schema.sql`
3. Click **Run Query**

### 7. Actualizar código para Postgres

Edita estos archivos y descomenta las líneas de Postgres:

**api/process-email.js:**
```javascript
// Descomenta la función storeEvent() con SQL
```

**api/events.js:**
```javascript
// Descomenta la función getEvents() con SQL
```

**api/events/[id].js:**
```javascript
// Descomenta las funciones deleteEvent() y updateEvent() con SQL
```

### 8. Instalar dependencia de Postgres

```bash
npm install @vercel/postgres
```

### 9. Deploy a producción

```bash
vercel --prod
```

### 10. Configurar email (CloudMailin - la opción más fácil)

1. Ve a https://cloudmailin.com
2. Crea cuenta gratuita
3. Click **Create New Address**
4. Te dan un email como: `abc123@cloudmailin.net`
5. En **Target**:
   - URL: `https://tu-app.vercel.app/api/process-email`
   - Format: **JSON (Normalized)**
   - Method: **POST**

¡Ya está! Envía un email de prueba.

---

## URL de tu app

```
https://agenda-madrid.vercel.app
```

o el dominio personalizado que configures.

---

## Siguiente paso: Añadir a tu iPhone

1. Abre Safari en tu iPhone
2. Ve a tu URL de Vercel
3. Toca el botón "Compartir"
4. Selecciona "Añadir a pantalla de inicio"
5. Toca "Añadir"

---

## Comandos útiles

```bash
# Ver logs en tiempo real
vercel logs --follow

# Ver todas las deployments
vercel ls

# Rollback a deployment anterior
vercel rollback

# Ver variables de entorno
vercel env ls

# Abrir dashboard
vercel
```

---

## Solución de problemas

### La app no carga
```bash
vercel logs --follow
```
Busca errores en los logs.

### Los eventos no se guardan
1. Verifica que la DB esté creada
2. Revisa que las variables de entorno estén configuradas
3. Mira los logs de Vercel

### El email no funciona
1. Verifica la configuración de CloudMailin
2. Revisa los logs de CloudMailin
3. Prueba manualmente con Postman/curl:

```bash
curl -X POST https://tu-app.vercel.app/api/process-email \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Concierto de jazz el viernes 14 feb a las 21h en Café Central",
    "subject": "Evento",
    "from": "test@test.com"
  }'
```

---

## Personalizar dominio (opcional)

1. En Vercel dashboard → Settings → Domains
2. Añade tu dominio
3. Configura los DNS según te indique Vercel
4. Una vez verificado, actualiza CloudMailin con el nuevo dominio

---

## Monitorización

Vercel te avisa automáticamente si:
- El deploy falla
- Hay errores en producción
- El uso supera los límites gratuitos

Plan gratuito incluye:
- 100 GB de bandwidth
- 100 GB-Hrs de serverless functions
- 1 GB de Postgres storage
- SSL automático
- ¡Más que suficiente para uso personal!

---

¡Listo! 🎉

Si tienes problemas, revisa el [SETUP.md](./SETUP.md) completo.
