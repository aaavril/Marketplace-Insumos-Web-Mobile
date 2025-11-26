# 📚 Documentación Técnica - MARKET DEL ESTE

## Marketplace de Insumos y Servicios - Guía Completa

---

## 📋 Índice

1. [Visión General del Proyecto](#visión-general-del-proyecto)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Inicialización del Proyecto](#inicialización-del-proyecto)
5. [Bundling y Build: ¿Qué son "index.js" y "bundled render.js"?](#bundling-y-build-qué-son-indexjs-y-bundled-renderjs)
6. [Servidores y Entorno de Desarrollo](#servidores-y-entorno-de-desarrollo)
7. [Tecnologías Utilizadas](#tecnologías-utilizadas)
8. [Conceptos Fundamentales de JavaScript y React](#conceptos-fundamentales-de-javascript-y-react)
9. [Ciclo de Vida de Componentes](#ciclo-de-vida-de-componentes)
10. [Hooks: useState y useEffect](#hooks-usestate-y-useeffect)
11. [React Context](#react-context)
12. [Props: Comunicación entre Componentes](#props-comunicación-entre-componentes)
13. [Proceso de Autenticación](#proceso-de-autenticación)
14. [Manejo de Rutas: Web y Mobile](#manejo-de-rutas-web-y-mobile)
15. [Flujo de Datos en la Aplicación](#flujo-de-datos-en-la-aplicación)
16. [Persistencia de Cotizaciones y Datos Clave](#persistencia-de-cotizaciones-y-datos-clave)
17. [Retos y Lecciones del Desarrollo](#retos-y-lecciones-del-desarrollo)
18. [Componente Destacado: QuoteComparator](#componente-destacado-quotecomparator)
19. [Checklist de Conceptos Solicitados](#checklist-de-conceptos-solicitados)

---

## 🎯 Visión General del Proyecto

**MARKET DEL ESTE** es un marketplace que conecta tres tipos de usuarios:

- **Solicitantes**: Publican servicios que necesitan (ej: "Necesito limpiar mi piscina")
- **Proveedores de Servicio**: Ofrecen cotizaciones para los servicios publicados
- **Proveedores de Insumos**: Publican packs de insumos que pueden ser requeridos por los servicios

### Características Principales:
- Sistema de autenticación por roles
- Publicación de servicios con insumos requeridos
- Sistema de cotizaciones
- Comparador de cotizaciones
- Gestión de estado global compartido entre Web y Mobile

---

## 🏗️ Arquitectura del Proyecto

### ¿Por qué esta arquitectura?

El proyecto utiliza una **arquitectura de Monorepo** con **npm workspaces**. Esta decisión tiene varias ventajas:

#### 1. **Código Compartido (DRY - Don't Repeat Yourself)**
- La lógica de negocio, estado global, y servicios están en `packages/core-logic`
- Tanto la app web como mobile comparten el mismo código de autenticación, estado, y servicios
- Si cambias la lógica de autenticación, se actualiza automáticamente en ambas plataformas

#### 2. **Mantenibilidad**
- Un solo lugar para corregir bugs
- Cambios sincronizados entre plataformas
- Facilita el testing de la lógica compartida

#### 3. **Escalabilidad**
- Fácil agregar nuevas apps (ej: admin panel, API server)
- Dependencias gestionadas centralmente
- Scripts de build unificados

#### 4. **Desarrollo Eficiente**
- Un solo `npm install` instala todo
- Hot reload compartido
- Linting y testing unificados

### Estructura del Monorepo:

```
Marketplace-Insumos-Web-Mobile/
├── apps/
│   ├── web/          # Aplicación React Web (Vite)
│   └── mobile/       # Aplicación React Native (Expo)
├── packages/
│   └── core-logic/   # Lógica compartida (Context, Services, Data)
└── package.json      # Configuración del workspace raíz
```

---

## 🔍 Autocrítica Técnica: Arquitectura del Monorepo

### Problema Identificado: Monorepo con Core-Logic Compartido

**Aunque esta arquitectura funciona para desarrollo, presenta problemas técnicos importantes para producción y deploy:**

### ¿Por qué NO es ideal esta arquitectura?

#### 1. **Deploy Separado y Dependencias del Workspace**

**Problema:**
- **Web** se despliega en un servidor (Vercel, Netlify, etc.) → necesita `packages/core-logic`
- **Mobile** se compila como app nativa (iOS/Android) → necesita `packages/core-logic`
- Ambos tienen **deploys completamente independientes** y en **momentos diferentes**

**¿Qué pasa en producción?**
```bash
# Para deployar Web:
cd apps/web
npm run build  # ❌ Falla porque busca packages/core-logic que no existe en el servidor

# Para deployar Mobile:
expo build  # ❌ Falla porque busca packages/core-logic que no existe en el build server
```

**Solución actual (problemática):**
- Necesitas configurar el bundler (Vite/Metro) para resolver `packages/core-logic`
- Esto funciona en desarrollo pero es frágil en producción
- Requiere configuración compleja en cada plataforma

#### 2. **Dependencias del Monorepo en Producción**

**Problema Técnico:**
- En desarrollo, `packages/core-logic` existe como carpeta local
- En producción, cada app se despliega **independientemente**
- El servidor de deploy **no tiene acceso** a `packages/core-logic`

**Ejemplo Real:**
```jsx
// apps/web/src/components/Login.jsx
import { useAuth } from '@core-logic/context/AuthContext';
// ↑ En desarrollo: funciona (Vite resuelve el alias)
// ↑ En producción: ❌ Falla (el servidor no tiene packages/core-logic)
```

**Configuración Necesaria (compleja):**
```js
// vite.config.js - Configuración para resolver core-logic
resolve: {
  alias: {
    '@core-logic': path.resolve(__dirname, '../../packages/core-logic/src')
  }
}
```

#### 3. **Build y Bundle Independientes**

**Problema:**
- **Web** genera un bundle estático (HTML, CSS, JS) → se sirve desde un CDN
- **Mobile** genera un bundle nativo (APK/IPA) → se distribuye en App Store/Play Store
- **No comparten el mismo proceso de build**
- **No comparten el mismo runtime**

**Consecuencia:**
- El código de `packages/core-logic` debe estar **incluido en cada bundle**
- Cada app lleva una **copia del código compartido** en su bundle final
- No hay verdadero "compartir" en producción, solo en desarrollo

#### 4. **Lo que DEBERÍA estar copiado (mínimo necesario)**

**En lugar de compartir todo `packages/core-logic`, solo debería compartirse:**

✅ **Lo que SÍ debería estar copiado (mínimo):**
- **Tipos/Interfaces** (si usas TypeScript)
- **Constantes** (valores fijos)
- **Utilidades puras** (funciones sin dependencias de React)
- **Validaciones** (reglas de negocio)

❌ **Lo que NO debería compartirse:**
- **Context API** (cada app tiene su propio árbol de componentes)
- **Hooks personalizados** (dependen del contexto de cada app)
- **Componentes** (UI diferente en web vs mobile)

**Ejemplo de lo que DEBERÍA estar copiado:**
```javascript
// ✅ CORRECTO: Utilidad pura (sin dependencias)
// packages/shared-utils/src/validations.js
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ✅ CORRECTO: Constantes
// packages/shared-utils/src/constants.js
export const USER_ROLES = {
  SOLICITANTE: 'Solicitante',
  PROVEEDOR_SERVICIO: 'Proveedor de Servicio',
  PROVEEDOR_INSUMOS: 'Proveedor de Insumos'
};
```

**Ejemplo de lo que NO debería compartirse:**
```javascript
// ❌ INCORRECTO: Context depende del árbol de componentes de cada app
// packages/core-logic/src/context/GlobalStateContext.jsx
export const GlobalStateProvider = ({ children }) => {
  // Este Provider debe estar en cada app, no compartido
};
```

### Arquitectura Alternativa Recomendada

#### **Opción 1: Código Duplicado Mínimo (Recomendado para este caso)**

**Estructura:**
```
Marketplace-Insumos-Web-Mobile/
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── context/     # Context específico de web
│   │       ├── services/    # Servicios específicos de web
│   │       └── utils/       # Utilidades compartidas (copiadas)
│   └── mobile/
│       └── src/
│           ├── context/     # Context específico de mobile
│           ├── services/   # Servicios específicos de mobile
│           └── utils/      # Utilidades compartidas (copiadas)
```

**Ventajas:**
- ✅ Cada app es **independiente** para deploy
- ✅ No hay dependencias del workspace en producción
- ✅ Build más simple y predecible
- ✅ Solo se copia lo mínimo necesario (utilidades, constantes)

**Desventajas:**
- ❌ Hay duplicación de código (pero mínima y controlada)
- ❌ Cambios en lógica compartida requieren actualizar ambas apps

#### **Opción 2: Paquete NPM Privado (Para proyectos grandes)**

**Estructura:**
```
packages/
└── shared-logic/
    ├── package.json
    └── src/
        └── utils/

# Publicar como paquete NPM privado
npm publish @mi-empresa/shared-logic

# En cada app:
npm install @mi-empresa/shared-logic
```

**Ventajas:**
- ✅ Código compartido versionado
- ✅ Cada app lo instala como dependencia normal
- ✅ Deploy independiente funciona

**Desventajas:**
- ❌ Requiere infraestructura de NPM privado
- ❌ Más complejo para proyectos pequeños

#### **Opción 3: Monorepo con Build Tools Avanzados (Turborepo, Nx)**

**Herramientas:**
- **Turborepo**: Build system para monorepos
- **Nx**: Herramienta completa para monorepos

**Ventajas:**
- ✅ Resuelve problemas de build y deploy
- ✅ Caché inteligente
- ✅ Builds paralelos

**Desventajas:**
- ❌ Curva de aprendizaje
- ❌ Más configuración
- ❌ Puede ser overkill para proyectos pequeños

### ¿Por qué se eligió esta arquitectura (y por qué no es ideal)?

**Razones de la elección inicial:**
1. ✅ Desarrollo más rápido (código compartido)
2. ✅ Menos duplicación durante desarrollo
3. ✅ Fácil de entender para el equipo
4. ✅ Funciona bien en desarrollo local

**Problemas técnicos identificados:**
1. ❌ **Deploy complejo**: Cada app necesita resolver `packages/core-logic`
2. ❌ **Dependencias del workspace**: No funciona en servidores de deploy estándar
3. ❌ **Build frágil**: Configuración compleja en Vite y Metro
4. ❌ **No es verdadero "compartir"**: Cada bundle incluye una copia del código
5. ❌ **Mantenimiento difícil**: Cambios en core-logic pueden romper builds

### Lecciones Aprendidas

**Para proyectos similares, se recomienda:**

1. **Evaluar el deploy antes de elegir arquitectura**
   - ¿Se despliegan juntos o separados?
   - ¿Comparten el mismo runtime?

2. **Minimizar código compartido**
   - Solo compartir utilidades puras
   - No compartir Context, Hooks, o Componentes

3. **Considerar duplicación controlada**
   - A veces es mejor duplicar código que complicar el build
   - La duplicación mínima es aceptable si simplifica el deploy

4. **Usar herramientas adecuadas**
   - Para monorepos complejos: Turborepo o Nx
   - Para proyectos simples: código duplicado mínimo

### Conclusión de la Autocrítica

**Esta arquitectura funciona para:**
- ✅ Desarrollo y prototipado rápido
- ✅ Proyectos académicos/MVP
- ✅ Aprendizaje de conceptos

**Esta arquitectura NO es ideal para:**
- ❌ Producción con deploys independientes
- ❌ Proyectos que escalan
- ❌ Equipos grandes con CI/CD complejo

**Recomendación para futuros proyectos:**
- Usar **código duplicado mínimo** (solo utilidades y constantes)
- O usar **paquetes NPM** si realmente se necesita compartir código
- O usar **Turborepo/Nx** si el monorepo es necesario

---

## 📁 Estructura de Carpetas

### Raíz del Proyecto

```
Marketplace-Insumos-Web-Mobile/
│
├── package.json              # Configuración del monorepo y workspaces
├── eslint.config.js          # Configuración de ESLint para todo el proyecto
│
├── apps/
│   ├── web/                  # 🖥️ APLICACIÓN WEB
│   │   ├── package.json
│   │   ├── vite.config.js    # Configuración de Vite (build tool)
│   │   ├── index.html        # HTML de entrada
│   │   └── src/
│   │       ├── main.jsx      # ⭐ PUNTO DE ENTRADA WEB
│   │       ├── App.jsx       # Componente raíz de la app web
│   │       ├── App.css
│   │       ├── index.css
│   │       ├── router/       # Configuración de rutas
│   │       │   ├── AppRouter.jsx
│   │       │   ├── ProtectedRoute.jsx
│   │       │   └── PublicRoute.jsx
│   │       ├── pages/       # Páginas completas
│   │       │   ├── LandingPage.jsx
│   │       │   ├── LoginPage.jsx
│   │       │   ├── DashboardPage.jsx
│   │       │   └── ...
│   │       └── components/  # Componentes reutilizables
│   │           ├── Login.jsx
│   │           ├── ServiceList.jsx
│   │           └── ...
│   │
│   └── mobile/               # 📱 APLICACIÓN MOBILE
│       ├── package.json
│       ├── app.json          # Configuración de Expo
│       ├── metro.config.js   # Configuración del bundler de React Native
│       ├── index.js          # ⭐ PUNTO DE ENTRADA MOBILE
│       ├── App.jsx           # Componente raíz de la app mobile
│       ├── polyfills.js      # Polyfills para compatibilidad
│       └── src/
│           ├── screens/      # Pantallas de la app mobile
│           │   ├── LoginScreen.jsx
│           │   ├── DashboardRouter.jsx
│           │   └── ...
│           └── components/   # Componentes reutilizables
│               ├── ServiceCard.jsx
│               └── ...
│
└── packages/
    └── core-logic/           # 🔄 LÓGICA COMPARTIDA
        └── src/
            ├── context/      # Context API (Estado Global)
            │   ├── GlobalStateContext.jsx
            │   ├── AuthContext.jsx
            │   └── AppReducer.js
            ├── services/     # Servicios de negocio
            │   └── AuthService.js
            └── data/         # Datos mock e iniciales
                ├── initialState.js
                ├── mockServices.js
                └── mockSupplyOffers.js
```

### Explicación de Carpetas Clave:

#### `apps/web/src/`
- **`main.jsx`**: Punto de entrada de la aplicación web. Aquí se monta React en el DOM.
- **`App.jsx`**: Componente raíz que renderiza el router.
- **`router/`**: Configuración de todas las rutas de la aplicación (React Router).
- **`pages/`**: Componentes que representan páginas completas (LoginPage, DashboardPage, etc.).
- **`components/`**: Componentes reutilizables que se usan en múltiples páginas.

#### `apps/mobile/src/`
- **`screens/`**: Pantallas completas de la app mobile (equivalente a `pages/` en web).
- **`components/`**: Componentes reutilizables específicos para mobile.

#### `packages/core-logic/src/`
- **`context/`**: Estado global y Context API.
- **`services/`**: Lógica de negocio (autenticación, API calls futuros).
- **`data/`**: Datos iniciales y mocks para desarrollo.

---

## 🚀 Inicialización del Proyecto

### ¿Dónde se inicializa el proyecto?

#### **Aplicación Web** (`apps/web/`)

**1. Punto de Entrada: `apps/web/src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GlobalStateProvider } from '@core-logic/context/GlobalStateContext.jsx'
import { AuthProvider } from '@core-logic/context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GlobalStateProvider>
  </React.StrictMode>,
)
```

**Flujo de inicialización:**
1. `main.jsx` se ejecuta cuando el navegador carga `index.html`
2. Busca el elemento `<div id="root">` en el HTML
3. Crea un "root" de React y renderiza la aplicación
4. Envuelve todo en `GlobalStateProvider` (estado global) y `AuthProvider` (autenticación)
5. Renderiza el componente `App`

**2. Componente App: `apps/web/src/App.jsx`**

```jsx
import AppRouter from './router/AppRouter';
import './App.css'

function App() {
  return <AppRouter />;
}

export default App
```

- `App` simplemente renderiza el `AppRouter`, que maneja todas las rutas.

**3. Router: `apps/web/src/router/AppRouter.jsx`**

- Define todas las rutas de la aplicación:
  - `/` → LandingPage
  - `/login` → LoginPage (solo si NO estás autenticado)
  - `/dashboard` → DashboardPage (solo si estás autenticado)
  - `/services` → ServicesListPage
  - etc.

**4. Configuración: `apps/web/vite.config.js`**

- Configuración de Vite (build tool y dev server).
- Define el alias `@core-logic` para importar desde `packages/core-logic`.
- Configura la resolución de módulos del workspace.

**5. HTML de entrada: `apps/web/index.html`**

- Archivo HTML principal que carga la aplicación.
- Contiene el `<div id="root">` donde React monta la app.
- Carga `main.jsx` como módulo ES6.

### Archivos Principales de Web - Lista Completa

#### **Archivos de Entrada y Configuración**

1. **`apps/web/index.html`** ⭐
   - Archivo HTML principal
   - Contiene el `<div id="root">` donde React monta la aplicación
   - Carga `main.jsx` como módulo ES6

2. **`apps/web/src/main.jsx`** ⭐
   - Punto de entrada JavaScript de la aplicación web
   - Monta React en el DOM usando `ReactDOM.createRoot()`
   - Envuelve la app con `GlobalStateProvider` y `AuthProvider`

3. **`apps/web/src/App.jsx`** ⭐
   - Componente raíz de la aplicación
   - Renderiza el `AppRouter` que maneja toda la navegación

4. **`apps/web/vite.config.js`** ⚙️
   - Configuración de Vite (build tool y dev server)
   - Define alias `@core-logic` para importar código compartido
   - Configura la resolución de módulos del workspace

#### **Router y Rutas**

5. **`apps/web/src/router/AppRouter.jsx`** ⭐
   - Configura todas las rutas de la aplicación usando React Router
   - Define rutas públicas y protegidas
   - Maneja la navegación entre páginas

6. **`apps/web/src/router/ProtectedRoute.jsx`**
   - Componente que protege rutas privadas
   - Redirige a Login si el usuario no está autenticado

7. **`apps/web/src/router/PublicRoute.jsx`**
   - Componente para rutas públicas
   - Redirige a Dashboard si el usuario ya está autenticado

#### **Páginas (Pages)**

Ubicación: `apps/web/src/pages/`

1. **`LandingPage.jsx`** ⭐
   - Página de inicio (marketing)
   - Muestra información sobre la plataforma
   - Navega a Login o Dashboard según autenticación

2. **`LoginPage.jsx`** ⭐
   - Página de autenticación
   - Formulario de login con email y contraseña
   - Redirige automáticamente al dashboard después del login

3. **`SignUpPage.jsx`**
   - Página de registro (actualmente no funcional, solo UI)

4. **`DashboardPage.jsx`** ⭐
   - Dashboard principal según el rol del usuario
   - Renderiza `RoleDashboard` que muestra el dashboard correcto

5. **`CreateServicePage.jsx`**
   - Página para crear un nuevo servicio (Rol: Solicitante)
   - Formulario completo con validaciones

6. **`ServicesListPage.jsx`**
   - Lista de servicios publicados (Rol: Proveedor de Servicio)
   - Filtros y búsqueda

7. **`ServiceDetailPage.jsx`** ⭐
   - Detalle completo de un servicio
   - Comparador de cotizaciones (Rol: Solicitante)
   - Enviar/editar cotizaciones (Rol: Proveedor de Servicio)

8. **`CreateSupplyOfferPage.jsx`**
   - Página para crear oferta de insumos (Rol: Proveedor de Insumos)

9. **`NotFoundPage.jsx`**
   - Página 404 para rutas no encontradas

#### **Componentes Reutilizables**

Ubicación: `apps/web/src/components/`

- `RoleDashboard.jsx` ⭐ - Router que muestra dashboard según rol
- `Login.jsx` - Componente de formulario de login
- `SignUp.jsx` - Componente de formulario de registro
- `ServiceList.jsx` - Lista de servicios con filtros
- `ServiceForm.jsx` - Formulario para crear servicio
- `ServiceCard.jsx` - Tarjeta de servicio
- `QuoteComparator.jsx` - Comparador de cotizaciones
- `SupplyOfferForm.jsx` - Formulario para ofertas de insumos
- Y más componentes reutilizables...

### Flujo de Ejecución Web

```
1. index.html
   └── Carga main.jsx como módulo ES6
        ↓
2. main.jsx
   └── ReactDOM.createRoot() → GlobalStateProvider → AuthProvider → App
        ↓
3. App.jsx
   └── Renderiza AppRouter
        ↓
4. AppRouter.jsx
   └── BrowserRouter → Routes → Route
        ↓
5. Rutas según URL:
   - / → LandingPage
   - /login → PublicRoute → LoginPage
   - /dashboard → ProtectedRoute → DashboardPage
        ↓
6. DashboardPage.jsx
   └── Renderiza RoleDashboard
        ↓
7. RoleDashboard.jsx
   └── Renderiza dashboard según rol:
       - SolicitanteDashboard
       - ProveedorServicioDashboard
       - ProveedorInsumosDashboard
```

#### **Aplicación Mobile** (`apps/mobile/`)

**1. Punto de Entrada: `apps/mobile/index.js`**

```jsx
import { registerRootComponent } from 'expo';
import './polyfills';
import App from './App';

registerRootComponent(App);
```

**Flujo de inicialización:**
1. `index.js` registra `App` como el componente raíz usando Expo
2. Carga los polyfills necesarios (para localStorage, etc.)
3. Expo renderiza `App` en la pantalla del dispositivo

**2. Componente App: `apps/mobile/App.jsx`**

```jsx
export default function App() {
  return (
    <ErrorBoundary>
      <GlobalStateProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </GlobalStateProvider>
    </ErrorBoundary>
  );
}
```

- Similar a web, pero usa `AppNavigator` (React Navigation) en lugar de React Router.

**3. Navigator: `apps/mobile/src/screens/DashboardRouter.jsx`**

- Define las pantallas usando React Navigation (Stack Navigator).

**4. Polyfills: `apps/mobile/polyfills.js`**

- Polyfill de `localStorage` para React Native.
- React Native no tiene `localStorage` nativo, este archivo lo simula en memoria.
- **IMPORTANTE**: Los datos se pierden al cerrar la app (es en memoria, no persistente).

**5. Configuración: `apps/mobile/metro.config.js`**

- Configuración de Metro Bundler (el bundler de React Native).
- Resuelve módulos del workspace para importar desde `packages/core-logic`.
- Configura `watchFolders` para hot reload del código compartido.

**6. Configuración Expo: `apps/mobile/app.json`**

- Configuración de Expo (nombre, versión, iconos, splash screen).
- Configuración específica para iOS, Android y Web.

### Archivos Principales de Mobile - Lista Completa

#### **Archivos de Entrada y Configuración**

1. **`apps/mobile/index.js`** ⭐
   - Punto de entrada de la aplicación mobile
   - Registra `App` como componente raíz con Expo
   - Carga polyfills antes de iniciar

2. **`apps/mobile/polyfills.js`**
   - Polyfill de `localStorage` para React Native
   - Simula la API de `localStorage` en memoria

3. **`apps/mobile/App.jsx`** ⭐
   - Componente raíz de la aplicación
   - Contiene `ErrorBoundary`, `GlobalStateProvider`, y `AppNavigator`
   - Configura la navegación principal

4. **`apps/mobile/metro.config.js`** ⚙️
   - Configuración de Metro Bundler
   - Resuelve módulos del workspace (`packages/core-logic`)
   - Configura hot reload

5. **`apps/mobile/app.json`** ⚙️
   - Configuración de Expo
   - Define nombre, versión, iconos, splash screen

#### **Pantallas (Screens)**

Ubicación: `apps/mobile/src/screens/`

1. **`LoginScreen.jsx`** ⭐
   - Pantalla de autenticación
   - Formulario de login con email y contraseña
   - Navega automáticamente al dashboard después del login

2. **`DashboardRouter.jsx`** ⭐
   - Router que muestra el dashboard según el rol
   - Renderiza condicionalmente:
     - `SolicitanteDashboard` si rol es "Solicitante"
     - `ProveedorServicioDashboard` si rol es "Proveedor de Servicio"
     - `ProveedorInsumosDashboard` si rol es "Proveedor de Insumos"

3. **`SolicitanteDashboard.jsx`**
   - Dashboard para usuarios Solicitantes
   - Ver servicios publicados, comparar cotizaciones, seleccionar

4. **`ProveedorServicioDashboard.jsx`**
   - Dashboard para Proveedores de Servicio
   - Ver servicios disponibles, enviar cotizaciones

5. **`ProveedorInsumosDashboard.jsx`**
   - Dashboard para Proveedores de Insumos
   - Ver y publicar packs de insumos

6. **`ServiceFormScreen.jsx`**
   - Pantalla para crear un nuevo servicio
   - Formulario completo con validaciones

7. **`ServiceListScreen.jsx`**
   - Lista de servicios publicados disponibles
   - Filtros y búsqueda

8. **`ServiceDetailScreen.jsx`**
   - Detalle completo de un servicio
   - Ver cotizaciones, comparar, seleccionar (según rol)

9. **`QuoteFormScreen.jsx`**
   - Formulario para enviar una cotización
   - Solo para Proveedores de Servicio

10. **`SupplyOfferFormScreen.jsx`**
    - Formulario para crear una oferta de insumos
    - Solo para Proveedores de Insumos

#### **Componentes Reutilizables**

Ubicación: `apps/mobile/src/components/`

- `ServiceCard.jsx` - Tarjeta de servicio
- `PublicServiceCard.jsx` - Tarjeta de servicio público
- `QuoteComparator.jsx` - Comparador de cotizaciones
- `CompletionButton.jsx` - Botón para completar servicio
- `DatePicker.jsx` - Selector de fecha nativo
- `LocationPicker.jsx` - Selector de ubicación
- `FilterPills.jsx` - Pills de filtros
- `SummaryCard.jsx` - Tarjeta de resumen estadístico
- `MenuButton.jsx` - Botón de menú hamburguesa
- `MenuDrawer.jsx` - Drawer de menú lateral

#### **Utilidades**

- `apps/mobile/src/utils/helpers.js` - Funciones helper reutilizables

### Flujo de Ejecución Mobile

```
1. index.js
   └── registerRootComponent(App)
        ↓
2. polyfills.js
   └── Carga polyfill de localStorage
        ↓
3. App.jsx
   └── ErrorBoundary → GlobalStateProvider → AppNavigator
        ↓
4. AppNavigator (en App.jsx)
   └── NavigationContainer → Stack.Navigator
        ↓
5. Pantalla inicial:
   - Si NO autenticado → LoginScreen
   - Si autenticado → DashboardRouter
        ↓
6. DashboardRouter.jsx
   └── Renderiza dashboard según rol:
       - SolicitanteDashboard
       - ProveedorServicioDashboard
       - ProveedorInsumosDashboard
        ↓
7. Navegación a pantallas específicas:
   - ServiceFormScreen
   - ServiceListScreen
   - ServiceDetailScreen
   - QuoteFormScreen
   - SupplyOfferFormScreen
```

### Diferencias Clave: Web vs Mobile

| Aspecto | Web | Mobile |
|---------|-----|--------|
| **Punto de entrada** | `index.html` → `main.jsx` | `index.js` → `App.jsx` |
| **Navegación** | React Router DOM | React Navigation (Stack Navigator) |
| **Componentes UI** | HTML (`<div>`, `<button>`) | React Native (`<View>`, `<TouchableOpacity>`) |
| **Estilos** | CSS (archivos `.css`) | StyleSheet (JavaScript) |
| **Pantallas** | `pages/` | `screens/` |
| **Bundler** | Vite | Metro Bundler (Expo) |
| **Persistencia** | localStorage (persistente) | Polyfill localStorage (en memoria, se pierde) |
| **Error Handling** | Básico | ErrorBoundary (clase component) |
| **Navegación programática** | `useNavigate()` | `navigation.navigate()` (prop) |

### Archivos Clave de Mobile para Revisar

1. **`apps/mobile/index.js`** - Cómo se inicia la app mobile
2. **`apps/mobile/App.jsx`** - Componente raíz, navegación y ErrorBoundary
3. **`apps/mobile/src/screens/DashboardRouter.jsx`** - Cómo funciona el routing por rol
4. **`apps/mobile/src/screens/LoginScreen.jsx`** - Autenticación en mobile
5. **`apps/mobile/metro.config.js`** - Cómo se resuelven módulos del workspace
6. **`apps/mobile/polyfills.js`** - Por qué necesitamos polyfills y cómo funcionan

---

## 📦 Bundling y Build: ¿Qué son "index.js" y "bundled render.js"?

### ¿Qué es el Bundling (Empaquetado)?

Cuando desarrollas una aplicación React, escribes código en muchos archivos separados:
- `main.jsx` - Punto de entrada
- `App.jsx` - Componente principal
- `components/Login.jsx` - Componentes
- `context/AuthContext.jsx` - Contextos
- etc.

**El bundling es el proceso de combinar todos estos archivos en archivos optimizados para producción.**

### Desarrollo vs Producción

#### **En Desarrollo** (con Vite):
- **Punto de entrada**: `apps/web/src/main.jsx`
- Vite sirve los archivos **directamente** sin bundling completo
- Los archivos se cargan **on-demand** (carga bajo demanda)
- **Hot Module Replacement (HMR)**: Cambios instantáneos sin recargar

**En el HTML** (`apps/web/index.html`):
```html
<script type="module" src="/src/main.jsx"></script>
```

Vite procesa este archivo y carga todos los imports automáticamente.

#### **En Producción** (después de `npm run build`):
- Vite **empqueta** (bundlea) todo el código
- Combina todos los archivos en archivos optimizados
- Minifica el código (lo hace más pequeño)
- Divide el código en "chunks" (fragmentos) para mejor rendimiento

**Archivos generados** (en `apps/web/dist/` después del build):
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js      ← Tu código principal (bundled)
│   ├── vendor-[hash].js     ← Dependencias (React, React-DOM, etc.)
│   └── [nombre]-[hash].js   ← Otros chunks (si hay code splitting)
```

### ¿Qué es "index.js" (o "main.jsx" en este proyecto)?

**`main.jsx`** es el **punto de entrada** de la aplicación:

```jsx
// apps/web/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GlobalStateProvider } from '@core-logic/context/GlobalStateContext.jsx'
import { AuthProvider } from '@core-logic/context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GlobalStateProvider>
  </React.StrictMode>,
)
```

**¿Qué hace?**
1. **Importa React y ReactDOM**: Necesarios para renderizar componentes
2. **Importa tu App**: El componente raíz de tu aplicación
3. **Importa Providers**: Contextos globales (GlobalStateProvider, AuthProvider)
4. **Monta la app**: `ReactDOM.createRoot()` crea el "root" de React
5. **Renderiza**: `.render()` renderiza `<App />` dentro del `<div id="root">` del HTML

### ¿Qué es "bundled render.js" (o archivos bundle)?

**"bundled render.js"** (o los archivos `index-[hash].js`, `vendor-[hash].js`) son los archivos **resultantes del proceso de bundling**.

**Antes del build** (código fuente):
```
src/
├── main.jsx              ← Punto de entrada
├── App.jsx
├── components/
│   └── Login.jsx
└── context/
    └── AuthContext.jsx
```

**Después del build** (código bundleado):
```
dist/
└── assets/
    ├── index-abc123.js   ← Contiene: main.jsx + App.jsx + Login.jsx + AuthContext.jsx (todo combinado)
    └── vendor-xyz789.js  ← Contiene: React + React-DOM + React Router (dependencias)
```

### ¿Por qué se hace el Bundling?

#### 1. **Rendimiento**
- **Menos requests HTTP**: En lugar de 50 archivos, solo 2-3 archivos
- **Carga más rápida**: El navegador descarga menos archivos
- **Código optimizado**: Minificado (sin espacios, nombres cortos)

#### 2. **Compatibilidad**
- **Transpilación**: Convierte JSX y ES6+ a JavaScript que todos los navegadores entienden
- **Polyfills**: Agrega compatibilidad para navegadores antiguos

#### 3. **Organización**
- **Code Splitting**: Divide el código en chunks que se cargan cuando se necesitan
- **Tree Shaking**: Elimina código no usado

### Proceso de Build Paso a Paso

#### **1. Desarrollo** (`npm run dev:web`):

```
Usuario escribe código → Vite detecta cambios → Actualiza solo lo necesario → Navegador refresca
```

**Archivos servidos**:
- Vite sirve `/src/main.jsx` directamente
- Carga imports bajo demanda
- Sin bundling completo

#### **2. Build para Producción** (`npm run build:web`):

```
1. Vite lee main.jsx (punto de entrada)
2. Analiza todos los imports recursivamente
3. Combina todos los archivos en bundles optimizados
4. Minifica el código
5. Divide en chunks (vendor, código de la app, etc.)
6. Genera archivos en dist/
```

**Resultado**:
```html
<!-- dist/index.html (generado automáticamente) -->
<!doctype html>
<html>
  <head>...</head>
  <body>
    <div id="root"></div>
    <!-- Estos son los archivos bundleados -->
    <script type="module" src="/assets/index-abc123.js"></script>
    <script type="module" src="/assets/vendor-xyz789.js"></script>
  </body>
</html>
```

### Estructura de Archivos Bundleados

**`index-[hash].js`** contiene:
- Tu código de la aplicación (`App.jsx`, componentes, contextos, etc.)
- Código que escribiste

**`vendor-[hash].js`** contiene:
- Dependencias de `node_modules` (React, React-DOM, React Router, etc.)
- Librerías externas

**¿Por qué se separan?**
- **Cache**: Si cambias tu código, el `vendor.js` no cambia → El navegador puede usar la versión cacheada
- **Mejor rendimiento**: Solo descarga lo que cambió

### Hash en los Nombres

Los archivos se nombran con un hash: `index-abc123.js`

**¿Por qué?**
- **Cache busting**: Cuando actualizas la app, el hash cambia
- El navegador descarga la nueva versión en lugar de usar la cacheada
- Garantiza que los usuarios siempre tengan la versión más reciente

### Ejemplo Visual del Flujo

```
┌─────────────────────────────────────────────────────────┐
│                   DESARROLLO                            │
│  (npm run dev:web)                                      │
│                                                          │
│  Código fuente → Vite Dev Server → Navegador           │
│                                                          │
│  src/main.jsx ──┐                                        │
│  src/App.jsx ───┼─→ Vite ─→ http://localhost:5173      │
│  src/components─┘    (sin bundle completo)              │
└─────────────────────────────────────────────────────────┘
                        ↓
                  npm run build
                        ↓
┌─────────────────────────────────────────────────────────┐
│                   PRODUCCIÓN                            │
│  (npm run build:web)                                    │
│                                                          │
│  Código fuente → Vite Build → Bundles Optimizados      │
│                                                          │
│  src/main.jsx ──┐                                        │
│  src/App.jsx ───┼─→ Vite ─→ dist/assets/               │
│  src/components─┘    Bundler    ├── index-abc123.js    │
│                                 └── vendor-xyz789.js    │
└─────────────────────────────────────────────────────────┘
```

### Resumen

| Concepto | Desarrollo | Producción |
|----------|------------|------------|
| **Punto de entrada** | `main.jsx` | `main.jsx` (se convierte en bundle) |
| **Archivos** | Múltiples archivos separados | Archivos bundleados combinados |
| **Tamaño** | Tamaño real | Minificado (más pequeño) |
| **Carga** | Bajo demanda (lazy loading) | Todos los bundles cargados |
| **Optimización** | Ninguna | Minificación, tree shaking, code splitting |
| **Nombres** | Nombres reales (`main.jsx`) | Nombres con hash (`index-abc123.js`) |

### En Este Proyecto

**Web** (`apps/web/`):
- **Punto de entrada**: `src/main.jsx`
- **Bundler**: Vite
- **Archivos bundleados**: `dist/assets/index-[hash].js`, `dist/assets/vendor-[hash].js`

**Mobile** (`apps/mobile/`):
- **Punto de entrada**: `index.js`
- **Bundler**: Metro Bundler (Expo)
- **Archivos bundleados**: Se genera un bundle optimizado para iOS/Android

---

## 🖥️ Servidores y Entorno de Desarrollo

### ¿Cómo funcionan los servidores?

#### **Aplicación Web - Vite Dev Server**

**Comando:** `npm run dev:web`

**¿Qué hace?**
1. Vite inicia un servidor de desarrollo en `http://localhost:5173`
2. Escucha cambios en los archivos y recarga automáticamente (Hot Module Replacement - HMR)
3. Compila el código en tiempo real (sin build completo)
4. Sirve los archivos estáticos y maneja las rutas de React Router

**Archivo de configuración:** `apps/web/vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core-logic': path.resolve(__dirname, '../../packages/core-logic/src'),
    },
  },
})
```

- Configura el alias `@core-logic` para importar fácilmente desde el paquete compartido.

#### **Aplicación Mobile - Expo Dev Server**

**Comando:** `npm run start:mobile`

**¿Qué hace?**
1. Expo inicia un servidor de desarrollo (Metro Bundler)
2. Genera un código QR que puedes escanear con Expo Go
3. Compila el código JavaScript en tiempo real
4. Envía el bundle a tu dispositivo/emulador
5. Hot reload: los cambios se reflejan automáticamente

**Archivo de configuración:** `apps/mobile/metro.config.js`

- Configura Metro Bundler para resolver módulos del workspace (importar desde `packages/core-logic`).

### ¿Por qué dos servidores diferentes?

- **Web**: Necesita un servidor HTTP estándar (Vite) porque se ejecuta en el navegador.
- **Mobile**: Necesita Metro Bundler (Expo) porque compila JavaScript nativo para iOS/Android.

---

## 🛠️ Tecnologías Utilizadas

### Stack Tecnológico Completo

#### **Frontend Framework**
- **React 19.1.0**: Biblioteca de JavaScript para construir interfaces de usuario
  - **¿Por qué React?**: Componentización, reutilización, ecosistema grande
  - **Versión 19**: Última versión estable con mejoras de rendimiento

#### **Web**
- **Vite 7.1.7**: Build tool y dev server
  - **¿Por qué Vite y no Create React App?**: Más rápido, mejor HMR, configuración más simple
  - **¿Por qué no Next.js?**: Este proyecto es una SPA (Single Page Application), Next.js es para SSR/SSG que no necesitamos aquí
- **React Router DOM 7.9.4**: Navegación entre páginas
- **CSS**: Estilos con archivos `.css` tradicionales
  - **¿Por qué CSS y no SCSS?**: Simplicidad para el MVP, fácil de entender, no requiere compilación adicional

#### **Mobile**
- **React Native 0.81.5**: Framework para apps nativas
- **Expo ~54.0.25**: Herramientas y SDK para desarrollo mobile
  - **¿Por qué Expo?**: Facilita el desarrollo, no necesitas configurar Android Studio/Xcode
- **React Navigation 7.x**: Navegación en mobile (equivalente a React Router en web)

#### **Estado Global**
- **React Context API**: Para compartir estado entre componentes
- **useReducer**: Para manejar estado complejo de forma predecible

#### **Herramientas de Desarrollo**
- **ESLint**: Linter para detectar errores y mantener código consistente
- **npm workspaces**: Gestión de monorepo

### Resumen de Decisiones Técnicas

| Tecnología | ¿Por qué? |
|------------|-----------|
| **React 19** | Última versión estable, mejor rendimiento |
| **Vite** | Más rápido que Webpack/CRA, mejor DX |
| **No Next.js** | No necesitamos SSR, es una SPA simple |
| **CSS (no SCSS)** | Simplicidad, no requiere compilación adicional |
| **Expo** | Facilita desarrollo mobile sin configurar nativo |
| **React Context** | Suficiente para el tamaño del proyecto, no necesitamos Redux |
| **Monorepo** | Compartir código entre web y mobile |

---

## 💻 Conceptos Fundamentales de JavaScript y React

### JavaScript ES6+ (Conceptos Clave)

#### 1. **Arrow Functions (Funciones Flecha)**

```javascript
// Función tradicional
function sumar(a, b) {
  return a + b;
}

// Arrow function
const sumar = (a, b) => a + b;

// Arrow function con cuerpo
const sumar = (a, b) => {
  return a + b;
};
```

**Uso en React:**
```jsx
const Componente = () => {
  return <div>Hola</div>;
};
```

#### 2. **Destructuring (Desestructuración)**

```javascript
// Desestructurar objetos
const usuario = { name: 'Juan', email: 'juan@mail.com' };
const { name, email } = usuario;
console.log(name); // 'Juan'

// Desestructurar arrays
const [primero, segundo] = [1, 2, 3];
console.log(primero); // 1
```

**Uso en React:**
```jsx
const { state, dispatch } = useAppState();
const [count, setCount] = useState(0);
```

#### 3. **Spread Operator (...)**

```javascript
// Copiar arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4]; // [1, 2, 3, 4]

// Copiar objetos
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
```

**Uso en React (inmutabilidad):**
```javascript
// En el reducer
return {
  ...state,
  currentUser: action.payload
};
```

#### 4. **Template Literals (Template Strings)**

```javascript
const nombre = 'Juan';
const mensaje = `Hola, ${nombre}!`; // 'Hola, Juan!'
```

#### 5. **Modules (Import/Export)**

```javascript
// Exportar
export const miFuncion = () => { };
export default MiComponente;

// Importar
import MiComponente, { miFuncion } from './archivo';
```

### React - Conceptos Fundamentales

#### 1. **Componentes**

Un componente es una función que retorna JSX (JavaScript XML).

```jsx
// Componente funcional
function MiComponente() {
  return <div>Hola Mundo</div>;
}

// O con arrow function
const MiComponente = () => {
  return <div>Hola Mundo</div>;
};
```

#### 2. **JSX (JavaScript XML)**

JSX es una sintaxis que parece HTML pero es JavaScript.

```jsx
// Esto es JSX
const elemento = <h1>Hola</h1>;

// Se compila a esto:
const elemento = React.createElement('h1', null, 'Hola');
```

**Reglas de JSX:**
- Debe retornar un solo elemento raíz (o usar Fragment `<>...</>`)
- Los atributos usan camelCase: `className` en lugar de `class`
- Las expresiones JavaScript van entre `{}`

```jsx
const nombre = 'Juan';
const elemento = (
  <div className="container">
    <h1>Hola, {nombre}!</h1>
    {esVerdadero && <p>Esto se muestra</p>}
  </div>
);
```

#### 3. **Event Handlers (Manejadores de Eventos)**

```jsx
const Boton = () => {
  const handleClick = () => {
    console.log('Click!');
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

---

## 🔄 Ciclo de Vida de Componentes

### ¿Qué es el Ciclo de Vida?

El ciclo de vida de un componente son las diferentes fases por las que pasa desde que se crea hasta que se destruye.

### Fases del Ciclo de Vida:

#### 1. **Mounting (Montaje)** - El componente se crea y se inserta en el DOM

#### 2. **Updating (Actualización)** - El componente se actualiza cuando cambian props o estado

#### 3. **Unmounting (Desmontaje)** - El componente se elimina del DOM

### Métodos del Ciclo de Vida (Clase Components - Antiguo)

```jsx
class MiComponente extends React.Component {
  // 1. Constructor - Se ejecuta ANTES del montaje
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  // 2. componentDidMount - Se ejecuta DESPUÉS del montaje
  componentDidMount() {
    console.log('Componente montado');
    // Ideal para: llamadas a API, suscripciones
  }

  // 3. componentDidUpdate - Se ejecuta DESPUÉS de cada actualización
  componentDidUpdate(prevProps, prevState) {
    if (prevState.count !== this.state.count) {
      console.log('Count cambió');
    }
  }

  // 4. componentWillUnmount - Se ejecuta ANTES del desmontaje
  componentWillUnmount() {
    console.log('Componente se va a desmontar');
    // Ideal para: limpiar suscripciones, timers
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

### Hooks Equivalentes (Functional Components - Moderno)

En este proyecto usamos **functional components** con hooks, que son más modernos y simples:

```jsx
import { useState, useEffect } from 'react';

const MiComponente = () => {
  const [count, setCount] = useState(0);

  // useEffect reemplaza componentDidMount, componentDidUpdate, componentWillUnmount
  useEffect(() => {
    // Esto se ejecuta después del montaje y después de cada actualización
    console.log('Componente montado o actualizado');
    
    // Cleanup function (equivalente a componentWillUnmount)
    return () => {
      console.log('Componente se va a desmontar');
    };
  }, [count]); // Array de dependencias: solo se ejecuta si count cambia

  return <div>{count}</div>;
};
```

### Ejemplo Real del Proyecto

**`packages/core-logic/src/context/AuthContext.jsx`:**

```jsx
export const AuthProvider = ({ children }) => {
  const { state, dispatch } = useAppState();
  
  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    // Carga el usuario guardado en localStorage al iniciar
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
    }
  }, [dispatch]); // Solo se ejecuta una vez al montar (dispatch no cambia)

  // ... resto del código
};
```

**Flujo:**
1. **Mount**: `AuthProvider` se monta → `useEffect` se ejecuta → carga usuario de localStorage
2. **Update**: Si `dispatch` cambia (nunca en este caso), se ejecutaría de nuevo
3. **Unmount**: Si el componente se desmonta, se ejecutaría la función de cleanup (si la hay)

---

## 🎣 Hooks: useState y useEffect

### ¿Qué son los Hooks?

Los hooks son funciones especiales que te permiten "engancharte" a características de React desde componentes funcionales.

**Reglas de los Hooks:**
1. Solo se pueden llamar en el nivel superior (no dentro de loops, condiciones, etc.)
2. Solo se pueden llamar en componentes funcionales o custom hooks

### useState

**¿Qué hace?** Permite agregar estado a un componente funcional.

**Sintaxis:**
```jsx
const [estado, setEstado] = useState(valorInicial);
```

**Ejemplo Básico:**
```jsx
import { useState } from 'react';

const Contador = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
};
```

**Ejemplo Real del Proyecto:**

**`apps/web/src/components/ServiceList.jsx`:**

```jsx
const ServiceList = () => {
  // Múltiples estados
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Usar los estados
  return (
    <select
      value={categoryFilter}
      onChange={(e) => setCategoryFilter(e.target.value)}
    >
      {/* ... */}
    </select>
  );
};
```

**¿Cómo funciona?**
1. `useState('')` inicializa `categoryFilter` con `''`
2. `setCategoryFilter` es la función para actualizar el estado
3. Cuando llamas `setCategoryFilter('nuevo valor')`, React re-renderiza el componente con el nuevo valor

### useEffect

**¿Qué hace?** Permite ejecutar efectos secundarios (side effects) en componentes funcionales.

**Efectos secundarios comunes:**
- Llamadas a APIs
- Suscripciones
- Manipulación del DOM
- Timers
- Leer/escribir en localStorage

**Sintaxis:**
```jsx
useEffect(() => {
  // Código a ejecutar
  return () => {
    // Cleanup (opcional)
  };
}, [dependencias]);
```

**Casos de Uso:**

#### 1. **Solo al montar (componentDidMount)**

```jsx
useEffect(() => {
  console.log('Solo se ejecuta una vez al montar');
}, []); // Array vacío = solo al montar
```

#### 2. **Cada vez que cambia una dependencia (componentDidUpdate)**

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log('Count cambió:', count);
}, [count]); // Se ejecuta cada vez que count cambia
```

#### 3. **Con cleanup (componentWillUnmount)**

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup: se ejecuta al desmontar
  return () => {
    clearInterval(timer);
  };
}, []);
```

**Ejemplo Real del Proyecto:**

**`packages/core-logic/src/context/AuthContext.jsx`:**

```jsx
export const AuthProvider = ({ children }) => {
  const { state, dispatch } = useAppState();

  // Se ejecuta al montar el componente
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
      } catch (err) {
        console.error('Error al cargar usuario:', err);
        localStorage.removeItem('currentUser');
      }
    }
  }, [dispatch]); // Solo se ejecuta una vez (dispatch no cambia)
  
  // ... resto del código
};
```

**¿Qué hace este useEffect?**
1. Al montar `AuthProvider`, lee `localStorage`
2. Si hay un usuario guardado, lo carga en el estado global
3. Esto permite que el usuario permanezca logueado al recargar la página

---

## 🔌 React Context (Detallado)

### ¿Qué es React Context?

**React Context** es una API de React que permite compartir datos entre componentes sin tener que pasar props manualmente en cada nivel (prop drilling).

**Conceptos Clave:**
- **Context**: Un objeto que almacena datos compartidos
- **Provider**: Un componente que "provee" (suministra) los datos a sus hijos
- **Consumer**: Un componente o hook que "consume" (lee) los datos del Context
- **Children**: Los componentes hijos que pueden acceder al Context

### ¿Cómo Funciona React Context?

**Flujo Básico:**
```
1. Crear el Context (createContext)
   ↓
2. Crear el Provider (componente que envuelve hijos)
   ↓
3. El Provider tiene un value (los datos a compartir)
   ↓
4. Cualquier componente hijo puede acceder al value usando useContext
```

### Estructura de un Context

**1. Crear el Context:**
```jsx
import { createContext } from 'react';

// createContext crea un objeto Context
// El valor por defecto se usa si no hay Provider
export const MiContext = createContext(valorPorDefecto);
```

**2. Crear el Provider:**
```jsx
// El Provider es un COMPONENTE que:
// - Recibe children como prop
// - Tiene un value (los datos a compartir)
// - Envuelve los componentes hijos
export const MiProvider = ({ children }) => {
  // Puede usar useState, useReducer, etc.
  const [datos, setDatos] = useState(/* ... */);
  
  // El value es lo que se comparte
  const value = {
    datos,
    setDatos,
    // ... más datos o funciones
  };
  
  // Provider envuelve children
  return (
    <MiContext.Provider value={value}>
      {children}
    </MiContext.Provider>
  );
};
```

**3. Consumir el Context:**
```jsx
import { useContext } from 'react';
import { MiContext } from './MiContext';

const MiComponente = () => {
  // useContext lee el value del Provider más cercano
  const { datos, setDatos } = useContext(MiContext);
  
  return <div>{datos}</div>;
};
```

### ¿Dónde se Coloca el Provider?

**El Provider puede ser padre de:**
- ✅ **App** (toda la aplicación)
- ✅ **Cualquier componente** (solo esa parte de la app)
- ✅ **Otro Provider** (providers anidados)

**Ejemplo 1: Provider como padre de App (Recomendado para estado global)**
```jsx
// main.jsx
import { GlobalStateProvider } from '@core-logic/context/GlobalStateContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalStateProvider>  {/* ← Provider envuelve App */}
    <App />
  </GlobalStateProvider>
);
```

**Ejemplo 2: Provider como padre de un componente específico**
```jsx
// DashboardPage.jsx
const DashboardPage = () => {
  return (
    <MiProvider>  {/* ← Provider solo para esta sección */}
      <Header />
      <Content />
      <Footer />
    </MiProvider>
  );
};
```

**Ejemplo 3: Providers anidados (uno dentro de otro)**
```jsx
// main.jsx
<GlobalStateProvider>      {/* ← Provider externo */}
  <AuthProvider>            {/* ← Provider interno (usa GlobalStateProvider) */}
    <App />
  </AuthProvider>
</GlobalStateProvider>
```

### Provider: Componente que Envuelve Children

**¿Qué es el Provider?**
- El Provider es un **componente React normal**
- Recibe `children` como prop (los componentes hijos)
- Tiene un `value` que contiene los datos a compartir
- Envuelve los componentes hijos con `<Context.Provider>`

**Estructura del Provider:**
```jsx
export const MiProvider = ({ children }) => {
  // 1. Puede usar hooks (useState, useReducer, useEffect, etc.)
  const [estado, setEstado] = useState(/* ... */);
  
  // 2. Puede tener lógica de negocio
  const funcion = () => {
    // ...
  };
  
  // 3. Crea el value (objeto con datos y funciones)
  const value = {
    estado,
    setEstado,
    funcion,
    // ...
  };
  
  // 4. Retorna el Provider con children
  return (
    <MiContext.Provider value={value}>
      {children}  {/* ← Renderiza los componentes hijos */}
    </MiContext.Provider>
  );
};
```

**Características del Provider:**
- ✅ Es un componente funcional normal
- ✅ Puede usar hooks (useState, useReducer, useEffect, etc.)
- ✅ Puede tener props (pero `children` es la más común)
- ✅ Puede exportar funciones, constantes, etc.
- ✅ El `value` puede ser cualquier tipo (objeto, array, primitivo, función)

### Children: Los Componentes Hijos

**¿Qué es `children`?**
- `children` es una **prop especial** de React
- Contiene los componentes/elementos que se pasan entre las etiquetas del componente
- Es lo que el Provider "envuelve"

**Ejemplo:**
```jsx
// Cuando usas el Provider:
<GlobalStateProvider>
  <App />        {/* ← Esto es children */}
</GlobalStateProvider>

// Dentro del Provider:
export const GlobalStateProvider = ({ children }) => {
  // children = <App />
  return (
    <StateContext.Provider value={value}>
      {children}  {/* ← Renderiza <App /> */}
    </StateContext.Provider>
  );
};
```

**Children puede ser:**
- Un componente: `<Provider><App /></Provider>`
- Múltiples componentes: `<Provider><Header /><Content /></Provider>`
- Texto: `<Provider>Texto</Provider>`
- Nada: `<Provider></Provider>` (children = undefined)

### Cómo Funciona el Render con Context

**Flujo de Renderizado:**
```
1. React renderiza el Provider
   ↓
2. Provider ejecuta su código (hooks, lógica)
   ↓
3. Provider crea el value
   ↓
4. Provider renderiza children dentro de <Context.Provider>
   ↓
5. Los componentes hijos se renderizan
   ↓
6. Si un hijo usa useContext, React busca el Provider más cercano
   ↓
7. React lee el value del Provider y lo pasa al componente
```

**Ejemplo Detallado:**
```jsx
// 1. React renderiza GlobalStateProvider
<GlobalStateProvider>
  <App />
</GlobalStateProvider>

// 2. Dentro de GlobalStateProvider:
const GlobalStateProvider = ({ children }) => {
  // 3. Se ejecuta useReducer (crea state y dispatch)
  const [state, dispatch] = useReducer(AppReducer, initialState);
  
  // 4. Se crea el value
  const value = { state, dispatch };
  
  // 5. Se renderiza children (<App />) dentro del Provider
  return (
    <StateContext.Provider value={value}>
      {children}  {/* ← Renderiza <App /> */}
    </StateContext.Provider>
  );
};

// 6. App se renderiza
const App = () => {
  // 7. Si App usa useContext, React busca el Provider
  const { state } = useContext(StateContext);
  
  return <div>...</div>;
};
```

### Context con useState, useReducer, y otros Hooks

**El Provider puede usar cualquier hook:**

```jsx
export const MiProvider = ({ children }) => {
  // ✅ Puede usar useState
  const [count, setCount] = useState(0);
  
  // ✅ Puede usar useReducer
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // ✅ Puede usar useEffect
  useEffect(() => {
    // ...
  }, []);
  
  // ✅ Puede usar useMemo
  const valorMemoizado = useMemo(() => {
    // ...
  }, [deps]);
  
  // ✅ Puede tener funciones
  const handleClick = () => {
    setCount(count + 1);
  };
  
  // ✅ Puede tener lógica compleja
  const calcularTotal = () => {
    return state.items.reduce((sum, item) => sum + item.price, 0);
  };
  
  // ✅ Todo esto se puede compartir en el value
  const value = {
    count,
    setCount,
    state,
    dispatch,
    handleClick,
    calcularTotal,
    // ...
  };
  
  return (
    <MiContext.Provider value={value}>
      {children}
    </MiContext.Provider>
  );
};
```

### Exports: Cómo se Exporta un Context

**Patrón de Exportación:**
```jsx
// 1. Crear el Context
export const MiContext = createContext();

// 2. Crear el Provider
export const MiProvider = ({ children }) => {
  // ...
  return (
    <MiContext.Provider value={value}>
      {children}
    </MiContext.Provider>
  );
};

// 3. Crear el Custom Hook (opcional pero recomendado)
export const useMiContext = () => {
  const context = useContext(MiContext);
  if (!context) {
    throw new Error('useMiContext debe usarse dentro de MiProvider');
  }
  return context;
};
```

**¿Por qué exportar el Context?**
- A veces necesitas acceder al Context directamente (raro)
- Para testing
- Para casos avanzados

**¿Por qué crear un Custom Hook?**
- ✅ Mejor experiencia de uso
- ✅ Validación automática (error si se usa fuera del Provider)
- ✅ Más fácil de usar: `useMiContext()` vs `useContext(MiContext)`

### Context vs Props

**Props:**
- Se pasan manualmente de padre → hijo
- Solo llegan a componentes directos
- Prop drilling si hay muchos niveles

**Context:**
- Se comparte automáticamente a todos los hijos
- No importa cuántos niveles haya
- No hay prop drilling

**Comparación:**
```jsx
// CON PROPS (prop drilling):
<App>
  <Header user={user}>           {/* Pasa user */}
    <Navbar user={user}>          {/* Pasa user */}
      <UserMenu user={user} />    {/* Usa user */}
    </Navbar>
  </Header>
</App>

// CON CONTEXT (sin prop drilling):
<App>
  <UserProvider value={user}>     {/* Provider envuelve */}
    <Header>                      {/* No pasa props */}
      <Navbar>                    {/* No pasa props */}
        <UserMenu />              {/* Usa useContext */}
      </Navbar>
    </Header>
  </UserProvider>
</App>
```

### Cómo Consumimos el Context

**Método 1: useContext Hook (Recomendado)**
```jsx
import { useContext } from 'react';
import { StateContext } from './GlobalStateContext';

const MiComponente = () => {
  // useContext lee el value del Provider más cercano
  const { state, dispatch } = useContext(StateContext);
  
  return <div>{state.currentUser?.name}</div>;
};
```

**Método 2: Custom Hook (Más Recomendado)**
```jsx
import { useAppState } from '@core-logic/context/GlobalStateContext';

const MiComponente = () => {
  // Custom hook con validación
  const { state, dispatch } = useAppState();
  
  return <div>{state.currentUser?.name}</div>;
};
```

**Método 3: Consumer Component (Antiguo, no recomendado)**
```jsx
// ⚠️ Método antiguo, no se usa en este proyecto
<StateContext.Consumer>
  {({ state, dispatch }) => (
    <div>{state.currentUser?.name}</div>
  )}
</StateContext.Consumer>
```

### Ejemplo Real del Proyecto: GlobalStateContext

**Archivo:** `packages/core-logic/src/context/GlobalStateContext.jsx`

```jsx
// 1. Importar funciones de React
import { createContext, useContext, useReducer } from 'react';

// 2. Crear el Context
export const StateContext = createContext();

// 3. Crear el Provider (componente funcional)
export const GlobalStateProvider = ({ children }) => {
  // 4. Usar useReducer para manejar el estado
  const [state, dispatch] = useReducer(AppReducer, initialState);
  
  // 5. Crear el value (objeto con state y dispatch)
  const value = { state, dispatch };
  
  // 6. Retornar el Provider con children
  return (
    <StateContext.Provider value={value}>
      {children}  {/* ← Renderiza los componentes hijos */}
    </StateContext.Provider>
  );
};

// 7. Crear Custom Hook para consumir el Context
export const useAppState = () => {
  // 8. useContext lee el value del Provider
  const context = useContext(StateContext);
  
  // 9. Validar que se use dentro del Provider
  if (!context) {
    throw new Error('useAppState debe usarse dentro de GlobalStateProvider');
  }
  
  // 10. Retornar el context (que contiene { state, dispatch })
  return context;
};
```

**Uso en un componente:**
```jsx
import { useAppState } from '@core-logic/context/GlobalStateContext';

const DashboardPage = () => {
  // useAppState() retorna { state, dispatch }
  const { state, dispatch } = useAppState();
  
  // Acceder al estado
  const currentUser = state.currentUser;
  const services = state.services;
  
  // Modificar el estado
  const handleAddService = () => {
    dispatch({ type: 'ADD_SERVICE', payload: newService });
  };
  
  return <div>...</div>;
};
```

### Ejemplo Real del Proyecto: AuthContext

**Archivo:** `packages/core-logic/src/context/AuthContext.jsx`

```jsx
// 1. Crear el Context
export const AuthContext = createContext(undefined);

// 2. Crear el Provider
export const AuthProvider = ({ children }) => {
  // 3. Usar otro Context (GlobalStateContext)
  const { state, dispatch } = useAppState();
  
  // 4. Usar useState para estado local del Provider
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  
  // 5. Usar useEffect para cargar usuario al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
    }
  }, [dispatch]);
  
  // 6. Crear funciones que usan el estado
  const login = async (email, password) => {
    setAuthLoading(true);
    const userData = await authLogin(email, password);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    dispatch({ type: 'SET_CURRENT_USER', payload: userData });
    setAuthLoading(false);
    return userData;
  };
  
  const logout = async () => {
    await authLogout();
    localStorage.removeItem('currentUser');
    dispatch({ type: 'LOGOUT' });
  };
  
  // 7. Crear el value con todo lo que se quiere compartir
  const value = {
    user: state.currentUser,
    loading: authLoading,
    error: authError,
    isAuthenticated: !!state.currentUser,
    login,
    logout,
    getUserRole: () => state.currentUser?.role
  };
  
  // 8. Retornar el Provider con children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 9. Custom Hook para consumir
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
```

### Jerarquía de Providers en el Proyecto

**En Web (`apps/web/src/main.jsx`):**
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStateProvider>    {/* ← Provider externo (padre) */}
      <AuthProvider>          {/* ← Provider interno (hijo de GlobalStateProvider) */}
        <App />                {/* ← App (hijo de AuthProvider) */}
      </AuthProvider>
    </GlobalStateProvider>
  </React.StrictMode>
);
```

**En Mobile (`apps/mobile/App.jsx`):**
```jsx
export default function App() {
  return (
    <ErrorBoundary>
      <GlobalStateProvider>    {/* ← Provider externo */}
        <StatusBar style="auto" />
        <AppNavigator />        {/* ← No usa AuthProvider directamente */}
      </GlobalStateProvider>
    </ErrorBoundary>
  );
}
```

**¿Por qué este orden?**
- `AuthProvider` necesita `GlobalStateProvider` porque usa `useAppState()` internamente
- `App` puede usar ambos contextos
- Los Providers se pueden anidar (uno dentro de otro)

### Árbol de Componentes con Context

```
main.jsx
└── ReactDOM.createRoot()
    └── React.StrictMode
        └── GlobalStateProvider (Provider)
            └── AuthProvider (Provider, hijo de GlobalStateProvider)
                └── App (Componente, hijo de AuthProvider)
                    └── AppRouter
                        └── Routes
                            └── DashboardPage (puede usar useAppState() y useAuth())
                                └── RoleDashboard (puede usar useAppState() y useAuth())
                                    └── SolicitanteDashboard (puede usar useAppState() y useAuth())
```

**Todos los componentes dentro de los Providers pueden acceder a los Contexts:**
- `DashboardPage` puede usar `useAppState()` y `useAuth()`
- `RoleDashboard` puede usar `useAppState()` y `useAuth()`
- `SolicitanteDashboard` puede usar `useAppState()` y `useAuth()`
- Cualquier componente hijo puede usar los Contexts

### ¿Puede el Provider ser Padre de Otro Componente (no solo App)?

**Sí, el Provider puede envolver cualquier componente:**

```jsx
// Ejemplo 1: Provider solo para una sección
const DashboardPage = () => {
  return (
    <div>
      <Header />
      <MiProvider>        {/* ← Provider solo para esta sección */}
        <Content />
        <Sidebar />
      </MiProvider>
      <Footer />
    </div>
  );
};

// Ejemplo 2: Provider dentro de otro componente
const SolicitanteDashboard = () => {
  return (
    <MiProvider>          {/* ← Provider local */}
      <ServiceList />
      <CreateServiceButton />
    </MiProvider>
  );
};

// Ejemplo 3: Múltiples Providers
const App = () => {
  return (
    <Provider1>
      <Provider2>
        <Provider3>
          <Content />
        </Provider3>
      </Provider2>
    </Provider1>
  );
};
```

**En este proyecto:**
- `GlobalStateProvider` y `AuthProvider` envuelven toda la app (en `main.jsx`)
- Esto permite que **cualquier componente** acceda al estado global
- No necesitas pasar props manualmente

### Resumen: Cómo Funciona Context

**1. Creación:**
```jsx
const MiContext = createContext();
```

**2. Provider (Componente):**
```jsx
const MiProvider = ({ children }) => {
  // Lógica, hooks, estado
  const value = { /* datos */ };
  return (
    <MiContext.Provider value={value}>
      {children}
    </MiContext.Provider>
  );
};
```

**3. Consumo:**
```jsx
const MiComponente = () => {
  const datos = useContext(MiContext);
  // o
  const datos = useMiContext(); // Custom hook
};
```

**4. Uso:**
```jsx
<MiProvider>
  <MiComponente />  {/* Puede usar useContext */}
</MiProvider>
```

### Ventajas y Desventajas

**Ventajas:**
- ✅ Evita prop drilling
- ✅ Comparte datos globalmente
- ✅ Fácil de usar con hooks
- ✅ Puede usar cualquier hook dentro del Provider

**Desventajas:**
- ❌ Puede causar re-renders innecesarios si no se optimiza
- ❌ Más difícil de debuggear que props
- ❌ No reemplaza props para datos locales

**Cuándo usar Context:**
- ✅ Estado global (usuario, tema, idioma)
- ✅ Datos compartidos entre muchos componentes
- ✅ Cuando hay prop drilling

**Cuándo NO usar Context:**
- ❌ Datos que solo se usan en componentes cercanos (usa props)
- ❌ Datos que cambian frecuentemente (puede causar muchos re-renders)

---

## 📦 Props: Comunicación entre Componentes

### ¿Qué son las Props?

Props (properties) son datos que se pasan de un componente padre a un componente hijo.

### Props: Padre → Hijo

**Ejemplo Básico:**

```jsx
// Componente Padre
function App() {
  const nombre = 'Juan';
  return <Saludo nombre={nombre} />;
}

// Componente Hijo
function Saludo({ nombre }) {
  return <h1>Hola, {nombre}!</h1>;
}
```

**Ejemplo Real del Proyecto:**

**`apps/web/src/pages/DashboardPage.jsx`:**

```jsx
const DashboardPage = () => {
  return (
    <div>
      <RoleDashboard />  {/* Pasa props implícitamente (usa Context) */}
    </div>
  );
};
```

**`apps/web/src/components/RoleDashboard.jsx`:**

```jsx
const RoleDashboard = () => {
  const { state } = useAppState(); // Obtiene datos del Context
  const userRole = state.currentUser?.role;
  
  // Renderiza según el rol
  if (userRole === 'Solicitante') {
    return <SolicitanteDashboard />;
  } else if (userRole === 'Proveedor de Servicio') {
    return <ProveedorServicioDashboard />;
  }
  // ...
};
```

### Props con Datos Explícitos

**Ejemplo del Proyecto:**

Aunque en este proyecto se usa mucho Context, también hay ejemplos de props:

```jsx
// Componente que recibe props
const ServiceCard = ({ service, onViewDetail }) => {
  return (
    <div>
      <h3>{service.title}</h3>
      <button onClick={() => onViewDetail(service.id)}>
        Ver detalle
      </button>
    </div>
  );
};

// Componente padre que pasa props
const ServiceList = () => {
  const navigate = useNavigate();
  
  const handleViewDetail = (serviceId) => {
    navigate(`/services/${serviceId}`);
  };
  
  return (
    <div>
      {services.map(service => (
        <ServiceCard 
          key={service.id}
          service={service}
          onViewDetail={handleViewDetail}
        />
      ))}
    </div>
  );
};
```

### Comunicación Hijo → Padre

**Problema:** Los props fluyen solo de padre a hijo. ¿Cómo comunica un hijo al padre?

**Solución:** Pasar funciones como props.

**Ejemplo:**

```jsx
// Componente Padre
function App() {
  const [count, setCount] = useState(0);
  
  // Función que se pasa al hijo
  const handleIncrement = () => {
    setCount(count + 1);
  };
  
  return <Contador onIncrement={handleIncrement} count={count} />;
}

// Componente Hijo
function Contador({ onIncrement, count }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Incrementar</button>
    </div>
  );
}
```

**Ejemplo Real del Proyecto:**

**`apps/web/src/components/Login.jsx`:**

```jsx
const Login = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      onLoginSuccess(); // Llama a la función del padre
    } catch (error) {
      // ...
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

**`apps/web/src/pages/LoginPage.jsx`:**

```jsx
const LoginPage = () => {
  const navigate = useNavigate();
  
  const handleLoginSuccess = () => {
    navigate('/dashboard'); // Redirige después del login
  };
  
  return <Login onLoginSuccess={handleLoginSuccess} />;
};
```

### Resumen: Props vs Context

| Método | Cuándo Usar | Ejemplo |
|--------|-------------|---------|
| **Props** | Datos específicos entre padre-hijo directo | `<Button onClick={handleClick} />` |
| **Context** | Datos compartidos en muchos componentes | Estado global, autenticación |

---

## 🔐 Proceso de Autenticación

### Flujo Completo de Autenticación

#### 1. **Usuario ingresa credenciales**

**Archivo:** `apps/web/src/components/Login.jsx` o `apps/mobile/src/screens/LoginScreen.jsx`

```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const email = 'solicitante@mail.com';
  const password = '123';
  
  // Llama a la función login del AuthContext
  await login(email, password);
};
```

#### 2. **AuthContext procesa el login**

**Archivo:** `packages/core-logic/src/context/AuthContext.jsx`

```jsx
const login = async (email, password) => {
  setAuthLoading(true);
  setAuthError(null);

  try {
    // Llama al servicio de autenticación
    const userData = await authLogin(email, password);
    
    // Guarda en localStorage (persistencia)
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Actualiza el estado global
    dispatch({ type: 'SET_CURRENT_USER', payload: userData });
    
    return userData;
  } catch (err) {
    setAuthError(err.message);
    throw err;
  } finally {
    setAuthLoading(false);
  }
};
```

#### 3. **AuthService valida las credenciales**

**Archivo:** `packages/core-logic/src/services/AuthService.js`

```jsx
export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Obtiene todos los usuarios (mock + registrados)
      const allUsers = getAllUsers();
      
      // Busca el usuario por email
      const user = allUsers.find(u => u.email === email);

      // Valida que exista
      if (!user) {
        reject(new Error('Credenciales inválidas'));
        return;
      }

      // Valida la contraseña
      if (user.password !== password) {
        reject(new Error('Credenciales inválidas'));
        return;
      }

      // Retorna el usuario completo (incluye role)
      resolve(user);
    }, 500); // Simula latencia de red
  });
};
```

#### 4. **AppReducer actualiza el estado**

**Archivo:** `packages/core-logic/src/context/AppReducer.js`

```jsx
case 'SET_CURRENT_USER':
  return {
    ...state,
    currentUser: action.payload  // Guarda el usuario en el estado global
  };
```

#### 5. **Redirección según el rol**

**Archivo:** `apps/web/src/pages/LoginPage.jsx`

```jsx
const handleLoginSuccess = () => {
  navigate('/dashboard'); // Redirige al dashboard
};
```

**Archivo:** `apps/web/src/pages/DashboardPage.jsx`

```jsx
const DashboardPage = () => {
  const { state } = useAppState();
  const userRole = state.currentUser?.role;
  
  // Renderiza dashboard según el rol
  if (userRole === 'Solicitante') {
    return <SolicitanteDashboard />;
  } else if (userRole === 'Proveedor de Servicio') {
    return <ProveedorServicioDashboard />;
  }
  // ...
};
```

### Persistencia de Sesión

**Al cargar la aplicación:**

**Archivo:** `packages/core-logic/src/context/AuthContext.jsx`

```jsx
useEffect(() => {
  // Carga el usuario guardado en localStorage al iniciar
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  }
}, [dispatch]);
```

**Flujo:**
1. Al montar `AuthProvider`, lee `localStorage`
2. Si hay un usuario guardado, lo carga en el estado global
3. El usuario permanece logueado al recargar la página

### Logout

**Archivo:** `packages/core-logic/src/context/AuthContext.jsx`

```jsx
const logout = async () => {
  setAuthLoading(true);
  try {
    await authLogout();
    
    // Elimina de localStorage
    localStorage.removeItem('currentUser');
    
    // Limpia el estado global
    dispatch({ type: 'LOGOUT' });
    setAuthError(null);
  } catch (err) {
    setAuthError(err.message);
  } finally {
    setAuthLoading(false);
  }
};
```

**AppReducer:**

```jsx
case 'LOGOUT':
  return {
    ...state,
    currentUser: null  // Limpia el usuario
  };
```

### Rutas Protegidas

**Archivo:** `apps/web/src/router/ProtectedRoute.jsx`

```jsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

**Uso en AppRouter:**

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

**¿Cómo funciona?**
1. `ProtectedRoute` verifica si el usuario está autenticado
2. Si no está autenticado, redirige a `/login`
3. Si está autenticado, renderiza el componente hijo

---

## 🧭 Manejo de Rutas: Web y Mobile

### ¿Qué es el Routing (Enrutamiento)?

El **routing** es el proceso de determinar qué componente o pantalla mostrar según la URL (en web) o la acción del usuario (en mobile). Es como un "mapa" que conecta diferentes "direcciones" con diferentes "páginas".

**En Web:** Las rutas se basan en URLs (ej: `/dashboard`, `/services/123`)
**En Mobile:** Las rutas se basan en una pila de pantallas (Stack Navigator)

### ⚠️ Diferencia Fundamental: Stack vs URLs

**IMPORTANTE:** La diferencia más importante entre web y mobile es cómo manejan la navegación:

#### **Mobile: Stack Navigator (Pila de Pantallas)**
- ✅ **SÍ usa un Stack** (pila de cartas)
- Las pantallas se apilan una sobre otra
- `navigation.navigate()` agrega una pantalla al stack
- `navigation.goBack()` quita la pantalla superior del stack
- No hay URLs, solo nombres de pantallas

#### **Web: BrowserRouter (URLs)**
- ❌ **NO usa un Stack**
- Basado en URLs del navegador (`/dashboard`, `/services/123`)
- `navigate('/dashboard')` cambia la URL
- El botón "atrás" del navegador usa el historial del navegador
- No hay stack de componentes, solo mapeo URL → componente

**Resumen:**
- **Mobile = Stack Navigator** (pila de pantallas)
- **Web = BrowserRouter** (rutas basadas en URLs)

### Diferencias Clave: Web vs Mobile

| Aspecto | Web (React Router) | Mobile (React Navigation) |
|---------|-------------------|---------------------------|
| **Librería** | React Router DOM v7 | React Navigation v7 |
| **Basado en** | URLs del navegador | Stack de pantallas |
| **Navegación** | `useNavigate()`, `<Link>`, `<Navigate>` | `navigation.navigate()`, `navigation.replace()` |
| **Historial** | History API del navegador | Stack interno de React Navigation |
| **Rutas protegidas** | `<ProtectedRoute>` wrapper | Lógica en `initialRouteName` |
| **Parámetros** | `useParams()` hook | `route.params` prop |
| **Volver atrás** | Botón del navegador | `navigation.goBack()` |

---

## 🌐 Manejo de Rutas en Web (React Router)

### ¿Qué es React Router?

**React Router** es la librería estándar para manejar navegación en aplicaciones React web. Permite crear aplicaciones de "una sola página" (SPA - Single Page Application) donde la URL cambia sin recargar la página completa.

### Componentes Principales de React Router

#### 1. **BrowserRouter**
Proporciona el contexto de navegación usando la History API del navegador.

```jsx
// apps/web/src/router/AppRouter.jsx
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  {/* Todas las rutas van aquí */}
</BrowserRouter>
```

**¿Qué hace?**
- Permite usar URLs limpias sin `#` (ej: `/dashboard` en lugar de `/#/dashboard`)
- Gestiona el historial del navegador
- Proporciona el contexto de navegación a todos los componentes hijos

#### 2. **Routes y Route**
Define las rutas de la aplicación.

```jsx
// apps/web/src/router/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';

<Routes>
  {/* Ruta pública - siempre accesible */}
  <Route path="/" element={<LandingPage />} />
  
  {/* Ruta pública - solo si NO estás autenticado */}
  <Route 
    path="/login" 
    element={
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    } 
  />
  
  {/* Ruta protegida - solo si estás autenticado */}
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } 
  />
  
  {/* Ruta dinámica - :id es un parámetro */}
  <Route 
    path="/services/:id" 
    element={
      <ProtectedRoute>
        <ServiceDetailPage />
      </ProtectedRoute>
    } 
  />
  
  {/* Ruta 404 - catch-all (debe ir al final) */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

**Estructura de una Ruta:**
- `path`: La URL que activa esta ruta (ej: `/dashboard`, `/services/:id`)
- `element`: El componente que se renderiza cuando la URL coincide
- `:id`: Parámetro dinámico (ej: `/services/123` → `id = "123"`)

### Rutas Públicas vs Protegidas

#### **PublicRoute** - Solo para usuarios NO autenticados

```jsx
// apps/web/src/router/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@core-logic/context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Si YA estás autenticado, redirige a dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Si NO estás autenticado, muestra la página
  return children;
};
```

**Uso:**
```jsx
<Route 
  path="/login" 
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  } 
/>
```

**¿Por qué es útil?**
- Evita que usuarios ya logueados vean la pantalla de login
- Mejora la experiencia de usuario

#### **ProtectedRoute** - Solo para usuarios autenticados

```jsx
// apps/web/src/router/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@core-logic/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Si NO estás autenticado, redirige a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si estás autenticado, muestra la página
  return children;
};
```

**Uso:**
```jsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

**¿Por qué es útil?**
- Protege rutas privadas
- Redirige automáticamente a login si no hay sesión

### Navegación en Web

#### 1. **useNavigate Hook** - Navegación programática

```jsx
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Limpiar sesión
    logout();
    
    // Navegar a login
    navigate('/login', { replace: true });
    // replace: true → Reemplaza la entrada del historial (no se puede volver atrás)
  };
  
  return (
    <button onClick={handleLogout}>Cerrar Sesión</button>
  );
};
```

**Métodos de `navigate()`:**
- `navigate('/dashboard')` → Navega a una ruta
- `navigate('/dashboard', { replace: true })` → Reemplaza la entrada actual del historial
- `navigate(-1)` → Va una página atrás
- `navigate(1)` → Va una página adelante

#### 2. **Link Component** - Navegación con enlaces

```jsx
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/services">Servicios</Link>
      <Link to="/services/123">Servicio #123</Link>
    </nav>
  );
};
```

**¿Qué hace?**
- Crea un enlace que navega sin recargar la página
- Equivalente a `<a href>` pero para React Router

#### 3. **Navigate Component** - Redirección automática

```jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Redirige automáticamente a /login
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

**¿Cuándo usar?**
- En componentes de protección de rutas
- Para redirecciones condicionales

### Parámetros de Ruta (URL Parameters)

#### Obtener parámetros de la URL

```jsx
// Ruta: /services/:id
// URL: /services/123

import { useParams } from 'react-router-dom';

const ServiceDetailPage = () => {
  // Obtiene los parámetros de la URL
  const { id } = useParams();
  // id = "123"
  
  return <div>Servicio ID: {id}</div>;
};
```

**Ejemplo del proyecto:**
```jsx
// apps/web/src/pages/ServiceDetailPage.jsx
import { useParams } from 'react-router-dom';

const ServiceDetailPage = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  
  // Busca el servicio con ese ID
  const service = services.find(s => s.id === id);
  
  return <div>{service.title}</div>;
};
```

### Rutas Definidas en el Proyecto

**Rutas Públicas:**
- `/` → `LandingPage` (siempre accesible)
- `/login` → `LoginPage` (solo si NO autenticado)
- `/signup` → `SignUpPage` (solo si NO autenticado)

**Rutas Protegidas:**
- `/dashboard` → `DashboardPage` (dashboard según rol)
- `/services/create` → `CreateServicePage` (crear servicio)
- `/supplies/create` → `CreateSupplyOfferPage` (crear oferta de insumos)
- `/services` → `ServicesListPage` (listado de servicios)
- `/services/:id` → `ServiceDetailPage` (detalle de servicio)

**Ruta 404:**
- `/*` → `NotFoundPage` (cualquier URL no reconocida)

### Flujo de Navegación en Web

```
1. Usuario escribe URL: /dashboard
   ↓
2. BrowserRouter detecta el cambio de URL
   ↓
3. Routes busca una coincidencia con las rutas definidas
   ↓
4. Encuentra: <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
   ↓
5. ProtectedRoute verifica autenticación
   ↓
6a. Si NO autenticado → <Navigate to="/login" /> (redirige)
6b. Si autenticado → Renderiza <DashboardPage />
   ↓
7. DashboardPage se renderiza y muestra el contenido
```

---

## 📱 Manejo de Rutas en Mobile (React Navigation)

### ¿Qué es React Navigation?

**React Navigation** es la librería estándar para manejar navegación en aplicaciones React Native. A diferencia de web (basado en URLs), mobile usa un **Stack Navigator** (pila de pantallas).

### Concepto: Stack Navigator

**Stack Navigator** funciona como una pila de cartas (LIFO - Last In, First Out):
- **Push**: Agregar una pantalla encima (navegar hacia adelante)
- **Pop**: Quitar la pantalla superior (volver atrás)
- **Replace**: Reemplazar la pantalla actual (no se puede volver atrás)

**¿Por qué se llama "Stack"?**
Porque funciona exactamente como una estructura de datos "pila" (stack):
- Solo puedes ver/operar con la pantalla superior
- Para ver una pantalla anterior, debes quitar las que están encima
- Las pantallas se apilan en orden (la última en entrar es la primera en salir)

```
Stack de Pantallas (como una pila de cartas):
┌─────────────┐
│ ServiceDetail│ ← Pantalla actual (top) - Última en entrar
├─────────────┤
│ ServiceList │ ← Segunda pantalla
├─────────────┤
│  Dashboard  │ ← Primera pantalla (base del stack)
└─────────────┘

Operaciones:
- navigate('ServiceDetail') → Agrega ServiceDetail al top (push)
- goBack() → Quita ServiceDetail del top (pop)
- replace('Login') → Reemplaza ServiceDetail con Login
```

### Componentes Principales de React Navigation

#### 1. **NavigationContainer**
Proporciona el contexto de navegación a toda la app.

```jsx
// apps/mobile/App.jsx
import { NavigationContainer } from '@react-navigation/native';

<NavigationContainer>
  {/* Todas las pantallas van aquí */}
</NavigationContainer>
```

**Equivalente a:** `BrowserRouter` en React Router (web)

#### 2. **createNativeStackNavigator**
Crea un Stack Navigator (pila de pantallas).

```jsx
// apps/mobile/App.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Crear el Stack Navigator
const Stack = createNativeStackNavigator();

// Usar el Stack Navigator
<Stack.Navigator 
  initialRouteName="Login"  // Pantalla inicial
  screenOptions={{ headerShown: false }}  // Ocultar header por defecto
>
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Dashboard" component={DashboardRouter} />
  <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
  <Stack.Screen name="ServiceList" component={ServiceListScreen} />
  <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
  <Stack.Screen name="QuoteForm" component={QuoteFormScreen} />
  <Stack.Screen name="SupplyOfferForm" component={SupplyOfferFormScreen} />
</Stack.Navigator>
```

**Estructura:**
- `Stack.Navigator`: Contenedor de todas las pantallas
- `Stack.Screen`: Define una pantalla individual
- `name`: Nombre único de la pantalla (usado para navegar)
- `component`: El componente de la pantalla
- `initialRouteName`: Pantalla que se muestra al iniciar

### Pantallas Definidas en el Proyecto

```jsx
// apps/mobile/App.jsx - AppNavigator
<Stack.Navigator initialRouteName={currentUser ? "Dashboard" : "Login"}>
  {/* Pantalla de Login - Primera si no estás autenticado */}
  <Stack.Screen name="Login" component={LoginScreen} />
  
  {/* Dashboard Router - Muestra dashboard según rol */}
  <Stack.Screen name="Dashboard" component={DashboardRouter} />
  
  {/* Crear nuevo servicio (Rol: Solicitante) */}
  <Stack.Screen name="ServiceForm" component={ServiceFormScreen} />
  
  {/* Lista de servicios (Rol: Proveedor de Servicio) */}
  <Stack.Screen name="ServiceList" component={ServiceListScreen} />
  
  {/* Detalle de servicio (todos los roles) */}
  <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
  
  {/* Formulario de cotización (Rol: Proveedor de Servicio) */}
  <Stack.Screen name="QuoteForm" component={QuoteFormScreen} />
  
  {/* Formulario de oferta de insumos (Rol: Proveedor de Insumos) */}
  <Stack.Screen name="SupplyOfferForm" component={SupplyOfferFormScreen} />
</Stack.Navigator>
```

### Navegación en Mobile

#### 1. **navigation.navigate()** - Navegar a una pantalla

```jsx
// apps/mobile/src/screens/SolicitanteDashboard.jsx
const SolicitanteDashboard = ({ navigation }) => {
  const handleCreateService = () => {
    // Navega a ServiceForm
    navigation.navigate('ServiceForm');
  };
  
  return (
    <TouchableOpacity onPress={handleCreateService}>
      <Text>Crear Servicio</Text>
    </TouchableOpacity>
  );
};
```

**¿Qué hace?**
- Agrega una nueva pantalla al stack
- Puedes volver atrás con el botón "atrás" del dispositivo

#### 2. **navigation.navigate() con parámetros** - Pasar datos

```jsx
// apps/mobile/src/screens/ServiceListScreen.jsx
const ServiceListScreen = ({ navigation }) => {
  const handleServicePress = (serviceId) => {
    // Navega a ServiceDetail y pasa el serviceId como parámetro
    navigation.navigate('ServiceDetail', { serviceId: serviceId });
  };
  
  return (
    <TouchableOpacity onPress={() => handleServicePress(service.id)}>
      <Text>{service.title}</Text>
    </TouchableOpacity>
  );
};
```

**Recibir parámetros:**
```jsx
// apps/mobile/src/screens/ServiceDetailScreen.jsx
const ServiceDetailScreen = ({ route, navigation }) => {
  // Obtiene los parámetros pasados en navigation.navigate()
  const { serviceId } = route.params;
  // serviceId = el valor pasado en navigation.navigate('ServiceDetail', { serviceId: ... })
  
  return <Text>Servicio ID: {serviceId}</Text>;
};
```

#### 3. **navigation.replace()** - Reemplazar pantalla actual

```jsx
// apps/mobile/src/screens/LoginScreen.jsx
const LoginScreen = ({ navigation }) => {
  useEffect(() => {
    if (currentUser) {
      // Reemplaza Login con Dashboard (no se puede volver atrás)
      navigation.replace('Dashboard');
    }
  }, [currentUser]);
  
  // ...
};
```

**¿Cuándo usar?**
- Después de login (no tiene sentido volver a Login)
- Después de logout (no tiene sentido volver al Dashboard)
- Cuando quieres "resetear" el stack de navegación

**Ejemplo del proyecto:**
```jsx
// apps/mobile/src/screens/DashboardRouter.jsx
const handleLogout = () => {
  dispatch({ type: 'SET_CURRENT_USER', payload: null });
  // Reemplaza Dashboard con Login
  navigation.replace('Login');
};
```

#### 4. **navigation.goBack()** - Volver atrás

```jsx
// apps/mobile/src/screens/ServiceDetailScreen.jsx
const ServiceDetailScreen = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Text>Volver</Text>
    </TouchableOpacity>
  );
};
```

**¿Qué hace?**
- Quita la pantalla actual del stack
- Vuelve a la pantalla anterior

### Ejemplos de Navegación en el Proyecto

#### Ejemplo 1: Navegar desde Dashboard a ServiceForm

```jsx
// apps/mobile/src/screens/SolicitanteDashboard.jsx
const SolicitanteDashboard = ({ navigation }) => {
  const handleCreateService = () => {
    // Navega a ServiceForm
    navigation.navigate('ServiceForm');
  };
  
  return (
    <TouchableOpacity onPress={handleCreateService}>
      <Text>Crear Nuevo Servicio</Text>
    </TouchableOpacity>
  );
};
```

**Flujo:**
```
Dashboard → [navigate('ServiceForm')] → ServiceForm
```

#### Ejemplo 2: Navegar con parámetros

```jsx
// apps/mobile/src/screens/ServiceListScreen.jsx
const ServiceListScreen = ({ navigation }) => {
  const handleServicePress = (service) => {
    // Navega a ServiceDetail y pasa el servicio completo
    navigation.navigate('ServiceDetail', { 
      serviceId: service.id,
      service: service  // Pasa el objeto completo
    });
  };
  
  return (
    <TouchableOpacity onPress={() => handleServicePress(service)}>
      <Text>{service.title}</Text>
    </TouchableOpacity>
  );
};
```

**Recibir en ServiceDetail:**
```jsx
// apps/mobile/src/screens/ServiceDetailScreen.jsx
const ServiceDetailScreen = ({ route, navigation }) => {
  const { serviceId, service } = route.params;
  
  return <Text>{service.title}</Text>;
};
```

#### Ejemplo 3: Navegación después de Login

```jsx
// apps/mobile/src/screens/LoginScreen.jsx
const LoginScreen = ({ navigation }) => {
  const handleLogin = async () => {
    const user = await login(email, password);
    
    if (user) {
      // Reemplaza Login con Dashboard
      navigation.replace('Dashboard');
    }
  };
  
  // También redirige automáticamente si ya estás autenticado
  useEffect(() => {
    if (currentUser) {
      navigation.replace('Dashboard');
    }
  }, [currentUser]);
  
  // ...
};
```

### Pantalla Inicial Dinámica

```jsx
// apps/mobile/App.jsx - AppNavigator
function AppNavigator() {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
        // Pantalla inicial según autenticación
        initialRouteName={currentUser ? "Dashboard" : "Login"}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardRouter} />
        {/* ... más pantallas ... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**¿Cómo funciona?**
- Si `currentUser` existe → Pantalla inicial: `Dashboard`
- Si `currentUser` es `null` → Pantalla inicial: `Login`

### Flujo de Navegación en Mobile

```
1. App inicia
   ↓
2. AppNavigator verifica currentUser
   ↓
3a. Si NO autenticado → initialRouteName="Login"
3b. Si autenticado → initialRouteName="Dashboard"
   ↓
4. Stack Navigator muestra la pantalla inicial
   ↓
5. Usuario interactúa (ej: presiona botón)
   ↓
6. navigation.navigate('ServiceForm') se ejecuta
   ↓
7. Stack Navigator agrega ServiceForm al stack
   ↓
8. ServiceForm se muestra (puede volver atrás)
```

### Comparación: Navegación Web vs Mobile

| Acción | Web (React Router) | Mobile (React Navigation) |
|--------|-------------------|---------------------------|
| **Navegar a una ruta** | `navigate('/dashboard')` | `navigation.navigate('Dashboard')` |
| **Reemplazar ruta actual** | `navigate('/login', { replace: true })` | `navigation.replace('Login')` |
| **Volver atrás** | `navigate(-1)` o botón del navegador | `navigation.goBack()` |
| **Pasar parámetros** | `navigate('/services/123')` (en URL) | `navigation.navigate('ServiceDetail', { serviceId: 123 })` |
| **Obtener parámetros** | `const { id } = useParams()` | `const { serviceId } = route.params` |
| **Verificar ruta actual** | `useLocation().pathname` | `navigation.getState()` |

### Resumen: Manejo de Rutas

**Web (React Router):**
- Basado en URLs del navegador
- Usa `BrowserRouter`, `Routes`, `Route`
- Navegación con `useNavigate()`, `<Link>`, `<Navigate>`
- Rutas protegidas con `<ProtectedRoute>` wrapper
- Parámetros en URL: `/services/:id`

**Mobile (React Navigation):**
- Basado en Stack Navigator (pila de pantallas)
- Usa `NavigationContainer`, `Stack.Navigator`, `Stack.Screen`
- Navegación con `navigation.navigate()`, `navigation.replace()`, `navigation.goBack()`
- Rutas protegidas con `initialRouteName` condicional
- Parámetros pasados como objeto: `navigation.navigate('Screen', { param: value })`

---

## 🔄 Flujo de Datos en la Aplicación

### Diagrama del Flujo de Datos

```
┌─────────────────────────────────────────────────────────┐
│                    APLICACIÓN                           │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐            │
│  │   Web App    │         │  Mobile App  │            │
│  │  (Vite)      │         │  (Expo)      │            │
│  └──────┬───────┘         └──────┬───────┘            │
│         │                        │                     │
│         └────────────┬───────────┘                     │
│                      │                                  │
│         ┌────────────▼────────────┐                     │
│         │   packages/core-logic  │                     │
│         │                         │                     │
│         │  ┌──────────────────┐  │                     │
│         │  │ GlobalStateContext│  │                     │
│         │  │  (Estado Global) │  │                     │
│         │  └────────┬─────────┘  │                     │
│         │           │              │                     │
│         │  ┌────────▼─────────┐  │                     │
│         │  │  AuthContext     │  │                     │
│         │  │  (Autenticación) │  │                     │
│         │  └────────┬─────────┘  │                     │
│         │           │              │                     │
│         │  ┌────────▼─────────┐  │                     │
│         │  │  AuthService     │  │                     │
│         │  │  (Lógica Login) │  │                     │
│         │  └─────────────────┘  │                     │
│         │                         │                     │
│         │  ┌──────────────────┐  │                     │
│         │  │  AppReducer      │  │                     │
│         │  │  (Modifica Estado)│  │                     │
│         │  └──────────────────┘  │                     │
│         └─────────────────────────┘                     │
│                      │                                  │
│         ┌────────────▼────────────┐                     │
│         │   localStorage (Web)     │                     │
│         │   AsyncStorage (Mobile)  │                     │
│         └──────────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

### Flujo de una Acción (Ejemplo: Crear Servicio)

#### 1. **Usuario llena el formulario**

**Archivo:** `apps/web/src/pages/CreateServicePage.jsx`

```jsx
const CreateServicePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    // ...
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // ... validaciones
    onCreateService(formData);
  };
};
```

#### 2. **Componente llama a dispatch**

```jsx
const { dispatch } = useAppState();

const onCreateService = (serviceData) => {
  const newService = {
    id: generateId(),
    ...serviceData,
    status: 'Publicado',
    solicitanteId: currentUser.id,
  };
  
  dispatch({ type: 'ADD_SERVICE', payload: newService });
};
```

#### 3. **AppReducer procesa la acción**

**Archivo:** `packages/core-logic/src/context/AppReducer.js`

```jsx
case 'ADD_SERVICE':
  return {
    ...state,
    services: [...state.services, action.payload]
  };
```

#### 4. **Estado global se actualiza**

- `state.services` ahora incluye el nuevo servicio
- Todos los componentes que usan `useAppState()` se re-renderizan automáticamente

#### 5. **Componentes se actualizan**

**Archivo:** `apps/web/src/pages/DashboardPage.jsx`

```jsx
const SolicitanteDashboard = () => {
  const { state } = useAppState();
  const myServices = state.services.filter(
    s => s.solicitanteId === state.currentUser.id
  );
  
  // Se re-renderiza automáticamente cuando state.services cambia
  return <div>{myServices.map(...)}</div>;
};
```

### Flujo de Autenticación (Resumen)

```
1. Usuario → Login.jsx (ingresa credenciales)
   ↓
2. Login.jsx → AuthContext.login()
   ↓
3. AuthContext → AuthService.login() (valida)
   ↓
4. AuthService → Retorna usuario o error
   ↓
5. AuthContext → dispatch('SET_CURRENT_USER', user)
   ↓
6. AppReducer → Actualiza state.currentUser
   ↓
7. Todos los componentes → Se re-renderizan
   ↓
8. ProtectedRoute → Permite acceso
   ↓
9. DashboardPage → Renderiza según rol
```

---

## 🗂️ Persistencia de Cotizaciones y Datos Clave

### Estructura base en el estado global

Las cotizaciones viven en **dos niveles** dentro del estado administrado por `GlobalStateContext`:

```58:64:packages/core-logic/src/data/initialState.js
export const initialState = {
  services: MOCK_SERVICES,
  users: MOCK_USERS,
  currentUser: null,
  quotes: [],
  supplyOffers: MOCK_SUPPLY_OFFERS
};
```

- Cada servicio (`state.services[n]`) contiene su propio arreglo `service.quotes`.
- `state.quotes` mantiene una lista plana para facilitar vistas globales (ej: dashboard del proveedor).
- En web la persistencia es en memoria; el usuario autenticado se guarda en `localStorage`, pero las cotizaciones viven en el contexto hasta que exista un backend real.

### Ciclo de vida de una cotización (crear, editar, eliminar)

```61:139:packages/core-logic/src/context/AppReducer.js
case 'ADD_QUOTE':
  return {
    ...state,
    services: state.services.map(service =>
      service.id === action.payload.serviceId
        ? {
            ...service,
            quotes: [...(service.quotes || []), action.payload.quote]
          }
        : service
    ),
    quotes: [...state.quotes, action.payload.quote]
  };

case 'UPDATE_QUOTE': {
  const { serviceId, quoteId, quote } = action.payload;
  return {
    ...state,
    services: state.services.map(service =>
      service.id === serviceId
        ? {
            ...service,
            quotes: service.quotes?.map(q =>
              q.id === quoteId ? { ...q, ...quote } : q
            ) || []
          }
        : service
    ),
    quotes: state.quotes.map(q =>
      q.id === quoteId ? { ...q, ...quote } : q
    )
  };
}

case 'DELETE_QUOTE': {
  const { serviceId, quoteId } = action.payload;
  return {
    ...state,
    services: state.services.map(service =>
      service.id === serviceId
        ? {
            ...service,
            quotes: service.quotes?.filter(q => q.id !== quoteId) || []
          }
        : service
    ),
    quotes: state.quotes.filter(q => q.id !== quoteId)
  };
}
```

- **Creación** (`ADD_QUOTE`): inserta la cotización dentro del servicio y la agrega al arreglo plano.
- **Actualización** (`UPDATE_QUOTE`): sincroniza ambos lugares para evitar inconsistencias.
- **Eliminación** (`DELETE_QUOTE`): limpia tanto el servicio como la colección global.

### Datos semilla y shape de cada cotización

```8:45:packages/core-logic/src/data/mockServices.js
{
  id: 's1',
  title: 'Reparación de Techo y Fachada',
  // ...
  quotes: [
    {
      id: 'q1',
      serviceId: 's1',
      serviceProviderId: 'u2',
      price: 1800,
      deadline: '2024-02-25',
      duration: 7,
      notes: 'Incluye materiales y mano de obra. Garantía de 12 meses.',
      createdAt: '2024-02-02T10:00:00.000Z'
    },
    // ...
  ],
  selectedQuoteId: null
}
```

- Las propiedades mínimas son `id`, `serviceId`, `serviceProviderId`, `price` y `createdAt`.
- `selectedQuoteId` en cada servicio permite marcar qué cotización ganó la licitación.

### ¿Qué pantallas consumen la data?

- `ServiceDetailPage` (web) deshabilita el comparador si no hay datos en `service.quotes`.

```370:379:apps/web/src/pages/ServiceDetailPage.jsx
{isSolicitante && (
  <div className="quotes-section solicitante-view">
    <div className="quotes-header">
      <h2>Cotizaciones recibidas</h2>
      <button
        type="button"
        className="btn-open-comparator"
        onClick={handleOpenComparator}
        disabled={!service.quotes || service.quotes.length === 0}
      >
        {service.status === 'En Evaluación' || showComparator
          ? 'Revisar comparador'
          : 'Comparar cotizaciones'}
      </button>
    </div>
    {/* ... */}
  </div>
)}
```

- `ServiceDetailScreen` (mobile) replica el flujo y muestra chips con el conteo (`service.quotes?.length`).
- `RoleDashboard` y `ProveedorServicioDashboard` filtran los servicios según `quote.serviceProviderId` para que cada proveedor vea solo sus envíos.

📌 **Próximo paso a futuro:** mover estas estructuras a una API/DB y persistir cotizaciones reales. Mientras tanto, todo queda en memoria compartida por el contexto.

---

## 🚧 Retos y Lecciones del Desarrollo

1. **Sincronizar tres roles con experiencias distintas.**  
   - Se diseñaron dashboards específicos en `apps/web/src/components/RoleDashboard.jsx` y `apps/mobile/src/screens/DashboardRouter.jsx`.  
   - Cada vista lee el mismo `state.services` pero filtra por rol, lo que obligó a pensar la estructura de datos con banderas (`status`, `selectedQuoteId`) comunes.

2. **Compartir lógica entre Web y Mobile sin backend.**  
   - Todo el dominio (contextos, reducer, mocks) vive en `packages/core-logic`.  
   - El desafío fue configurar alias y Metro/Vite para que ambos consumidores importaran `@core-logic/...` sin romper bundlers, tema descrito en la autocrítica de arquitectura.

3. **Persistencia parcial y consistencia.**  
   - Solo el usuario se guarda en `localStorage` (web) o en el polyfill/AsyncStorage (mobile).  
   - Para evitar pérdida de información sensible se documentó que las cotizaciones son mock y se actualizan únicamente en memoria hasta tener API.

4. **Paridad de funcionalidades (Comparador de cotizaciones).**  
   - Se replicó el componente `QuoteComparator` tanto en web como en mobile asegurando que el ordenamiento y la semántica fueran iguales para no generar discrepancias entre plataformas.

Lección clave: **el diseño previo de las estructuras de estado ahorra bugs** cuando la aplicación crece o se sincroniza entre plataformas.

---

## 🧩 Componente Destacado: QuoteComparator

El comparador es el núcleo del proceso de decisión del solicitante. Resume varios conceptos pedidos (props, hooks, comunicación padre ↔ hijo).

```9:158:apps/web/src/components/QuoteComparator.jsx
const QuoteComparator = ({
  quotes = [],
  getProviderName,
  users = [],
  onClose,
  selectedQuoteId,
  completedRatingLabel = null,
  serviceStatus = '',
}) => {
  const [sortOption, setSortOption] = useState('price');

  const sortedQuotes = useMemo(() => {
    const list = [...quotes];
    if (sortOption === 'duration') {
      return list.sort((a, b) => getDurationValue(a) - getDurationValue(b));
    }
    return list.sort((a, b) => a.price - b.price);
  }, [quotes, sortOption]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <div className="quote-comparator">
      {/* Tabla ordenada */}
    </div>
  );
};
```

Aspectos relevantes:

- **Props**: recibe `quotes`, `selectedQuoteId`, callbacks (`onClose`) y funciones (`getProviderName`). Son enviadas por el padre `ServiceDetailPage`, cumpliendo la comunicación padre → hijo.
- **Estado local (`useState`)**: `sortOption` guarda la métrica seleccionada por el usuario sin tocar el estado global.
- **Memorización (`useMemo`)**: evita resortear la lista en cada render cuando ni `quotes` ni `sortOption` cambian, optimizando tablas largas.
- **Render condicional**: muestra mensajes distintos si la lista está vacía, o si la cotización está seleccionada/completada.
- **Extensibilidad**: el mismo shape de props permite portar la lógica al componente mobile (`apps/mobile/src/components/QuoteComparator.jsx`) reutilizando la misma semántica de orden y labels.

---

## 📌 Checklist de Conceptos Solicitados

| Concepto | ¿Dónde se explica? | Recordatorio rápido |
|----------|--------------------|---------------------|
| JS/React Básico | [Conceptos Fundamentales](#conceptos-fundamentales-de-javascript-y-react) | Funciones flecha, destructuring, JSX como funciones que retornan UI. |
| Ciclo de vida | [Ciclo de Vida de Componentes](#ciclo-de-vida-de-componentes) | Montaje/actualización/desmontaje y cómo `useEffect` reemplaza a los métodos de clase. |
| Hooks (`useState`, `useEffect`) | [Hooks: useState y useEffect](#hooks-usestate-y-useeffect) | Ejemplos prácticos (contadores, carga de `localStorage`) e integración con Context. |
| React Context | [React Context](#react-context) | Creación de Provider, jerarquía de `<GlobalStateProvider>` + `<AuthProvider>` y custom hooks (`useAppState`). |
| Props padre ↔ hijo | [Props: Comunicación entre Componentes](#props-comunicación-entre-componentes) | Cómo pasar datos hacia abajo y funciones hacia arriba para que el hijo informe eventos al padre. |
| Autenticación | [Proceso de Autenticación](#proceso-de-autenticación) | Flujo login → AuthService → reducer → `ProtectedRoute`, con persistencia en `localStorage`. |
| React Native Routing vs Stack | [Manejo de Rutas: Web y Mobile](#manejo-de-rutas-web-y-mobile) y [React Native: Routing vs Stack](#react-native-routing-vs-stack-fiber-tree) | Diferencias entre `React Router` (URLs) y `createNativeStackNavigator` (pila de pantallas). |

Con estas referencias se cubren todos los puntos solicitados para la defensa y la documentación técnica.

---

## 📝 Resumen Ejecutivo

### Puntos Clave para Entender el Proyecto

1. **Arquitectura Monorepo**: Código compartido entre Web y Mobile en `packages/core-logic`
2. **Estado Global**: React Context + useReducer para manejar el estado de toda la app
3. **Autenticación**: Sistema de login con persistencia en localStorage
4. **Rutas Protegidas**: Solo usuarios autenticados pueden acceder a ciertas páginas
5. **Roles**: Tres tipos de usuarios con dashboards diferentes
6. **Tecnologías**: React 19, Vite (web), Expo (mobile), React Router (web), React Navigation (mobile)

### Archivos Clave para Revisar

#### **Web**
1. **`apps/web/src/main.jsx`** - Punto de entrada web
2. **`apps/web/src/App.jsx`** - Componente raíz web
3. **`apps/web/src/router/AppRouter.jsx`** - Configuración de rutas web
4. **`apps/web/src/pages/DashboardPage.jsx`** - Dashboard principal

#### **Mobile**
1. **`apps/mobile/index.js`** - Punto de entrada mobile
2. **`apps/mobile/App.jsx`** - Componente raíz mobile (navegación y ErrorBoundary)
3. **`apps/mobile/src/screens/DashboardRouter.jsx`** - Router de dashboards por rol
4. **`apps/mobile/src/screens/LoginScreen.jsx`** - Autenticación mobile
5. **`apps/mobile/metro.config.js`** - Configuración del bundler
6. **`apps/mobile/polyfills.js`** - Polyfill de localStorage

#### **Compartido (Core Logic)**
1. **`packages/core-logic/src/context/GlobalStateContext.jsx`** - Estado global
2. **`packages/core-logic/src/context/AuthContext.jsx`** - Autenticación
3. **`packages/core-logic/src/context/AppReducer.js`** - Lógica de actualización de estado
4. **`packages/core-logic/src/services/AuthService.js`** - Servicio de login
5. **`packages/core-logic/src/data/initialState.js`** - Estado inicial y usuarios mock

---

## 🎓 Conceptos para la Defensa

Esta sección cubre todos los conceptos fundamentales que debes entender para defender tu proyecto.

---

## 📚 Conceptos Básicos de JavaScript y React

### JavaScript ES6+ (Conceptos Clave)

#### 1. **Arrow Functions (Funciones Flecha)**
```javascript
// Función tradicional
function sumar(a, b) {
  return a + b;
}

// Arrow function
const sumar = (a, b) => a + b;

// En React, se usan mucho para callbacks
<button onClick={() => setCount(count + 1)}>Click</button>
```

#### 2. **Destructuring (Desestructuración)**
```javascript
// Desestructurar objetos
const { name, email } = user;
// Equivale a: const name = user.name; const email = user.email;

// Desestructurar arrays
const [first, second] = [1, 2];

// En React, se usa mucho con props
const MiComponente = ({ title, description }) => {
  return <div>{title}</div>;
};
```

#### 3. **Spread Operator (Operador de Propagación)**
```javascript
// Copiar arrays
const nuevoArray = [...arrayOriginal];

// Copiar objetos
const nuevoObjeto = { ...objetoOriginal, nuevaProp: 'valor' };

// En React, se usa para actualizar estado inmutably
setState({ ...state, nuevaProp: 'valor' });
```

#### 4. **Template Literals (Literales de Plantilla)**
```javascript
const nombre = 'Juan';
const mensaje = `Hola, ${nombre}!`; // "Hola, Juan!"
```

#### 5. **Modules (Módulos ES6)**
```javascript
// Exportar
export const miFuncion = () => {};
export default MiComponente;

// Importar
import MiComponente from './MiComponente';
import { miFuncion } from './utils';
```

### React (Conceptos Fundamentales)

#### 1. **Componente = Función que Retorna JSX**
```jsx
// Un componente es simplemente una función
function MiComponente() {
  return <div>Hola Mundo</div>;
}

// O con arrow function
const MiComponente = () => {
  return <div>Hola Mundo</div>;
};

// Los parámetros de la función son las PROPS
const MiComponente = (props) => {
  return <div>{props.titulo}</div>;
};

// O con destructuring
const MiComponente = ({ titulo, descripcion }) => {
  return (
    <div>
      <h1>{titulo}</h1>
      <p>{descripcion}</p>
    </div>
  );
};
```

#### 2. **JSX (JavaScript XML)**
```jsx
// JSX es una sintaxis que parece HTML pero es JavaScript
const elemento = <h1>Hola, Mundo!</h1>;

// Se transpila a:
const elemento = React.createElement('h1', null, 'Hola, Mundo!');

// Puedes usar expresiones JavaScript dentro de JSX
const nombre = 'Juan';
const elemento = <h1>Hola, {nombre}!</h1>;
```

---

## 🔄 Ciclo de Vida de un Componente (Detallado)

### ¿Qué es el Ciclo de Vida?

El ciclo de vida de un componente React son las **tres fases principales** por las que pasa desde que se crea hasta que se destruye:

1. **Mounting (Montaje)** - El componente se crea y se inserta en el DOM
2. **Updating (Actualización)** - El componente se actualiza cuando cambian props o estado
3. **Unmounting (Desmontaje)** - El componente se elimina del DOM

### Fase 1: Mounting (Montaje)

**¿Qué pasa cuando un componente se monta?**

```jsx
const MiComponente = () => {
  // 1. Se ejecuta el código del componente (se crea la función)
  const [count, setCount] = useState(0); // 2. Se inicializa el estado
  
  // 3. useEffect con [] se ejecuta DESPUÉS del primer render
  useEffect(() => {
    console.log('Componente montado');
    // Ideal para: llamadas a API, suscripciones, leer localStorage
  }, []); // Array vacío = solo al montar
  
  // 4. Se renderiza el JSX
  return <div>{count}</div>;
};
```

**Flujo de Montaje:**
```
1. React crea el componente (ejecuta la función)
   ↓
2. Se inicializan los hooks (useState, useEffect, etc.)
   ↓
3. Se renderiza el JSX (primera vez)
   ↓
4. React inserta el componente en el DOM (Virtual DOM → Real DOM)
   ↓
5. useEffect con [] se ejecuta (si existe)
```

### Fase 2: Updating (Actualización)

**¿Qué pasa cuando cambia el estado o las props?**

```jsx
const MiComponente = ({ nombre }) => {
  const [count, setCount] = useState(0);
  
  // Se ejecuta cuando count o nombre cambian
  useEffect(() => {
    console.log('Componente actualizado:', count, nombre);
  }, [count, nombre]); // Array con dependencias
  
  return (
    <div>
      <p>{nombre}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
};
```

**Flujo de Actualización:**
```
1. Cambia el estado (setCount) o las props (nombre)
   ↓
2. React detecta el cambio
   ↓
3. React re-renderiza el componente (ejecuta la función de nuevo)
   ↓
4. React compara el nuevo JSX con el anterior (Virtual DOM diffing)
   ↓
5. React actualiza solo lo que cambió en el DOM real
   ↓
6. useEffect se ejecuta si las dependencias cambiaron
```

**¿Qué pasa si cambio el estado del componente?**

```jsx
const MiComponente = () => {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1); // ← Cambia el estado
    // React NO actualiza inmediatamente
    // React programa una actualización
  };
  
  // Después de setCount, React:
  // 1. Marca el componente para re-renderizar
  // 2. Ejecuta la función del componente de nuevo
  // 3. Compara el nuevo JSX con el anterior
  // 4. Actualiza solo lo que cambió en el DOM
  
  return <div>{count}</div>;
};
```

### Fase 3: Unmounting (Desmontaje)

**¿Qué pasa cuando un componente se desmonta?**

```jsx
const MiComponente = () => {
  useEffect(() => {
    // Código que se ejecuta al montar
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    // Cleanup function: se ejecuta al desmontar
    return () => {
      clearInterval(timer); // Limpia el timer
      console.log('Componente desmontado');
    };
  }, []);
  
  return <div>Mi Componente</div>;
};
```

**Flujo de Desmontaje:**
```
1. El componente se va a eliminar (navegación, condición, etc.)
   ↓
2. React ejecuta la función de cleanup de useEffect (si existe)
   ↓
3. React elimina el componente del DOM
   ↓
4. El componente ya no existe en memoria
```

### Comparación: Clase Components vs Functional Components

| Fase | Clase Component | Functional Component (Hooks) |
|------|----------------|------------------------------|
| **Montaje** | `componentDidMount()` | `useEffect(() => {}, [])` |
| **Actualización** | `componentDidUpdate()` | `useEffect(() => {}, [deps])` |
| **Desmontaje** | `componentWillUnmount()` | `return () => {}` en useEffect |

---

## 🎣 Hooks: useState y useEffect (Detallado)

### useState - Estado Local

**¿Qué es?**
- Hook que permite agregar estado a un componente funcional
- Retorna un array con dos elementos: `[valor, setter]`

**Sintaxis:**
```jsx
const [estado, setEstado] = useState(valorInicial);
```

**Ejemplo Completo:**
```jsx
import { useState } from 'react';

const Contador = () => {
  // Inicializa count con 0
  const [count, setCount] = useState(0);
  
  // Función para incrementar
  const incrementar = () => {
    setCount(count + 1); // Actualiza el estado
    // React re-renderiza el componente automáticamente
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementar}>Incrementar</button>
    </div>
  );
};
```

**¿Cómo funciona internamente?**
1. `useState(0)` inicializa el estado con `0`
2. Retorna `[0, setCount]` donde `0` es el valor y `setCount` es la función setter
3. Cuando llamas `setCount(5)`, React:
   - Actualiza el estado interno
   - Marca el componente para re-renderizar
   - Ejecuta la función del componente de nuevo
   - Compara el nuevo JSX con el anterior
   - Actualiza solo lo que cambió en el DOM

**Múltiples Estados:**
```jsx
const Formulario = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState(0);
  
  // Cada useState es independiente
  return (
    <form>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={edad} onChange={(e) => setEdad(e.target.value)} />
    </form>
  );
};
```

### useEffect - Efectos Secundarios

**¿Qué es?**
- Hook que permite ejecutar código **después del render**
- Reemplaza `componentDidMount`, `componentDidUpdate`, y `componentWillUnmount`
- **IMPORTANTE**: useEffect NO se ejecuta durante el render, se ejecuta DESPUÉS

**Sintaxis:**
```jsx
useEffect(
  () => {
    // Función que se ejecuta después del render
    // Puede retornar una función de cleanup (opcional)
    return () => {
      // Función de cleanup (opcional)
    };
  },
  [dependencias] // Array de dependencias
);
```

**useEffect recibe DOS parámetros:**
1. **Primer parámetro**: Una función que se ejecuta después del render
2. **Segundo parámetro**: Un array de dependencias que controla cuándo se ejecuta

**¿Cuándo se ejecuta useEffect?**

```
1. React renderiza el componente (ejecuta la función)
   ↓
2. React actualiza el DOM
   ↓
3. useEffect se ejecuta (DESPUÉS del render)
   ↓
4. Si hay cleanup, se ejecuta antes del próximo efecto o al desmontar
```

**Reglas del Array de Dependencias:**

#### 1. **Array Vacío `[]` - Se ejecuta SOLO en el Montaje**

```jsx
useEffect(() => {
  console.log('Solo se ejecuta UNA VEZ cuando el componente se monta');
  // Equivale a componentDidMount
}, []); // ← Array vacío = solo al montar
```

**¿Qué significa?**
- La función se ejecuta **una sola vez** cuando el componente se monta
- No se ejecuta en actualizaciones posteriores
- Ideal para: llamadas a API iniciales, leer localStorage, suscripciones

#### 2. **Array con Dependencias `[variable, estado, función]` - Se ejecuta cuando Cambian**

```jsx
const [count, setCount] = useState(0);
const [nombre, setNombre] = useState('');

useEffect(() => {
  console.log('Se ejecuta cuando count o nombre cambian');
  // Se ejecuta:
  // - Al montar (primera vez)
  // - Cada vez que count cambia
  // - Cada vez que nombre cambia
}, [count, nombre]); // ← Array con dependencias
```

**¿Qué significa?**
- La función se ejecuta:
  1. **Al montar** (primera vez)
  2. **Cada vez que una de las dependencias cambia** (count o nombre)
- Si `count` cambia → se ejecuta
- Si `nombre` cambia → se ejecuta
- Si ambos cambian → se ejecuta una sola vez (React agrupa las actualizaciones)

**Tipos de dependencias:**
- **Variables de estado**: `[count, nombre]`
- **Props**: `[props.userId]`
- **Valores calculados**: `[total, precio]`
- **Funciones**: `[handleSubmit]` (si la función cambia)

#### 3. **Sin Array (sin segundo parámetro) - Se ejecuta en CADA Render**

```jsx
useEffect(() => {
  console.log('Se ejecuta en CADA render');
  // ⚠️ CUIDADO: Puede causar loops infinitos si actualizas estado aquí
}); // ← Sin array = cada render
```

**¿Qué significa?**
- La función se ejecuta **después de cada render**
- ⚠️ **PELIGRO**: Si actualizas estado dentro, puede causar un loop infinito
- Raramente se usa

#### 4. **Array Vacío `[]` + Función Retornada = Cleanup en Unmount**

```jsx
useEffect(() => {
  // Función que se ejecuta al montar
  console.log('Componente montado');
  
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Función retornada = Cleanup
  // Se ejecuta cuando el componente se DESMONTA
  return () => {
    console.log('Componente desmontado - limpiando');
    clearInterval(timer); // Limpia el timer
  };
}, []); // ← Array vacío = solo al montar, cleanup al desmontar
```

**¿Qué significa?**
- **Array vacío `[]`**: La función principal se ejecuta solo al montar
- **Función retornada**: Se ejecuta cuando el componente se desmonta
- Equivale a `componentWillUnmount`
- Ideal para: limpiar timers, cancelar suscripciones, cerrar conexiones

#### 5. **Array con Dependencias + Función Retornada = Cleanup antes del Próximo Efecto**

```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log('Efecto ejecutado, count:', count);
  
  const timer = setTimeout(() => {
    console.log('Timer completado para count:', count);
  }, 1000);
  
  // Función retornada = Cleanup
  // Se ejecuta ANTES del próximo efecto o al desmontar
  return () => {
    console.log('Cleanup ejecutado, limpiando timer para count:', count);
    clearTimeout(timer);
  };
}, [count]); // ← Se ejecuta cuando count cambia
```

**¿Qué significa?**
- Cuando `count` cambia:
  1. **Primero** se ejecuta el cleanup del efecto anterior (si existe)
  2. **Luego** se ejecuta el nuevo efecto
- Al desmontar: se ejecuta el cleanup
- Ideal para: limpiar efectos anteriores antes de ejecutar nuevos

**Flujo Completo:**
```
count = 0 → useEffect ejecuta → timer inicia
count = 1 → cleanup (count=0) → useEffect ejecuta (count=1) → timer inicia
count = 2 → cleanup (count=1) → useEffect ejecuta (count=2) → timer inicia
desmontar → cleanup (count=2)
```

**Flujo de Ejecución:**
```jsx
const MiComponente = () => {
  const [count, setCount] = useState(0);
  
  console.log('1. Esto se ejecuta DURANTE el render');
  
  useEffect(() => {
    console.log('2. Esto se ejecuta DESPUÉS del render');
    // useEffect "viene y hace lo que tiene que hacer" después de que React
    // terminó de renderizar y actualizar el DOM
  }, [count]);
  
  console.log('3. Esto también se ejecuta DURANTE el render');
  
  return <div>{count}</div>;
};

// Salida en consola:
// 1. Esto se ejecuta DURANTE el render
// 3. Esto también se ejecuta DURANTE el render
// 2. Esto se ejecuta DESPUÉS del render
```

**Resumen de los 5 Casos de Uso:**

| Array de Dependencias | Función Retornada | Cuándo se Ejecuta |
|----------------------|-------------------|-------------------|
| `[]` (vacío) | ❌ No | Solo al montar (una vez) |
| `[]` (vacío) | ✅ Sí | Al montar + Cleanup al desmontar |
| `[deps]` (con dependencias) | ❌ No | Al montar + cuando dependencias cambian |
| `[deps]` (con dependencias) | ✅ Sí | Al montar + cuando dependencias cambian + Cleanup antes del próximo efecto |
| Sin array | ❌ No | En cada render (⚠️ peligroso) |

**Ejemplos Detallados:**

#### Caso 1: Array Vacío `[]` - Solo Montaje
```jsx
useEffect(() => {
  console.log('Solo se ejecuta UNA VEZ al montar');
  // Ideal para: llamadas a API iniciales, leer localStorage, suscripciones
}, []); // ← Array vacío = solo al montar
```

#### Caso 2: Array con Dependencias `[count, nombre]` - Cuando Cambian
```jsx
const [count, setCount] = useState(0);
const [nombre, setNombre] = useState('');

useEffect(() => {
  console.log('Se ejecuta cuando count o nombre cambian:', count, nombre);
  // Se ejecuta:
  // 1. Al montar (primera vez)
  // 2. Cada vez que count cambia
  // 3. Cada vez que nombre cambia
}, [count, nombre]); // ← Array con dependencias
```

#### Caso 3: Array Vacío `[]` + Función Retornada - Montaje y Unmount
```jsx
useEffect(() => {
  console.log('Componente montado');
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);
  
  // Función retornada = Cleanup
  // Se ejecuta SOLO cuando el componente se DESMONTA
  return () => {
    console.log('Componente desmontado - limpiando');
    clearInterval(timer);
  };
}, []); // ← Array vacío = solo al montar, cleanup solo al desmontar
```

#### Caso 4: Array con Dependencias `[count]` + Función Retornada - Con Cleanup
```jsx
const [count, setCount] = useState(0);

useEffect(() => {
  console.log('Efecto ejecutado para count:', count);
  const timer = setTimeout(() => {
    console.log('Timer para count:', count);
  }, 1000);
  
  // Función retornada = Cleanup
  // Se ejecuta ANTES del próximo efecto (cuando count cambia) o al desmontar
  return () => {
    console.log('Cleanup para count:', count);
    clearTimeout(timer);
  };
}, [count]); // ← Se ejecuta cuando count cambia

// Flujo:
// count = 0 → efecto ejecuta (count=0)
// count = 1 → cleanup (count=0) → efecto ejecuta (count=1)
// count = 2 → cleanup (count=1) → efecto ejecuta (count=2)
// desmontar → cleanup (count=2)
```

#### Caso 5: Sin Array - Cada Render (⚠️ Peligroso)
```jsx
useEffect(() => {
  console.log('Se ejecuta en CADA render');
  // ⚠️ CUIDADO: Si actualizas estado aquí, causa loop infinito
}); // ← Sin array = cada render
```

**Ejemplo Real del Proyecto:**
```jsx
// packages/core-logic/src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const { state, dispatch } = useAppState();
  
  // Se ejecuta solo al montar (una vez)
  // useEffect "viene" después de que AuthProvider se renderiza
  // y hace lo que tiene que hacer: cargar el usuario de localStorage
  useEffect(() => {
    // Carga el usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
    }
  }, [dispatch]); // dispatch no cambia, así que solo se ejecuta una vez
  
  return <>{children}</>;
};
```

### useMemo - Memoización de Valores

**¿Qué es?**
- Hook que **memoiza** (guarda en memoria) el resultado de un cálculo costoso
- Solo recalcula cuando las dependencias cambian
- **Optimización de rendimiento**: Evita cálculos innecesarios en cada render

**Sintaxis:**
```jsx
const valorMemoizado = useMemo(() => {
  // Cálculo costoso
  return resultado;
}, [dependencias]); // Solo recalcula si dependencias cambian
```

**Ejemplo Básico:**
```jsx
import { useState, useMemo } from 'react';

const ListaNumeros = ({ numeros }) => {
  const [filter, setFilter] = useState('');
  
  // SIN useMemo: Se recalcula en CADA render (ineficiente)
  const numerosFiltrados = numeros.filter(n => n > 100);
  
  // CON useMemo: Solo se recalcula si 'numeros' cambia
  const numerosFiltradosMemo = useMemo(() => {
    console.log('Recalculando...'); // Solo se ejecuta cuando numeros cambia
    return numeros.filter(n => n > 100);
  }, [numeros]);
  
  return (
    <div>
      {numerosFiltradosMemo.map(n => <div key={n}>{n}</div>)}
    </div>
  );
};
```

**Ejemplo Real del Proyecto:**
```jsx
// apps/web/src/components/ServiceList.jsx
const ServiceList = () => {
  const { state } = useAppState();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  
  // useMemo: Solo recalcula servicios filtrados si state.services o filtros cambian
  const serviciosFiltrados = useMemo(() => {
    return state.services.filter(service => {
      const matchCategory = !categoryFilter || service.category === categoryFilter;
      const matchLocation = !locationFilter || service.location === locationFilter;
      return matchCategory && matchLocation;
    });
  }, [state.services, categoryFilter, locationFilter]);
  
  // Si cambia otro estado (como searchQuery), NO recalcula serviciosFiltrados
  // Esto mejora el rendimiento
  
  return (
    <div>
      {serviciosFiltrados.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};
```

**¿Cuándo usar useMemo?**
- ✅ Cálculos costosos (filtros complejos, transformaciones de arrays grandes)
- ✅ Cuando el cálculo depende de props/estado que no cambian frecuentemente
- ❌ NO usar para cálculos simples (más overhead que beneficio)
- ❌ NO usar para valores primitivos simples

**Comparación:**
```jsx
// SIN useMemo - Se recalcula en cada render
const Componente = ({ items }) => {
  const itemsFiltrados = items.filter(item => item.active); // Se ejecuta siempre
  return <div>{itemsFiltrados.length}</div>;
};

// CON useMemo - Solo se recalcula si items cambia
const Componente = ({ items }) => {
  const itemsFiltrados = useMemo(
    () => items.filter(item => item.active),
    [items] // Solo recalcula si items cambia
  );
  return <div>{itemsFiltrados.length}</div>;
};
```

---

## 🔗 Props: Componente Padre a Hijo y Viceversa

### ¿Qué son las Props?

**Props = Propiedades = Parámetros de la Función del Componente**

```jsx
// Un componente es una función
// Los props son los parámetros de esa función
const MiComponente = (props) => {
  // props es un objeto con todas las propiedades pasadas
  return <div>{props.titulo}</div>;
};

// O con destructuring (más común)
const MiComponente = ({ titulo, descripcion }) => {
  // titulo y descripcion son props
  return (
    <div>
      <h1>{titulo}</h1>
      <p>{descripcion}</p>
    </div>
  );
};
```

**Características de las Props:**
1. **Inmutables**: El hijo NO puede modificar las props directamente
2. **Unidireccionales**: Fluyen de padre → hijo (no al revés)
3. **Read-only**: El hijo solo puede leerlas, no cambiarlas
4. **Pueden ser cualquier tipo**: strings, números, objetos, arrays, funciones, componentes

### Props: Comunicación Padre → Hijo

**¿Qué son las Props?**
- Props (propiedades) son datos que un componente padre pasa a un componente hijo
- Son **inmutables** (el hijo no puede modificarlas directamente)
- Son los **parámetros de la función** del componente

**Ejemplo:**
```jsx
// Componente PADRE
const App = () => {
  const titulo = 'Mi Título';
  const descripcion = 'Mi Descripción';
  
  // Pasa props al componente hijo
  return (
    <MiComponente 
      titulo={titulo} 
      descripcion={descripcion}
      edad={25}
    />
  );
};

// Componente HIJO (recibe props como parámetros)
const MiComponente = ({ titulo, descripcion, edad }) => {
  // Usa las props recibidas
  return (
    <div>
      <h1>{titulo}</h1>
      <p>{descripcion}</p>
      <p>Edad: {edad}</p>
    </div>
  );
};
```

**Ejemplo Real del Proyecto:**
```jsx
// apps/web/src/pages/DashboardPage.jsx (PADRE)
const DashboardPage = () => {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  
  // Pasa currentUser como prop a RoleDashboard
  return <RoleDashboard currentUser={currentUser} />;
};

// apps/web/src/components/RoleDashboard.jsx (HIJO)
const RoleDashboard = ({ currentUser }) => {
  // Usa la prop recibida
  const userRole = currentUser?.role;
  
  switch (userRole) {
    case 'Solicitante':
      return <SolicitanteDashboard />;
    // ...
  }
};
```

### Comunicación Hijo → Padre

**¿Cómo comunica un hijo al padre?**
- El padre pasa una **función** como prop al hijo
- El hijo llama esa función cuando necesita comunicarse

**Ejemplo:**
```jsx
// Componente PADRE
const App = () => {
  const [mensaje, setMensaje] = useState('');
  
  // Función que el hijo puede llamar
  const handleMensajeDelHijo = (texto) => {
    setMensaje(texto);
    console.log('El hijo dijo:', texto);
  };
  
  // Pasa la función como prop
  return (
    <div>
      <p>Mensaje del hijo: {mensaje}</p>
      <ComponenteHijo onMensaje={handleMensajeDelHijo} />
    </div>
  );
};

// Componente HIJO
const ComponenteHijo = ({ onMensaje }) => {
  const handleClick = () => {
    // Llama la función del padre
    onMensaje('Hola desde el hijo!');
  };
  
  return <button onClick={handleClick}>Enviar Mensaje al Padre</button>;
};
```

**Ejemplo Real del Proyecto:**
```jsx
// apps/web/src/pages/DashboardPage.jsx (PADRE)
const DashboardPage = () => {
  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    navigate('/login');
  };
  
  // Pasa handleLogout como prop
  return <RoleDashboard onLogout={handleLogout} />;
};

// apps/web/src/components/RoleDashboard.jsx (HIJO)
const RoleDashboard = ({ onLogout }) => {
  return (
    <div>
      <button onClick={onLogout}>Cerrar Sesión</button>
      {/* Al hacer click, ejecuta la función del padre */}
    </div>
  );
};
```

### Tipos de Props

**1. Props de Datos (Strings, Números, Objetos, Arrays)**
```jsx
<MiComponente 
  titulo="Mi Título"
  edad={25}
  usuario={{ name: 'Juan', email: 'juan@email.com' }}
  items={[1, 2, 3]}
/>
```

**2. Props de Funciones (Callbacks)**
```jsx
<MiComponente 
  onClick={() => console.log('clicked')}
  onSubmit={handleSubmit}
/>
```

**3. Props de Componentes (Children)**
```jsx
<MiComponente>
  <p>Este es el children</p>
  <button>Click</button>
</MiComponente>

// Dentro de MiComponente:
const MiComponente = ({ children }) => {
  return <div>{children}</div>; // Renderiza <p> y <button>
};
```

**4. Props Condicionales**
```jsx
<MiComponente 
  {...(condicion && { propExtra: 'valor' })}
/>
```

### Resumen: Flujo de Props

```
┌─────────────────┐
│  Componente     │
│     PADRE       │
│                 │
│  [Estado]       │
│     ↓           │
│  Pasa Props     │
└────────┬────────┘
         │
         │ props={datos}
         │ onAction={función}
         ↓
┌────────┴────────┐
│  Componente     │
│     HIJO        │
│                 │
│  Recibe Props   │
│  Usa datos      │
│  Llama función  │
└─────────────────┘
```

---

## 🧩 Composición de Componentes

### ¿Qué es la Composición?

**Composición** = Construir componentes complejos combinando componentes más simples

**Principio**: "Composición sobre Herencia"
- En lugar de crear componentes grandes y complejos
- Creas componentes pequeños y reutilizables
- Los combinas para crear componentes más complejos

### Ejemplo Básico de Composición

```jsx
// Componentes pequeños y simples
const Boton = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);

const Titulo = ({ children }) => (
  <h1>{children}</h1>
);

const Contenedor = ({ children }) => (
  <div className="container">{children}</div>
);

// Composición: Combinar componentes simples
const MiPagina = () => {
  return (
    <Contenedor>
      <Titulo>Mi Página</Titulo>
      <Boton onClick={() => alert('Click!')}>
        Hacer Click
      </Boton>
    </Contenedor>
  );
};
```

### Composición con Children

**Children = Contenido que se pasa entre las etiquetas**

```jsx
// Componente que acepta children
const Card = ({ title, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">
        {children} {/* Renderiza lo que se pasa entre <Card>...</Card> */}
      </div>
    </div>
  );
};

// Uso: Componer Card con diferentes contenidos
const App = () => {
  return (
    <Card title="Usuario">
      <p>Nombre: Juan</p>
      <p>Email: juan@email.com</p>
    </Card>
  );
};
```

### Ejemplo Real del Proyecto: Composición

```jsx
// apps/web/src/pages/DashboardPage.jsx
const DashboardPage = () => {
  return (
    <div>
      <Header /> {/* Componente compuesto */}
      <RoleDashboard /> {/* Componente compuesto */}
      <Footer /> {/* Componente compuesto */}
    </div>
  );
};

// RoleDashboard compone otros componentes
const RoleDashboard = ({ currentUser }) => {
  switch (currentUser.role) {
    case 'Solicitante':
      return (
        <SolicitanteDashboard> {/* Componente compuesto */}
          <ServiceList /> {/* Componente hijo */}
          <CreateServiceButton /> {/* Componente hijo */}
        </SolicitanteDashboard>
      );
    // ...
  }
};
```

### Ventajas de la Composición

1. **Reutilización**: Componentes pequeños se pueden usar en múltiples lugares
2. **Mantenibilidad**: Fácil de entender y modificar
3. **Flexibilidad**: Puedes combinar componentes de diferentes maneras
4. **Testabilidad**: Componentes pequeños son más fáciles de testear

### Patrones de Composición

**1. Containment (Contención)**
```jsx
const Dialog = ({ children }) => (
  <div className="dialog">
    {children} {/* Cualquier contenido */}
  </div>
);
```

**2. Specialization (Especialización)**
```jsx
// Componente genérico
const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

// Componente especializado (compone Button)
const DeleteButton = ({ onDelete }) => (
  <Button onClick={onDelete} className="delete">
    Eliminar
  </Button>
);
```

**3. Higher-Order Components (HOC)**
```jsx
// Componente que envuelve otro componente
const withAuth = (Component) => {
  return (props) => {
    const { currentUser } = useAppState();
    if (!currentUser) return <Navigate to="/login" />;
    return <Component {...props} />;
  };
};

// Uso
const ProtectedDashboard = withAuth(Dashboard);
```

---

## 🔐 Cómo Funciona un Proceso de Autenticación

### Flujo Completo de Autenticación

#### 1. **Usuario Ingresa Credenciales**

```jsx
// apps/web/src/components/Login.jsx
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); // Hook del AuthContext
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Llama al método login del contexto
    await login(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};
```

#### 2. **AuthContext Procesa el Login**

```jsx
// packages/core-logic/src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const { state, dispatch } = useAppState();
  
  const login = async (email, password) => {
    try {
      // Llama al servicio de autenticación
      const userData = await AuthService.login(email, password);
      
      // Guarda en localStorage (persistencia)
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Actualiza el estado global
      dispatch({ type: 'SET_CURRENT_USER', payload: userData });
      
      return userData;
    } catch (error) {
      throw error; // Propaga el error
    }
  };
  
  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 3. **AuthService Valida las Credenciales**

```jsx
// packages/core-logic/src/services/AuthService.js
export const login = async (email, password) => {
  // Busca el usuario en los datos mock
  const user = initialState.users.find(
    u => u.email === email && u.password === password
  );
  
  if (!user) {
    throw new Error('Credenciales inválidas');
  }
  
  // Retorna el usuario (sin la contraseña)
  const { password: _, ...userData } = user;
  return userData;
};
```

#### 4. **Estado Global se Actualiza**

```jsx
// packages/core-logic/src/context/AppReducer.js
case 'SET_CURRENT_USER':
  return {
    ...state,
    currentUser: action.payload // Actualiza el usuario actual
  };
```

#### 5. **Componentes se Re-renderizan**

```jsx
// apps/web/src/router/ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  
  // Si hay usuario, permite acceso
  if (currentUser) {
    return children;
  }
  
  // Si no hay usuario, redirige a login
  return <Navigate to="/login" replace />;
};
```

#### 6. **Persistencia: Cargar Usuario al Iniciar**

```jsx
// packages/core-logic/src/context/AuthContext.jsx
export const AuthProvider = ({ children }) => {
  const { state, dispatch } = useAppState();
  
  // Se ejecuta al montar el componente
  useEffect(() => {
    // Carga el usuario guardado en localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
    }
  }, [dispatch]);
  
  // ...
};
```

### Diagrama del Flujo de Autenticación

```
1. Usuario → Login.jsx (ingresa email/password)
   ↓
2. Login.jsx → AuthContext.login(email, password)
   ↓
3. AuthContext → AuthService.login(email, password)
   ↓
4. AuthService → Valida contra usuarios mock
   ↓
5. AuthService → Retorna usuario (o error)
   ↓
6. AuthContext → Guarda en localStorage
   ↓
7. AuthContext → dispatch('SET_CURRENT_USER', user)
   ↓
8. AppReducer → Actualiza state.currentUser
   ↓
9. Todos los componentes → Se re-renderizan
   ↓
10. ProtectedRoute → Detecta usuario → Permite acceso
   ↓
11. DashboardPage → Renderiza según rol
```

---

## 📱 React Native: Routing vs Stack, Fiber Tree

### React Native: Routing vs Stack Navigator

#### **Web: React Router (URL-based Routing)**

```jsx
// apps/web/src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</BrowserRouter>

// Navegación: Cambia la URL
navigate('/dashboard'); // URL cambia a /dashboard
```

**Características:**
- Basado en URLs (cada ruta tiene una URL)
- Puedes compartir URLs
- El botón "atrás" del navegador funciona
- Historial de navegación en el navegador

#### **Mobile: React Navigation (Stack Navigator)**

```jsx
// apps/mobile/App.jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Dashboard" component={DashboardRouter} />
    <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
  </Stack.Navigator>
</NavigationContainer>

// Navegación: Cambia la pantalla en el stack
navigation.navigate('Dashboard'); // Apila Dashboard sobre Login
```

**Características:**
- Basado en Stack (pila de pantallas)
- No hay URLs (es una app nativa)
- Gestos nativos (swipe back en iOS)
- Historial de navegación en el stack

### Stack Navigator: ¿Cómo Funciona?

**Stack = Pila de Pantallas**

```
┌─────────────────┐
│ ServiceDetail   │ ← Pantalla actual (top del stack)
├─────────────────┤
│ Dashboard       │
├─────────────────┤
│ Login           │ ← Primera pantalla (bottom del stack)
└─────────────────┘
```

**Operaciones:**
- `navigation.navigate('Dashboard')` → Apila Dashboard sobre Login
- `navigation.goBack()` → Desapila la pantalla actual
- `navigation.replace('Dashboard')` → Reemplaza la pantalla actual

**Ejemplo:**
```jsx
// LoginScreen
const LoginScreen = ({ navigation }) => {
  const handleLogin = () => {
    // Apila Dashboard sobre Login
    navigation.navigate('Dashboard');
  };
};

// DashboardRouter
const DashboardRouter = ({ navigation }) => {
  const handleViewService = (serviceId) => {
    // Apila ServiceDetail sobre Dashboard
    navigation.navigate('ServiceDetail', { serviceId });
  };
  
  const handleBack = () => {
    // Desapila ServiceDetail, vuelve a Dashboard
    navigation.goBack();
  };
};
```

### React Fiber Tree

**¿Qué es React Fiber?**
- Es el **motor de renderizado** de React
- Es un algoritmo que decide **cuándo y cómo** renderizar componentes
- Permite **interrupciones** y **priorización** de actualizaciones

**Fiber Tree = Árbol de Componentes**

```
        App
         │
    ┌────┴────┐
    │         │
GlobalState  AuthProvider
    │         │
    │    ┌────┴────┐
    │    │         │
    │  AppRouter  Login
    │    │
    │  Routes
    │    │
    │  DashboardPage
    │    │
    │  RoleDashboard
    │    │
    │  SolicitanteDashboard
```

**¿Cómo funciona?**
1. React crea un **Fiber Node** para cada componente
2. Cada Fiber Node contiene:
   - Referencia al componente
   - Props
   - Estado
   - Referencias a hijos y hermanos
3. React recorre el árbol (reconciliation)
4. Compara el árbol anterior con el nuevo (diffing)
5. Actualiza solo lo que cambió

**Fases del Renderizado:**
```
1. Render Phase (Fase de Renderizado)
   - React recorre el árbol
   - Crea/actualiza Fiber Nodes
   - NO modifica el DOM aún

2. Commit Phase (Fase de Commit)
   - React aplica los cambios al DOM
   - Ejecuta useEffect
   - Actualiza la UI visible
```

---

## 🔄 Reconciliación (Reconciliation)

### ¿Qué es la Reconciliación?

**Reconciliación** = Proceso por el cual React compara el árbol anterior con el nuevo y decide qué actualizar

**Objetivo**: Actualizar el DOM de la manera más eficiente posible

### Proceso de Reconciliación

```
1. Estado cambia (setState)
   ↓
2. React crea nuevo Virtual DOM Tree
   ↓
3. RECONCILIACIÓN: Compara árbol anterior vs nuevo
   ↓
4. Identifica qué cambió (diffing)
   ↓
5. Calcula las actualizaciones mínimas necesarias
   ↓
6. Aplica cambios al DOM real
```

### Algoritmo de Reconciliación

**React compara nodo por nodo:**

```jsx
// Árbol anterior
<div>
  <h1>Título</h1>
  <p>Texto</p>
</div>

// Árbol nuevo (después de setState)
<div>
  <h1>Título Nuevo</h1>  {/* Cambió el texto */}
  <p>Texto</p>            {/* No cambió */}
</div>

// React detecta:
// - El <div> es el mismo → No cambia
// - El <h1> es el mismo tipo → Solo actualiza el texto
// - El <p> es igual → No toca
```

### Reglas de Reconciliación

**1. Comparación por Tipo de Elemento**

```jsx
// Si el tipo cambia, React reemplaza TODO el subárbol
<div>
  <Counter />  {/* Componente Counter */}
</div>

// Cambia a:
<div>
  <Button />   {/* Tipo diferente → React desmonta Counter y monta Button */}
</div>
```

**2. Comparación por Props**

```jsx
// Props cambian → React actualiza solo las props
<Componente nombre="Juan" edad={25} />
// Cambia a:
<Componente nombre="María" edad={25} />
// React actualiza solo la prop 'nombre'
```

**3. Comparación por Key (en listas)**

```jsx
// SIN key: React no sabe qué elemento cambió
{items.map(item => <Item data={item} />)}

// CON key: React identifica cada elemento
{items.map(item => <Item key={item.id} data={item} />)}
```

### Ejemplo Detallado de Reconciliación

```jsx
const App = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Incrementar</button>
    </div>
  );
};

// Render inicial (count = 0):
// Virtual DOM: { type: 'div', children: [
//   { type: 'h1', children: ['Count: 0'] },
//   { type: 'button', children: ['Incrementar'] }
// ]}

// Usuario hace click → setCount(1)
// React crea nuevo Virtual DOM: { type: 'div', children: [
//   { type: 'h1', children: ['Count: 1'] },  ← Solo esto cambió
//   { type: 'button', children: ['Incrementar'] }  ← No cambió
// ]}

// Reconciliación:
// 1. Compara <div> → Mismo tipo, mismo → No cambia
// 2. Compara <h1> → Mismo tipo, pero children cambió → Actualiza solo el texto
// 3. Compara <button> → Mismo tipo, mismo → No toca

// Resultado: Solo actualiza el texto "Count: 0" → "Count: 1"
// NO re-renderiza el botón
```

### Optimizaciones de Reconciliación

**1. Batching (Agrupación)**
```jsx
// React agrupa múltiples setState en una sola actualización
setCount(1);
setName('Juan');
setEmail('juan@email.com');
// React hace UNA sola reconciliación, no tres
```

**2. Memoización**
```jsx
// React.memo evita re-render si props no cambian
const MiComponente = React.memo(({ nombre }) => {
  return <div>{nombre}</div>;
});

// Solo se re-renderiza si 'nombre' cambia
```

**3. Keys en Listas**
```jsx
// Con keys, React identifica qué elemento cambió
{items.map(item => (
  <Item key={item.id} data={item} />
))}
```

### Reconciliación vs Diffing

**Reconciliación** = Proceso completo de comparar y actualizar
**Diffing** = Algoritmo específico que compara dos árboles

```
Reconciliación
  ├── Diffing (comparar árboles)
  ├── Identificar cambios
  ├── Calcular actualizaciones mínimas
  └── Aplicar cambios al DOM
```

### Ejemplo Real del Proyecto

```jsx
// apps/web/src/components/ServiceList.jsx
const ServiceList = () => {
  const { state } = useAppState();
  const [filter, setFilter] = useState('');
  
  const serviciosFiltrados = state.services.filter(/* ... */);
  
  return (
    <div>
      {serviciosFiltrados.map(service => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
};

// Cuando state.services cambia:
// 1. React crea nuevo Virtual DOM
// 2. Reconciliación: Compara lista anterior vs nueva
// 3. Si service.id es igual → Reutiliza el componente ServiceCard
// 4. Si service.id es diferente → Desmonta viejo, monta nuevo
// 5. Solo actualiza los ServiceCard que cambiaron
```

---

## 🌳 Virtual DOM: Montaje, Update, Unmount

### ¿Qué es el Virtual DOM?

**Virtual DOM** = Representación en memoria del DOM real

```
┌─────────────────────────────────────┐
│         Virtual DOM                 │
│  (Objetos JavaScript en memoria)    │
│                                     │
│  {                                  │
│    type: 'div',                     │
│    props: { className: 'container' },│
│    children: [                       │
│      { type: 'h1', props: {...} }  │
│    ]                                 │
│  }                                  │
└─────────────────────────────────────┘
              ↓
         React compara
              ↓
┌─────────────────────────────────────┐
│         Real DOM                    │
│  (HTML en el navegador)             │
│                                     │
│  <div class="container">           │
│    <h1>...</h1>                    │
│  </div>                             │
└─────────────────────────────────────┘
```

### ¿Por qué Virtual DOM?

**Ventajas:**
1. **Rendimiento**: Comparar objetos JavaScript es más rápido que manipular el DOM
2. **Optimización**: React decide qué actualizar
3. **Batching**: Agrupa múltiples actualizaciones
4. **Diffing**: Solo actualiza lo que cambió

### Proceso: Montaje (Mount)

**¿Qué pasa cuando un componente se monta?**

```jsx
const MiComponente = () => {
  return <div><h1>Hola</h1></div>;
};

// React crea el Virtual DOM:
const virtualDOM = {
  type: 'div',
  props: {},
  children: [
    {
      type: 'h1',
      props: {},
      children: ['Hola']
    }
  ]
};

// React compara con el DOM real (no existe aún)
// React crea los elementos en el DOM real:
// <div><h1>Hola</h1></div>
```

**Flujo de Montaje:**
```
1. React crea Virtual DOM Node
   ↓
2. React compara con DOM real (no existe)
   ↓
3. React crea elementos en DOM real
   ↓
4. Componente está montado
```

### Proceso: Actualización (Update)

**¿Qué pasa cuando cambia el estado?**

```jsx
const MiComponente = () => {
  const [count, setCount] = useState(0);
  
  return <div><h1>Count: {count}</h1></div>;
};

// Estado inicial: count = 0
// Virtual DOM: { type: 'h1', children: ['Count: 0'] }
// Real DOM: <h1>Count: 0</h1>

// Usuario hace click → setCount(1)
// React crea nuevo Virtual DOM: { type: 'h1', children: ['Count: 1'] }
// React compara Virtual DOM anterior con nuevo (diffing)
// React detecta que solo cambió el texto
// React actualiza solo el texto en el DOM real: <h1>Count: 1</h1>
```

**Flujo de Actualización:**
```
1. Cambia el estado (setCount)
   ↓
2. React marca el componente para re-renderizar
   ↓
3. React crea nuevo Virtual DOM
   ↓
4. React compara Virtual DOM anterior con nuevo (diffing)
   ↓
5. React identifica qué cambió
   ↓
6. React actualiza solo lo que cambió en el DOM real
```

**Diffing Algorithm (Algoritmo de Comparación):**
- Compara nodo por nodo
- Si el tipo es igual → Actualiza props
- Si el tipo es diferente → Reemplaza el nodo completo
- Si hay keys → Compara por key

### Proceso: Desmontaje (Unmount)

**¿Qué pasa cuando un componente se desmonta?**

```jsx
const App = () => {
  const [show, setShow] = useState(true);
  
  return (
    <div>
      {show && <MiComponente />}
      <button onClick={() => setShow(false)}>Ocultar</button>
    </div>
  );
};

// Cuando show cambia a false:
// React elimina el Virtual DOM Node de MiComponente
// React elimina los elementos del DOM real
// React ejecuta cleanup de useEffect (si existe)
```

**Flujo de Desmontaje:**
```
1. Condición cambia (show = false)
   ↓
2. React elimina Virtual DOM Node
   ↓
3. React ejecuta cleanup de useEffect
   ↓
4. React elimina elementos del DOM real
   ↓
5. Componente está desmontado
```

### Resumen: Virtual DOM

| Fase | Virtual DOM | Real DOM | useEffect |
|------|-------------|----------|-----------|
| **Mount** | Se crea | Se crea | Se ejecuta (si [] está vacío) |
| **Update** | Se actualiza | Se actualiza (solo lo que cambió) | Se ejecuta (si dependencias cambiaron) |
| **Unmount** | Se elimina | Se elimina | Cleanup se ejecuta |

---

## 🎯 Preguntas Frecuentes para la Defensa

#### ¿Por qué React y no Vue o Angular?
- React tiene un ecosistema grande y maduro
- Facilita compartir código entre web y mobile (React Native)
- Gran comunidad y recursos disponibles
- Flexibilidad en la arquitectura

#### ¿Por qué no Next.js?
- Este proyecto es una SPA (Single Page Application)
- Next.js es para SSR/SSG que no necesitamos aquí
- Vite es más simple y rápido para SPAs
- No necesitamos SEO para esta aplicación

#### ¿Por qué CSS y no SCSS?
- Simplicidad para el MVP
- No requiere compilación adicional
- Fácil de entender para el equipo
- Suficiente para las necesidades actuales

#### ¿Por qué Context y no Redux?
- El proyecto es de tamaño medio
- Context es suficiente y más simple
- Redux sería overkill para este caso
- Menos boilerplate code

#### ¿Cómo funciona el estado global?
- `GlobalStateProvider` envuelve toda la app
- `useReducer` maneja las actualizaciones de estado
- `AppReducer` define las acciones posibles
- Cualquier componente puede acceder con `useAppState()`

#### ¿Cómo se comparte código entre web y mobile?
- Todo el código compartido está en `packages/core-logic`
- Web y mobile importan desde ahí usando alias (`@core-logic`)
- Solo la UI es diferente (web usa HTML/CSS, mobile usa componentes nativos)
- La lógica de negocio es idéntica

---

**Fin de la Documentación Técnica**

*Última actualización: 2024*

