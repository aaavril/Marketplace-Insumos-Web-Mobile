# MARKET DEL ESTE - Marketplace de Insumos y Servicios

Marketplace de Punta del Este para conectar solicitantes con proveedores de servicios e insumos.

## 📋 Estructura del Proyecto

Este es un monorepo que contiene:

- **`apps/web`**: Aplicación Web en React.js con Vite
- **`apps/mobile`**: Aplicación Mobile en React Native con Expo
- **`packages/core-logic`**: Lógica compartida (estado global, servicios, datos mock)

## 🚀 Instrucciones de Instalación y Ejecución

### Prerrequisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Para mobile**: Expo Go app instalada en tu dispositivo móvil (iOS/Android)
  - Descargar desde: [iOS App Store](https://apps.apple.com/app/expo-go/id982107779) o [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Instalación

Desde la raíz del proyecto:

```bash
npm install
```

Esto instalará todas las dependencias de los workspaces (web, mobile, core-logic).

### Ejecutar Aplicación Web

**Opción 1: Desde la raíz del proyecto**
```bash
npm run dev:web
```

**Opción 2: Desde el directorio de la app**
```bash
cd apps/web
npm run dev
```

La aplicación se abrirá automáticamente en `http://localhost:5173`

Si no se abre automáticamente, visita manualmente: `http://localhost:5173`

### Ejecutar Aplicación Mobile

**Opción 1: Desde la raíz del proyecto**
```bash
npm run start:mobile
```

**Opción 2: Desde el directorio de la app**
```bash
cd apps/mobile
npm start
```

**Pasos para usar la app mobile:**
1. El comando iniciará Expo Dev Server y mostrará un código QR
2. Abre la app **Expo Go** en tu dispositivo móvil
3. **iOS**: Escanea el código QR con la cámara del iPhone
4. **Android**: Escanea el código QR con la app Expo Go o la cámara
5. La app se cargará en tu dispositivo

**Comandos adicionales para mobile:**
```bash
npm run android:mobile    # Abre directamente en emulador Android (si está configurado)
npm run ios:mobile        # Abre directamente en simulador iOS (solo macOS)
```

## 👥 Usuarios Hardcodeados (Credenciales de Prueba)

El sistema incluye **4 usuarios de prueba preconfigurados**. La contraseña para todos es: **`123`**

Estos usuarios están definidos en `packages/core-logic/src/data/initialState.js` y se cargan automáticamente al iniciar la aplicación.

| Email | Contraseña | Rol | Nombre | Rating |
|-------|------------|-----|--------|--------|
| `solicitante@mail.com` | `123` | **Solicitante** | Alfonso Solicitante | - |
| `servicio@mail.com` | `123` | **Proveedor de Servicio** | Laura Proveedora | ⭐ 4.5 (2 valoraciones) |
| `insumos@mail.com` | `123` | **Proveedor de Insumos** | Pedro Insumos | - |
| `serviciosplus@mail.com` | `123` | **Proveedor de Servicio** | Mariana Servicios | ⭐ 4.0 (1 valoración) |

**Notas:**
- En la aplicación **web**, puedes usar los botones de "Usuarios de Prueba" en el login para rellenar automáticamente las credenciales.
- En la aplicación **mobile**, debes ingresar las credenciales manualmente.
- Estos usuarios se cargan desde el código (hardcoded) y no requieren registro previo.
- Puedes crear nuevos usuarios usando la página de Sign Up, pero deben estar guardados en localStorage para persistir.

## 🎯 Funcionalidades Principales

### Rol: Solicitante
- ✅ Login y redirección al dashboard correspondiente
- ✅ Crear servicios con formulario de publicación (incluye lista de insumos requeridos)
- ✅ Ver servicios publicados y su estado
- ✅ Comparar cotizaciones recibidas
- ✅ Seleccionar una cotización (cambia el estado a "Asignado")
- ✅ Marcar servicios como completados con valoración

### Rol: Proveedor de Servicio
- ✅ Login y redirección al dashboard correspondiente
- ✅ Ver servicios publicados disponibles para cotizar
- ✅ Enviar cotizaciones (precio, plazo/duration, deadline, notas) a servicios publicados
- ✅ Ver cotizaciones enviadas y estado de servicios gestionados

### Rol: Proveedor de Insumos
- ✅ Login y redirección al dashboard correspondiente
- ✅ Ver servicios publicados que requieren insumos
- ✅ Publicar packs de insumos (nombre, descripción, precio total, lista de items con cantidad y unidad)
- ✅ Ver ofertas de packs publicadas

## 🔄 Ciclo de Vida del Servicio

El sistema implementa las siguientes transiciones de estado:

1. **Publicado** → Servicio creado por Solicitante
2. **En Evaluación** → Solicitante abre el comparador de cotizaciones
3. **Asignado** → Solicitante selecciona una cotización
4. **Completado** → Solicitante marca el servicio como completado (con opcional valoración del proveedor)

## 🛠️ Decisiones Técnicas Clave

### 1. Manejo de Estado Global

**Decisión**: Usar **React Context API + useReducer** en lugar de Redux o Zustand.

**¿Por qué?**
- El proyecto es de tamaño medio, Context es suficiente
- No requiere librerías adicionales
- Más simple de entender y mantener
- Fácil de compartir entre web y mobile

**Implementación**:
- **Estado Global**: `packages/core-logic/src/context/GlobalStateContext.jsx`
- **Reducer**: `packages/core-logic/src/context/AppReducer.js`
- **Estado Inicial**: `packages/core-logic/src/data/initialState.js`

**Acciones disponibles**:
- `SET_CURRENT_USER` - Establece el usuario autenticado
- `LOGOUT` - Cierra la sesión
- `ADD_USER` - Agrega un nuevo usuario
- `ADD_SERVICE` - Agrega un nuevo servicio
- `ADD_QUOTE` - Agrega una cotización a un servicio
- `ADD_SUPPLY_OFFER` - Agrega una oferta de insumos
- `MARK_SERVICE_IN_EVALUATION` - Cambia estado a "En Evaluación"
- `UPDATE_SERVICE_STATUS` - Actualiza el estado de un servicio
- `MARK_AS_COMPLETED` - Marca un servicio como completado

**Uso en componentes**:
```jsx
import { useAppState } from '@core-logic/context/GlobalStateContext';

const MiComponente = () => {
  const { state, dispatch } = useAppState();
  // state.services, state.users, state.currentUser, etc.
  // dispatch({ type: 'ADD_SERVICE', payload: nuevoServicio })
};
```

### 2. Routing / Navegación

**Decisión**: 
- **Web**: React Router DOM v7
- **Mobile**: React Navigation v7 (Native Stack Navigator)

**¿Por qué diferentes?**
- **Web**: React Router es el estándar para SPAs web
- **Mobile**: React Navigation es el estándar para apps nativas React Native

**Implementación Web** (`apps/web/src/router/AppRouter.jsx`):
```jsx
// Rutas públicas (solo si NO estás autenticado)
/login  → LoginPage
/signup → SignUpPage

// Rutas protegidas (solo si estás autenticado)
/dashboard              → DashboardPage
/services               → ServicesListPage
/services/:id           → ServiceDetailPage
/services/create        → CreateServicePage
/supplies/create        → CreateSupplyOfferPage

// Ruta catch-all
/* → NotFoundPage (404)
```

**Implementación Mobile** (`apps/mobile/App.jsx`):
```jsx
// Pantallas principales
LoginScreen           → Login
DashboardRouter       → Dashboard según rol
ServiceFormScreen     → Crear servicio
ServiceListScreen     → Lista de servicios
ServiceDetailScreen   → Detalle y comparador
QuoteFormScreen       → Crear cotización
SupplyOfferFormScreen → Crear oferta de insumos
```

**Protección de rutas**:
- **Web**: Componente `ProtectedRoute` envuelve rutas privadas
- **Mobile**: Lógica condicional en el navigator según `currentUser`

### 3. Datos Mock (Cómo se Mockean los Datos)

**Decisión**: Usar datos hardcodeados en JavaScript en lugar de una base de datos real o API.

**¿Por qué?**
- MVP rápido sin necesidad de backend
- Desarrollo y testing más rápido
- Demostración funcional del flujo completo
- Fácil de entender para el equipo

**Ubicación de datos mock**:
```
packages/core-logic/src/data/
├── initialState.js       # Estado inicial + MOCK_USERS
├── mockServices.js       # Servicios de ejemplo
└── mockSupplyOffers.js   # Ofertas de insumos de ejemplo
```

**Usuarios Mock** (`initialState.js`):
```javascript
export const MOCK_USERS = [
  { 
    id: 'u1', 
    name: 'Alfonso Solicitante', 
    email: 'solicitante@mail.com', 
    password: '123', 
    role: 'Solicitante'
  },
  // ... más usuarios
];
```

**Servicios Mock** (`mockServices.js`):
- Servicios preconfigurados con diferentes estados
- Incluyen cotizaciones de ejemplo
- Diferentes categorías y ubicaciones

**Ofertas de Insumos Mock** (`mockSupplyOffers.js`):
- Packs de insumos de ejemplo
- Diferentes precios y items

**Persistencia**:
- **Web**: `localStorage` guarda el estado (usuarios, servicios creados)
- **Mobile**: Polyfill de `localStorage` en memoria (se pierde al cerrar la app)

**Carga inicial**:
```javascript
// El estado inicial incluye los mocks
export const initialState = {
  services: MOCK_SERVICES,    // Servicios mock
  users: MOCK_USERS,          // Usuarios mock
  currentUser: null,          // Usuario autenticado
  quotes: [],                 // Cotizaciones
  supplyOffers: MOCK_SUPPLY_OFFERS  // Ofertas mock
};
```

### Validaciones Implementadas

#### Formulario de Servicio (Solicitante)
- ✅ Campos obligatorios: título, descripción, ubicación, fecha
- ✅ Filtrado de insumos vacíos (solo se guardan insumos con nombre)

#### Formulario de Cotización (Proveedor de Servicio)
- ✅ Precio válido mayor a cero
- ✅ Duración en días válida mayor a cero
- ✅ Deadline/plazo estimado requerido

#### Formulario de Oferta de Insumos (Proveedor de Insumos)
- ✅ Título/pack name requerido
- ✅ Precio total válido mayor a cero
- ✅ Al menos un insumo con nombre válido requerido

### Autenticación

- **Login hardcodeado**: No hay backend real, se valida contra usuarios mock
- **Servicio de autenticación**: `packages/core-logic/src/services/AuthService.js`
- **Contexto de autenticación**: `packages/core-logic/src/context/AuthContext.js` (web)
- **Redirección automática**: Después de login exitoso, redirige al dashboard según el rol

### 4. Arquitectura Monorepo

**Decisión**: Usar **npm workspaces** para organizar el proyecto en un monorepo.

**¿Por qué?**
- **Código compartido**: La lógica de negocio está en `packages/core-logic` y se usa tanto en web como mobile
- **Sin duplicación**: Si cambias la lógica de autenticación, se actualiza automáticamente en ambas plataformas
- **Un solo `npm install`**: Instala todas las dependencias de todos los workspaces
- **Mantenibilidad**: Un solo lugar para corregir bugs

**Estructura**:
```
Marketplace-Insumos-Web-Mobile/
├── apps/
│   ├── web/          # Aplicación React Web (Vite)
│   └── mobile/       # Aplicación React Native (Expo)
├── packages/
│   └── core-logic/   # Lógica compartida (Context, Services, Data)
└── package.json      # Configuración del workspace raíz
```

**Dependencias compartidas**:
- React 19.1.0 instalado en el root para evitar duplicaciones
- `packages/core-logic` no tiene dependencias propias, solo las del root

**Resolución de módulos**:
- **Web**: Configurado en `apps/web/vite.config.js` con alias `@core-logic`
- **Mobile**: Configurado en `apps/mobile/metro.config.js` para resolver módulos del workspace

### 5. Build Tools

**Decisión**:
- **Web**: Vite 7.1.7
- **Mobile**: Expo (Metro Bundler)

**¿Por qué Vite y no Create React App o Webpack?**
- Más rápido en desarrollo (HMR instantáneo)
- Build más rápido
- Configuración más simple
- Mejor experiencia de desarrollo

**¿Por qué Expo y no React Native CLI?**
- No requiere configurar Android Studio/Xcode
- Desarrollo más rápido
- Hot reload automático
- Fácil de probar en dispositivos físicos

### Monorepo y Workspaces - Detalles

- **npm workspaces**: Organización del proyecto en workspaces (`apps/*`, `packages/*`)
- **Dependencias compartidas**: React y React-DOM instalados en el root para evitar duplicaciones
- **Resolución de módulos**: 
  - Metro Bundler (mobile) configurado para resolver módulos del workspace
  - Vite (web) configurado con alias para importar desde `@core-logic`

## 📱 Pantallas Implementadas

### Web
- ✅ Landing Page
- ✅ Login Page (con usuarios de prueba)
- ✅ Sign Up Page
- ✅ Dashboard (según rol: Solicitante, Proveedor de Servicio, Proveedor de Insumos)
- ✅ Listado de Servicios
- ✅ Detalle de Servicio (con comparador de cotizaciones)
- ✅ Formulario de Crear Servicio
- ✅ Formulario de Crear Oferta de Insumos

### Mobile
- ✅ Login Screen
- ✅ Dashboard Router (Solicitante, Proveedor de Servicio, Proveedor de Insumos)
- ✅ Service Form Screen
- ✅ Service List Screen
- ✅ Service Detail Screen (con comparador de cotizaciones)
- ✅ Quote Form Screen
- ✅ Supply Offer Form Screen

## 🎨 Estilos y UI

- **Web**: CSS modules y clases CSS personalizadas
- **Mobile**: React Native StyleSheet con diseño adaptativo para iOS y Android
- **Componentes reutilizables**: Cards, botones, formularios compartidos entre roles

## 📦 Scripts Disponibles

### Desde la Raíz del Proyecto

```bash
# Desarrollo
npm run dev:web              # Inicia el servidor de desarrollo web (Vite)
npm run start:mobile         # Inicia Expo para mobile
npm run android:mobile       # Inicia Expo y abre en emulador Android
npm run ios:mobile           # Inicia Expo y abre en simulador iOS (solo macOS)

# Build
npm run build:web            # Compila la aplicación web para producción
npm run preview:web          # Previsualiza el build de producción

# Linting
npm run lint:web             # Ejecuta ESLint en la app web
npm run lint                 # Ejecuta ESLint en todo el proyecto

# Instalación
npm install                  # Instala todas las dependencias de todos los workspaces
npm run install:all          # Alias de npm install
```

### Desde los Directorios Individuales

**Web** (`apps/web/`):
```bash
cd apps/web
npm run dev      # Desarrollo
npm run build    # Build
npm run preview  # Preview del build
npm run lint     # Lint
```

**Mobile** (`apps/mobile/`):
```bash
cd apps/mobile
npm start        # Inicia Expo
npm run android  # Android
npm run ios      # iOS
npm run web      # Web (opcional)
npm run lint     # Lint
```

## 🔍 Testing y Desarrollo

El proyecto incluye datos mock para facilitar el desarrollo y testing:
- Servicios preconfigurados con cotizaciones
- Usuarios con diferentes roles
- Ofertas de insumos de ejemplo

## 🎬 Demo del Flujo Principal

### Flujo: Publicar Servicio → Recibir Cotización → Comparar → Seleccionar

Este flujo demuestra el ciclo completo del marketplace:

#### 1. **Publicar Servicio** (Rol: Solicitante)
1. Inicia sesión como `solicitante@mail.com` / `123`
2. Ve al dashboard de Solicitante
3. Haz clic en "Crear Nuevo Servicio"
4. Completa el formulario:
   - Título: "Limpieza de piscina"
   - Descripción: "Necesito limpiar mi piscina antes del verano"
   - Categoría: "Piscinas"
   - Ubicación: "Punta del Este"
   - Fecha: Selecciona una fecha
   - (Opcional) Agrega insumos requeridos
5. Haz clic en "Publicar Servicio"
6. El servicio aparece en tu dashboard con estado "Publicado"

#### 2. **Recibir Cotización** (Rol: Proveedor de Servicio)
1. Cierra sesión e inicia sesión como `servicio@mail.com` / `123`
2. Ve al dashboard de Proveedor de Servicio
3. Haz clic en "Ver Servicios Disponibles"
4. Encuentra el servicio "Limpieza de piscina"
5. Haz clic en "Ver detalle y cotizar"
6. Completa el formulario de cotización:
   - Precio: $5000
   - Duración en días: 3
   - Plazo estimado: Selecciona una fecha
   - Notas: "Incluye productos químicos"
7. Haz clic en "Enviar Cotización"
8. El servicio ahora tiene 1 cotización

#### 3. **Comparar Cotizaciones** (Rol: Solicitante)
1. Vuelve a iniciar sesión como `solicitante@mail.com` / `123`
2. En tu dashboard, encuentra el servicio "Limpieza de piscina"
3. Haz clic en "Comparar Cotizaciones" o "Ver Detalle"
4. Se abre el comparador de cotizaciones mostrando:
   - Lista de todas las cotizaciones recibidas
   - Precio, duración, plazo, proveedor
   - El estado del servicio cambia a "En Evaluación"

#### 4. **Seleccionar Cotización** (Rol: Solicitante)
1. En el comparador, revisa las cotizaciones
2. Selecciona la cotización que prefieras (ej: la de Laura Proveedora)
3. Haz clic en "Seleccionar esta Cotización"
4. El estado del servicio cambia a "Asignado"
5. La cotización seleccionada queda marcada en el servicio

#### 5. **Completar Servicio** (Opcional - Rol: Solicitante)
1. Una vez completado el trabajo, en el detalle del servicio
2. Haz clic en "Marcar como Completado"
3. Opcionalmente, valora al proveedor (1-5 estrellas)
4. El estado cambia a "Completado"
5. El rating del proveedor se actualiza

### 📹 Videos / GIFs del Demo

> **Nota**: Agrega aquí capturas de pantalla, GIFs o videos cortos mostrando:
> - Login con diferentes usuarios
> - Publicar un servicio
> - Recibir una cotización
> - Comparar cotizaciones
> - Seleccionar una cotización
> - Completar un servicio

**Ejemplo de estructura para agregar**:
```markdown
### Demo Visual

#### 1. Publicar Servicio
![Publicar Servicio](demo/publicar-servicio.gif)

#### 2. Recibir Cotización
![Recibir Cotización](demo/recibir-cotizacion.gif)

#### 3. Comparar y Seleccionar
![Comparar y Seleccionar](demo/comparar-seleccionar.gif)
```

## 📝 Notas Adicionales

- El proyecto utiliza **React 19.1.0** para ambas plataformas (web y mobile)
- **Expo SDK ~54.0.25** para la aplicación mobile
- **Vite 7.1.7** para el build tool de la aplicación web
- **React Navigation 7.x** para navegación en mobile
- **React Router DOM 7.x** para navegación en web

## 🐛 Problemas Conocidos

- El polyfill de localStorage en mobile es en memoria, por lo que los datos se pierden al cerrar la app
- Las validaciones de "stock suficiente" en packs de insumos no están implementadas (MVP simplificado)

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

---

**MARKET DEL ESTE** - Marketplace de Punta del Este
