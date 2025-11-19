# MARKET DEL ESTE - Marketplace de Insumos y Servicios

Marketplace de Punta del Este para conectar solicitantes con proveedores de servicios e insumos.

## 📋 Estructura del Proyecto

Este es un monorepo que contiene:

- **`apps/web`**: Aplicación Web en React.js con Vite
- **`apps/mobile`**: Aplicación Mobile en React Native con Expo
- **`packages/core-logic`**: Lógica compartida (estado global, servicios, datos mock)

## 🚀 Instrucciones de Instalación y Ejecución

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Para mobile: Expo Go app instalada en tu dispositivo móvil

### Instalación

Desde la raíz del proyecto:

```bash
npm install
```

Esto instalará todas las dependencias de los workspaces (web, mobile, core-logic).

### Ejecutar Aplicación Web

```bash
npm run dev:web
```

La aplicación se abrirá en `http://localhost:5173`

### Ejecutar Aplicación Mobile

```bash
npm run start:mobile
```

O desde el directorio `apps/mobile`:

```bash
cd apps/mobile
npm start
```

Luego escanea el código QR con Expo Go (iOS) o la cámara (Android) para abrir la app en tu dispositivo.

## 👥 Usuarios Hardcodeados (Credenciales de Prueba)

El sistema incluye usuarios de prueba preconfigurados. Contraseña para todos: **123**

| Email | Contraseña | Rol |
|-------|------------|-----|
| `solicitante@mail.com` | `123` | Solicitante |
| `servicio@mail.com` | `123` | Proveedor de Servicio |
| `insumos@mail.com` | `123` | Proveedor de Insumos |
| `serviciosplus@mail.com` | `123` | Proveedor de Servicio |

En la aplicación web, puedes usar los botones de "Usuarios de Prueba" en el login para rellenar automáticamente las credenciales.

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

### Manejo de Estado Global

- **React Context API + useReducer**: Se utiliza `GlobalStateProvider` y `AppReducer` para gestionar el estado global de la aplicación
- **Lógica compartida**: El estado y la lógica de negocio están centralizados en `packages/core-logic` para ser reutilizado entre web y mobile
- **Acciones del reducer**: `ADD_SERVICE`, `ADD_QUOTE`, `ADD_SUPPLY_OFFER`, `MARK_SERVICE_IN_EVALUATION`, `UPDATE_SERVICE_STATUS`, `MARK_AS_COMPLETED`

### Datos Mock

- **Usuarios**: Definidos en `packages/core-logic/src/data/initialState.js`
- **Servicios**: Mock de servicios preconfigurados en `packages/core-logic/src/data/mockServices.js`
- **Ofertas de Insumos**: Mock de ofertas en `packages/core-logic/src/data/mockSupplyOffers.js`
- **LocalStorage**: El estado se persiste en localStorage (web) o polyfill en memoria (mobile)

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

### Estructura de Navegación

#### Web
- React Router DOM para navegación
- Rutas: `/`, `/login`, `/signup`, `/dashboard`, `/services`, `/services/:id`, `/create-service`, `/create-supply-offer`

#### Mobile
- React Navigation (Native Stack Navigator)
- Pantallas: LoginScreen, DashboardRouter, ServiceFormScreen, ServiceListScreen, ServiceDetailScreen, QuoteFormScreen, SupplyOfferFormScreen

### Monorepo y Workspaces

- **npm workspaces**: Organización del proyecto en workspaces (`apps/*`, `packages/*`)
- **Dependencias compartidas**: React y React-DOM instalados en el root para evitar duplicaciones
- **Resolución de módulos**: Metro Bundler (mobile) configurado para resolver módulos del workspace

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

```bash
# Desarrollo
npm run dev:web              # Inicia el servidor de desarrollo web
npm run start:mobile         # Inicia Expo para mobile

# Build
npm run build:web            # Compila la aplicación web para producción

# Linting
npm run lint:web             # Ejecuta ESLint en la app web
npm run lint                 # Ejecuta ESLint en todo el proyecto
```

## 🔍 Testing y Desarrollo

El proyecto incluye datos mock para facilitar el desarrollo y testing:
- Servicios preconfigurados con cotizaciones
- Usuarios con diferentes roles
- Ofertas de insumos de ejemplo

## 📝 Notas Adicionales

- El proyecto utiliza React 19.1.0 para ambas plataformas (web y mobile)
- Expo SDK ~54.0.25 para la aplicación mobile
- Vite 7.1.7 para el build tool de la aplicación web
- React Navigation 7.x para navegación en mobile

## 🐛 Problemas Conocidos

- El polyfill de localStorage en mobile es en memoria, por lo que los datos se pierden al cerrar la app
- Las validaciones de "stock suficiente" en packs de insumos no están implementadas (MVP simplificado)

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

---

**MARKET DEL ESTE** - Marketplace de Punta del Este
