# 🎮 Poker Voting App - Integración Supabase

Has instalado el cliente de Supabase y estamos listos para conectar tu base de datos.

## 📋 Checklist de Configuración

### ✅ Paso 1: Base de Datos Supabase

- [ ] Crea un proyecto en [supabase.com](https://supabase.com)
- [ ] Ve a **SQL Editor > New Query**
- [ ] Copia TODO el contenido de `database-schema.sql` (este proyecto)
- [ ] Pega en Supabase y ejecuta (click en el botón ▶️)
- [ ] Verifica que se crearon las tablas: usuarios, cartas, sesiones, rondas, votos

### ✅ Paso 2: Credenciales

- [ ] En Supabase, ve a **Settings > API**
- [ ] Copia **Project URL** (ej: `https://abcd1234.supabase.co`)
- [ ] Copia **Anon Key** bajo "Project API Keys"

### ✅ Paso 3: Archivo .env

- [ ] Copia el contenido de `.env.example` a un nuevo archivo llamado `.env`
- [ ] Reemplaza los valores con tus credenciales de Supabase:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  ```

### ✅ Paso 4: Reiniciar Servidor

```bash
npm run dev
```

Abre la consola del navegador (F12). Si no ves errores de credenciales, ¡estás conectado! ✅

---

## 📦 Archivos Creados

| Archivo               | Propósito                           |
| --------------------- | ----------------------------------- |
| `src/lib/supabase.js` | Cliente Supabase + funciones de API |
| `database-schema.sql` | Script SQL para crear la BD         |
| `SUPABASE_SETUP.md`   | Guía detallada de configuración     |
| `.env.example`        | Template para variables de entorno  |

---

## 🔄 Próxima Fase: Migración de Lógica

Una vez que `.env` esté configurado, podemos:

### 1️⃣ Migrar Autenticación

**Archivo:** `src/pages/LoginPage.jsx`

Cambiar de:

```javascript
// Lógica local simulada
const account = AUTH_USERS.find(...)
```

A:

```javascript
import { signIn } from "@/lib/supabase";
const { user, error } = await signIn(email, password);
```

### 2️⃣ Migrar Sesiones (Polls)

**Archivo:** `src/App.jsx`

Cambiar de:

```javascript
const initialPolls = [...]  // Array local
```

A:

```javascript
import { getSesiones } from "@/lib/supabase";
const { data: sesiones } = await getSesiones("ACTIVA");
```

### 3️⃣ Integrar Votos Reales

**Archivo:** `src/pages/VotingSessionPage.jsx`

Usar:

```javascript
import { emitirVoto, usuarioYaVoto } from "@/lib/supabase";
```

### 4️⃣ Mostrar Resultados Reales

**Archivo:** `src/pages/ResultRevealedPage.jsx`

Usar:

```javascript
import { getVotosPorRonda } from "@/lib/supabase";
```

---

## 📊 Estructura de Base de Datos

```
usuarios (id, nombre, email, rol, creado_en)
  ├─ sesiones (id, nombre, estado, admin_id)
  │  ├─ sesion_participantes (sesion_id, usuario_id)
  │  └─ rondas (id, sesion_id, numero_ronda, carta_revelada)
  │     └─ votos (id, ronda_id, usuario_id, carta_id)
  └─ cartas (id, valor)
```

**Roles de Usuarios:**

- `ADMIN` - Puede crear sesiones, revelar resultados
- `PARTICIPANTE` - Puede votar en sesiones

**Estados de Sesión:**

- `ACTIVA` - En curso
- `CERRADA` - Finalizada
- `REINICIADA` - Restarted

---

## 🐛 Troubleshooting

### "Supabase credentials not configured"

→ Verifica que `.env` existe con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`  
→ Reinicia el servidor: `npm run dev`

### "Failed to sign in"

→ ¿El usuario existe en Supabase Authentication?  
→ ¿Email/Password habilitado en Settings > Providers?

### Errores en SQL

→ Ve a Supabase > Logs para ver detalles  
→ Ejecuta el SQL de nuevo en SQL Editor

---

## 🚀 Comandos Útiles

```bash
# Desarrollo con auto-reload
npm run dev

# Compilar para producción
npm run build

# Ver preview de producción
npm run preview

# Instalar dependencias nuevas
npm install @supabase/supabase-js
```

---

## 📖 Referencias

- [Documentación Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo usar la app sin Supabase?**  
R: Por ahora sí, con datos locales. Pero necesitarás Supabase para persistencia real.

**P: ¿Cómo agrego más usuarios?**  
R: En Supabase > Authentication > Users, o a través de signup en la app.

**P: ¿Puedo cambiar los roles después?**  
R: Sí, en la tabla `usuarios` en Supabase, actualiza la columna `rol`.

**P: ¿Dónde guardo datos sensibles?**  
R: Nunca en `.env`. Usa Supabase RLS (Row Level Security) para control fino.

---

🎯 **Siguiente paso:** Ejecuta el SQL en Supabase y configura el `.env`. ¡Luego me avisas para migrar la lógica! 🚀
