# 📚 Documentación Técnica - MARKET DEL ESTE

## Marketplace de Insumos y Servicios - Guía Completa

---

## 📋 Índice

1. [Visión General del Proyecto](#visión-general-del-proyecto)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Inicialización del Proyecto](#inicialización-del-proyecto)
5. [Servidores y Entorno de Desarrollo](#servidores-y-entorno-de-desarrollo)
6. [Tecnologías Utilizadas](#tecnologías-utilizadas)
7. [Conceptos Fundamentales de JavaScript y React](#conceptos-fundamentales-de-javascript-y-react)
8. [Ciclo de Vida de Componentes](#ciclo-de-vida-de-componentes)
9. [Hooks: useState y useEffect](#hooks-usestate-y-useeffect)
10. [React Context](#react-context)
11. [Props: Comunicación entre Componentes](#props-comunicación-entre-componentes)
12. [Proceso de Autenticación](#proceso-de-autenticación)
13. [Flujo de Datos en la Aplicación](#flujo-de-datos-en-la-aplicación)

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

## 🔌 React Context

### ¿Qué es React Context?

Context es una forma de compartir datos entre componentes sin tener que pasar props manualmente en cada nivel (prop drilling).

### Problema que Resuelve: Prop Drilling

**Sin Context (Prop Drilling):**

```jsx
// App.jsx
function App() {
  const user = { name: 'Juan' };
  return <Header user={user} />;
}

// Header.jsx
function Header({ user }) {
  return <Navbar user={user} />;
}

// Navbar.jsx
function Navbar({ user }) {
  return <UserMenu user={user} />;
}

// UserMenu.jsx
function UserMenu({ user }) {
  return <div>{user.name}</div>;
}
```

**Con Context:**

```jsx
// 1. Crear el Context
const UserContext = createContext();

// 2. Crear el Provider
function App() {
  const user = { name: 'Juan' };
  return (
    <UserContext.Provider value={user}>
      <Header />
    </UserContext.Provider>
  );
}

// 3. Usar el Context en cualquier componente hijo
function UserMenu() {
  const user = useContext(UserContext);
  return <div>{user.name}</div>;
}
```

### Context en Este Proyecto

El proyecto usa **dos contextos principales**:

#### 1. **GlobalStateContext** - Estado Global de la Aplicación

**Ubicación:** `packages/core-logic/src/context/GlobalStateContext.jsx`

```jsx
// 1. Crear el Context
export const StateContext = createContext();

// 2. Crear el Provider
export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

// 3. Custom Hook para usar el Context
export const useAppState = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState debe usarse dentro de GlobalStateProvider');
  }
  return context;
};
```

**¿Qué contiene el estado global?**
- `services`: Lista de servicios publicados
- `users`: Lista de usuarios
- `currentUser`: Usuario autenticado actual
- `quotes`: Cotizaciones
- `supplyOffers`: Ofertas de insumos

**Uso en componentes:**

```jsx
import { useAppState } from '@core-logic/context/GlobalStateContext';

const MiComponente = () => {
  const { state, dispatch } = useAppState();
  
  // Acceder al estado
  const servicios = state.services;
  const usuarioActual = state.currentUser;
  
  // Modificar el estado
  dispatch({ type: 'ADD_SERVICE', payload: nuevoServicio });
  
  return <div>...</div>;
};
```

#### 2. **AuthContext** - Autenticación

**Ubicación:** `packages/core-logic/src/context/AuthContext.jsx`

```jsx
export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { state, dispatch } = useAppState(); // Usa GlobalStateContext internamente
  
  const login = async (email, password) => {
    // Lógica de login
    const userData = await authLogin(email, password);
    dispatch({ type: 'SET_CURRENT_USER', payload: userData });
    return userData;
  };

  const logout = async () => {
    await authLogout();
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    user: state.currentUser,
    loading: authLoading,
    error: authError,
    isAuthenticated: !!state.currentUser,
    login,
    logout,
    getUserRole: () => state.currentUser?.role
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Uso en componentes:**

```jsx
import { useAuth } from '@core-logic/context/AuthContext';

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  
  const handleLogin = async () => {
    await login(email, password);
  };
  
  return <div>...</div>;
};
```

### Jerarquía de Providers

**`apps/web/src/main.jsx`:**

```jsx
<GlobalStateProvider>    {/* Estado global */}
  <AuthProvider>          {/* Autenticación (usa GlobalStateProvider) */}
    <App />                {/* Aplicación */}
  </AuthProvider>
</GlobalStateProvider>
```

**¿Por qué este orden?**
- `AuthProvider` necesita `GlobalStateProvider` porque usa `useAppState()` internamente
- `App` puede usar ambos contextos

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

## 📝 Resumen Ejecutivo

### Puntos Clave para Entender el Proyecto

1. **Arquitectura Monorepo**: Código compartido entre Web y Mobile en `packages/core-logic`
2. **Estado Global**: React Context + useReducer para manejar el estado de toda la app
3. **Autenticación**: Sistema de login con persistencia en localStorage
4. **Rutas Protegidas**: Solo usuarios autenticados pueden acceder a ciertas páginas
5. **Roles**: Tres tipos de usuarios con dashboards diferentes
6. **Tecnologías**: React 19, Vite (web), Expo (mobile), React Router (web), React Navigation (mobile)

### Archivos Clave para Revisar

1. **`apps/web/src/main.jsx`** - Punto de entrada web
2. **`apps/mobile/index.js`** - Punto de entrada mobile
3. **`packages/core-logic/src/context/GlobalStateContext.jsx`** - Estado global
4. **`packages/core-logic/src/context/AuthContext.jsx`** - Autenticación
5. **`packages/core-logic/src/context/AppReducer.js`** - Lógica de actualización de estado
6. **`packages/core-logic/src/services/AuthService.js`** - Servicio de login
7. **`apps/web/src/router/AppRouter.jsx`** - Configuración de rutas web
8. **`apps/web/src/pages/DashboardPage.jsx`** - Dashboard principal

---

## 🎓 Conceptos para la Defensa

### Preguntas Frecuentes

#### ¿Por qué React y no Vue o Angular?
- React tiene un ecosistema grande
- Facilita compartir código entre web y mobile (React Native)
- Gran comunidad y recursos

#### ¿Por qué no Next.js?
- Este proyecto es una SPA (Single Page Application)
- Next.js es para SSR/SSG que no necesitamos aquí
- Vite es más simple y rápido para SPAs

#### ¿Por qué CSS y no SCSS?
- Simplicidad para el MVP
- No requiere compilación adicional
- Fácil de entender para el equipo

#### ¿Por qué Context y no Redux?
- El proyecto es de tamaño medio
- Context es suficiente y más simple
- Redux sería overkill para este caso

#### ¿Cómo funciona el estado global?
- `GlobalStateProvider` envuelve toda la app
- `useReducer` maneja las actualizaciones de estado
- `AppReducer` define las acciones posibles
- Cualquier componente puede acceder con `useAppState()`

#### ¿Cómo se comparte código entre web y mobile?
- Todo el código compartido está en `packages/core-logic`
- Web y mobile importan desde ahí usando alias (`@core-logic`)
- Solo la UI es diferente (web usa HTML/CSS, mobile usa componentes nativos)

---

**Fin de la Documentación Técnica**

*Última actualización: 2024*

