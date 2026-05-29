# Guía de Integración Supabase 🔗

Esta guía te ayudará a conectar la aplicación Poker Voting con Supabase.

## Paso 1: Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Copia tu URL y Anon Key (los encontrarás en Settings > API)

## Paso 2: Configurar Base de Datos

### 2.1 Ejecutar SQL en Supabase

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor** (lado izquierdo)
3. Haz clic en **"New Query"**
4. Copia y pega **TODO** el contenido del archivo `database-schema.sql` que está en la raíz del proyecto
5. Haz clic en **"Run"** ▶️

**⚠️ IMPORTANTE:** Debes ejecutar TODO el SQL de una sola vez. Incluye:

- DROP statements (para limpiar)
- CREATE TYPE (roles y estados)
- CREATE TABLE (todas las tablas)
- INSERT INTO (datos iniciales de cartas)
- TRIGGER y FUNCTION (para crear perfiles automáticos)

### 2.2 Verificar que se crearon correctamente

Ve a **Table Editor** y verifica que existan estas tablas:

- ✓ usuarios
- ✓ cartas
- ✓ sesiones
- ✓ sesion_participantes
- ✓ rondas
- ✓ votos

## Paso 3: Configurar Autenticación

1. En Supabase, ve a **Authentication > Settings**
2. Habilita **Email/Password** bajo Providers
3. Copia tu **Anon Key** (Settings > API > Project API Keys)

## Paso 4: Configurar Variables de Entorno

1. Crea un archivo `.env` en la raíz del proyecto (mismo nivel que `package.json`)
2. Agrega estas líneas:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Dónde obtener estos valores:**

- **VITE_SUPABASE_URL**: En Supabase, Settings > API > Project URL
- **VITE_SUPABASE_ANON_KEY**: En Supabase, Settings > API > Project API Keys > `anon` key

### Ejemplo de .env:

```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 5: Reiniciar el servidor

```bash
npm run dev
```

Luego reinicia VS Code o el servidor de desarrollo.

## Paso 6: Probar la conexión

1. Abre la app en `http://localhost:5173`
2. Abre la consola del navegador (F12)
3. Si NO ves errores sobre credenciales de Supabase, ¡la conexión está lista! ✅

## Información del Esquema de Base de Datos

### Usuarios

- Creados automáticamente al registrarse en Supabase
- Roles: **ADMIN** o **PARTICIPANTE**
- El TRIGGER `on_auth_user_created` crea el perfil automáticamente

### Sesiones

- Representan las rondas de poker voting
- Estados: **ACTIVA**, **CERRADA**, **REINICIADA**
- Cada sesión tiene un admin

### Rondas

- Son las votaciones dentro de una sesión
- Cuando `carta_revelada = true`, se muestran los resultados

### Votos

- Registro de cada voto emitido
- Constraint: Un usuario no puede votar dos veces en la misma ronda

### Cartas

- Valores predefinidos: 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕

## Troubleshooting

### Error: "Supabase credentials not configured"

- Verifica que el archivo `.env` existe y está en la raíz del proyecto
- Asegúrate de que las variables se llaman exactamente:
  - `VITE_SUPABASE_URL` (no `SUPABASE_URL`)
  - `VITE_SUPABASE_ANON_KEY` (no `SUPABASE_ANON_KEY`)
- Reinicia el servidor: `npm run dev`

### Error: "Failed to sign in"

- Verifica que el usuario existe en Supabase Authentication
- Comprueba que Email/Password está habilitado en Authentication > Settings

### Error en la BD

- Ve a Supabase > Logs para ver los errores exactos
- Verifica que todas las tablas se crearon correctamente
- Ejecuta de nuevo el SQL si algo falta

## Funciones Disponibles en `src/lib/supabase.js`

```javascript
// Autenticación
import { signUp, signIn, signOut, getCurrentUser } from "@/lib/supabase";

// Sesiones (encuestas)
import { getSesiones, createSesion, updateSesionEstado } from "@/lib/supabase";

// Rondas
import { getRondas, createRonda, revelarRonda } from "@/lib/supabase";

// Votos
import { emitirVoto, getVotosPorRonda, usuarioYaVoto } from "@/lib/supabase";

// Participantes
import { agregarParticipante, obtenerParticipantes } from "@/lib/supabase";

// Cartas
import { obtenerCartas } from "@/lib/supabase";

// Usuarios
import { obtenerUsuario, actualizarUsuario } from "@/lib/supabase";
```

## Próximos Pasos

Una vez que la conexión esté confirmada:

1. Migrar la lógica de autenticación en `LoginPage.jsx` a usar `signIn` de Supabase
2. Migrar los datos de `polls` en `App.jsx` a obtenerlos de `sesiones`
3. Integrar los votos reales de la BD en `VotingSessionPage.jsx`
4. Mostrar resultados reales en `ResultRevealedPage.jsx`

¿Necesitas ayuda con alguno de estos pasos? 🚀
