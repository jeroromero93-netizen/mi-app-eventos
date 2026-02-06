# 📧 Agenda Cultural Madrid

Una PWA que centraliza todos los eventos culturales de Madrid que te interesan.

## ✨ Características

- 📧 **Envía eventos por email** (screenshots, newsletters, links)
- 🤖 **IA extrae la información** automáticamente con Claude
- 📱 **Funciona como app** en iPhone/Android
- 🔔 **Notificaciones** antes de cada evento
- 🎨 **Categorías**: Cine, teatro, música, charlas, fiestas, exposiciones...

## 🚀 Instalación rápida

```bash
npm install
npm run dev
```

Para producción, sigue la guía completa en [SETUP.md](./SETUP.md)

## 🎯 Cómo funciona

1. **Ves un evento** que te interesa (Instagram, newsletter, web...)
2. **Envías un email** a tu dirección configurada con:
   - Screenshot de Instagram
   - Reenvío de newsletter
   - Link del evento
   - Texto con la info
3. **Claude procesa** el contenido y extrae:
   - Título
   - Fecha y hora
   - Lugar
   - Descripción
   - Categoría
4. **Aparece en tu agenda** automáticamente

## 📦 Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel Postgres
- **IA**: Claude API (Anthropic)
- **Email**: SendGrid Inbound Parse / CloudMailin
- **PWA**: Service Worker + Manifest

## 🔧 Configuración

Necesitas:

1. Cuenta en Vercel (gratis)
2. API Key de Anthropic (Claude)
3. SendGrid o CloudMailin para recibir emails
4. (Opcional) Dominio propio

Ver guía completa en [SETUP.md](./SETUP.md)

## 📱 Instalación en iPhone

1. Abre la app en Safari
2. Toca el botón "Compartir"
3. Selecciona "Añadir a pantalla de inicio"
4. ¡Listo!

## 🎨 Personalizar

Cambia colores en `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#9333ea', // Cambia este color
    }
  }
}
```

## 📝 Variables de entorno

```env
ANTHROPIC_API_KEY=tu_api_key
POSTGRES_URL=tu_postgres_url
```

## 🤝 Contribuir

Ideas para mejorar:

- Scraping automático de sitios culturales
- Integración con Google Calendar
- Modo oscuro
- Compartir eventos con amigos
- Estadísticas de asistencia

## 📄 Licencia

MIT - Usa y modifica como quieras

---

Hecho con ❤️ para no perderte nunca más un evento cultural en Madrid
