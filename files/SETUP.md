# 📧 Agenda Cultural Madrid - Guía de Instalación

## 🎯 Qué hace esta app

Una PWA que funciona como app en tu iPhone donde:
- **Envías emails** con info de eventos (screenshots de IG, newsletters, links, etc.)
- **La IA extrae** automáticamente toda la información (fecha, hora, lugar, descripción)
- **Se añade** a tu agenda personal
- **Recibes notificaciones** antes de cada evento

---

## 📋 Requisitos previos

1. **Cuenta en Vercel** (gratis): https://vercel.com
2. **Cuenta en SendGrid** (gratis hasta 100 emails/día): https://sendgrid.com
3. **API Key de Anthropic** (para Claude): https://console.anthropic.com

---

## 🚀 Instalación paso a paso

### 1. Clonar y preparar el proyecto

```bash
cd agenda-madrid
npm install
```

### 2. Configurar Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login

# Deploy inicial
vercel
```

Sigue las instrucciones:
- ✅ Set up and deploy? → Yes
- ✅ Which scope? → Tu cuenta
- ✅ Link to existing project? → No
- ✅ What's your project's name? → agenda-madrid
- ✅ In which directory is your code located? → ./
- ✅ Want to override settings? → No

### 3. Configurar variables de entorno

En el dashboard de Vercel (https://vercel.com/tu-usuario/agenda-madrid):

1. Ve a **Settings** → **Environment Variables**
2. Añade:
   - `ANTHROPIC_API_KEY` = tu_api_key_de_claude

### 4. Configurar base de datos (Vercel Postgres - GRATIS)

En el dashboard de Vercel:

1. Ve a **Storage** → **Create Database**
2. Selecciona **Postgres**
3. Nombre: `agenda-madrid-db`
4. Región: Elige la más cercana a Madrid (Frankfurt)
5. Click **Create**

Vercel creará automáticamente estas variables de entorno:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

6. Ve a la pestaña **Query** y ejecuta:

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  venue TEXT,
  description TEXT,
  category TEXT,
  url TEXT,
  status TEXT DEFAULT 'interested',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(date);
```

### 5. Actualizar el código para usar Postgres

Edita `/api/process-email.js` y descomenta las líneas de Postgres:

```javascript
// En la función storeEvent(), descomenta:
async function storeEvent(event) {
  const { sql } = await import('@vercel/postgres');
  await sql`
    INSERT INTO events (id, title, date, time, venue, description, category, url, status, created_at)
    VALUES (${event.id}, ${event.title}, ${event.date}, ${event.time}, ${event.venue}, 
            ${event.description}, ${event.category}, ${event.url}, ${event.status}, ${event.createdAt})
  `;
  return event;
}
```

Edita `/api/events.js`:

```javascript
async function getEvents() {
  const { sql } = await import('@vercel/postgres');
  const result = await sql`SELECT * FROM events ORDER BY date ASC`;
  return result.rows;
}
```

Edita `/api/events/[id].js`:

```javascript
async function deleteEvent(id) {
  const { sql } = await import('@vercel/postgres');
  await sql`DELETE FROM events WHERE id = ${id}`;
}

async function updateEvent(id, updates) {
  const { sql } = await import('@vercel/postgres');
  if (updates.status) {
    await sql`UPDATE events SET status = ${updates.status} WHERE id = ${id}`;
  }
}
```

Añade la dependencia:

```bash
npm install @vercel/postgres
```

Deploy de nuevo:

```bash
vercel --prod
```

### 6. Configurar SendGrid para recibir emails

#### 6.1. Crear cuenta y verificar dominio

1. Ve a https://sendgrid.com y crea una cuenta gratuita
2. **IMPORTANTE**: Por ahora, SendGrid requiere un dominio propio para Inbound Parse
   
   **Alternativa temporal sin dominio:**
   - Usa https://www.cloudmailin.com (tiene plan gratuito)
   - O espera a tener un dominio y usa SendGrid

#### 6.2. Configurar Inbound Parse (con dominio)

1. En SendGrid, ve a **Settings** → **Inbound Parse**
2. Click **Add Host & URL**
3. Configuración:
   - **Subdomain**: `eventos` (quedará como eventos.tudominio.com)
   - **Domain**: Tu dominio verificado
   - **Destination URL**: `https://tu-app.vercel.app/api/process-email`
   - **Check spam**: ✅ Activado
   - **POST raw**: ✅ Activado

4. Guarda y SendGrid te dará los registros MX para añadir a tu DNS

#### 6.3. Configurar DNS

En tu proveedor de dominio (GoDaddy, Namecheap, etc.):

1. Añade estos registros MX para `eventos.tudominio.com`:
   ```
   MX   eventos   mx.sendgrid.net   10
   ```

2. Espera 10-30 minutos para que se propague

#### 6.4. ALTERNATIVA: Usar CloudMailin (sin dominio propio)

1. Ve a https://www.cloudmailin.com
2. Crea cuenta gratuita
3. Click en **Create Address**
4. Te dan un email como: `abc123@cloudmailin.net`
5. Configura:
   - **Target URL**: `https://tu-app.vercel.app/api/process-email`
   - **Format**: JSON
   - **Method**: POST

¡Listo! Ya tienes tu email para añadir eventos.

### 7. Probar que funciona

Envía un email de prueba a tu dirección (eventos@tudominio.com o la de CloudMailin):

```
Asunto: Concierto de jazz

Hola,

Vi este evento que me interesa:

Concierto de Jazz en Café Central
Viernes 14 de febrero a las 21:00
Plaza del Ángel, 10, Madrid

Más info: https://cafecentralmadrid.com
```

En 1-2 minutos debería aparecer en tu app 🎉

### 8. Añadir la app a tu iPhone

1. Abre Safari y ve a `https://tu-app.vercel.app`
2. Click en el botón "Compartir" (el cuadrado con flecha hacia arriba)
3. Scroll y selecciona **"Añadir a pantalla de inicio"**
4. Cambia el nombre si quieres → **"Añadir"**

¡Ya tienes tu app! Se abrirá como una app nativa.

---

## 🎨 Personalización

### Cambiar colores

Edita `tailwind.config.js` y cambia los colores purple por los que quieras:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#tu-color-hex',
    }
  }
}
```

### Añadir más categorías

En `/src/App.jsx`, busca las categorías y añade las que quieras:

```javascript
const categories = [
  'cine', 'teatro', 'música', 'charla', 
  'fiesta', 'exposición', 'mercadillo', 'deportes'
];
```

---

## 🔧 Mantenimiento

### Ver logs
```bash
vercel logs
```

### Ver base de datos
En Vercel dashboard → Storage → tu database → Query

### Hacer backup de eventos
```sql
SELECT * FROM events;
```

---

## 💡 Trucos de uso

### Screenshots de Instagram

1. Haz screenshot de la historia/post
2. Abre tu email
3. Adjunta el screenshot
4. Envía a tu email de eventos
5. ¡La IA lo procesa automáticamente!

### Newsletters

Reenvía directamente el newsletter a tu email de eventos.

### Links de eventos

Copia el link, pégalo en un email y envía.

---

## 🐛 Problemas comunes

### Los eventos no aparecen

1. Revisa los logs: `vercel logs --follow`
2. Verifica que las variables de entorno estén configuradas
3. Prueba la API directamente: `https://tu-app.vercel.app/api/events`

### El email no llega

1. Verifica la configuración de SendGrid/CloudMailin
2. Revisa los webhooks logs en SendGrid/CloudMailin
3. Comprueba que la URL de webhook sea correcta

### La IA no extrae bien los datos

Puedes mejorar el prompt en `/api/process-email.js` donde dice:

```javascript
const prompt = `Eres un asistente que extrae información...`
```

---

## 📈 Próximos pasos (ideas para mejorar)

- [ ] Añadir scraping automático de Time Out Madrid, Fever, etc.
- [ ] Notificaciones push reales (con Web Push API)
- [ ] Compartir eventos con amigos
- [ ] Modo oscuro
- [ ] Estadísticas de asistencia
- [ ] Integración con Google Calendar
- [ ] Sugerencias de eventos basadas en tus gustos

---

## 🆘 Ayuda

Si algo no funciona, revisa:
1. Los logs de Vercel
2. La consola del navegador (F12)
3. Los logs de SendGrid/CloudMailin

---

¡Disfruta de la cultura madrileña! 🎭🎨🎵
