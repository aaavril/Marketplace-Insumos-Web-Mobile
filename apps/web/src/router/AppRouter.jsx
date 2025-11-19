/**
 * AppRouter.jsx - CONFIGURACIÓN DE RUTAS DE LA APLICACIÓN
 * 
 * Este archivo define todas las rutas (URLs) de la aplicación y qué componente
 * renderizar para cada ruta. Usa React Router DOM para manejar la navegación.
 * 
 * Tipos de rutas:
 * 1. Rutas públicas: Accesibles sin autenticación (/, /login, /signup)
 * 2. Rutas protegidas: Requieren autenticación (/dashboard, /services, etc.)
 * 3. Ruta 404: Se muestra cuando la URL no coincide con ninguna ruta
 * 
 * Cómo funciona:
 * - BrowserRouter: Proporciona el contexto de navegación a toda la app
 * - Routes: Contenedor de todas las rutas definidas
 * - Route: Define una ruta específica (path) y qué componente renderizar (element)
 * - ProtectedRoute/PublicRoute: Componentes wrapper que verifican autenticación
 * 
 * Flujo de navegación:
 * Usuario visita URL → React Router busca coincidencia → Renderiza el componente correspondiente
 */

// React Router DOM: Librería para navegación en aplicaciones React web
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes wrapper para controlar acceso a rutas según autenticación
import PublicRoute from './PublicRoute';      // Rutas que solo se ven si NO estás autenticado
import ProtectedRoute from './ProtectedRoute'; // Rutas que solo se ven si estás autenticado

// Importar todas las páginas de la aplicación
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import DashboardPage from '../pages/DashboardPage';
import CreateServicePage from '../pages/CreateServicePage';
import CreateSupplyOfferPage from '../pages/CreateSupplyOfferPage';
import ServicesListPage from '../pages/ServicesListPage';
import ServiceDetailPage from '../pages/ServiceDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * AppRouter - Componente que configura todas las rutas de la aplicación
 * 
 * @returns {JSX.Element} Router con todas las rutas definidas
 * 
 * Estructura de rutas:
 * 
 * RUTAS PÚBLICAS (sin autenticación):
 * - / → LandingPage (página inicial, siempre accesible)
 * - /login → LoginPage (solo si NO estás autenticado, si ya estás logueado redirige a /dashboard)
 * - /signup → SignUpPage (solo si NO estás autenticado)
 * 
 * RUTAS PROTEGIDAS (requieren autenticación):
 * - /dashboard → DashboardPage (dashboard principal según rol del usuario)
 * - /services/create → CreateServicePage (crear nuevo servicio)
 * - /supplies/create → CreateSupplyOfferPage (crear oferta de insumos)
 * - /services → ServicesListPage (listado de servicios disponibles)
 * - /services/:id → ServiceDetailPage (detalle de un servicio específico, :id es un parámetro dinámico)
 * 
 * RUTA 404:
 * - /* → NotFoundPage (cualquier URL que no coincida con las rutas anteriores)
 */
const AppRouter = () => {
  return (
    // BrowserRouter: Proporciona el contexto de navegación usando History API del navegador
    // Permite usar URLs limpias sin # (ej: /dashboard en lugar de /#/dashboard)
    <BrowserRouter>
      {/* Routes: Contenedor que agrupa todas las rutas */}
      <Routes>
        {/* 
          RUTA PÚBLICA - Landing Page
          Path: / (raíz del dominio)
          Accesible: Siempre, sin importar si estás autenticado o no
        */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* 
          RUTAS PÚBLICAS - Solo visibles si NO estás autenticado
          
          PublicRoute envuelve estas rutas y:
          - Si NO estás autenticado → Muestra la página (LoginPage/SignUpPage)
          - Si YA estás autenticado → Redirige automáticamente a /dashboard
        */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />

        {/* 
          RUTAS PROTEGIDAS - Solo visibles si estás autenticado
          
          ProtectedRoute envuelve estas rutas y:
          - Si estás autenticado → Muestra la página
          - Si NO estás autenticado → Redirige automáticamente a /login
        */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Ruta para crear un nuevo servicio (Rol: Solicitante) */}
        <Route
          path="/services/create"
          element={
            <ProtectedRoute>
              <CreateServicePage />
            </ProtectedRoute>
          }
        />

        {/* Ruta para crear una oferta de insumos (Rol: Proveedor de Insumos) */}
        <Route
          path="/supplies/create"
          element={
            <ProtectedRoute>
              <CreateSupplyOfferPage />
            </ProtectedRoute>
          }
        />

        {/* Ruta para ver el listado de servicios disponibles (Rol: Proveedor de Servicio) */}
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesListPage />
            </ProtectedRoute>
          }
        />

        {/* 
          Ruta dinámica para ver el detalle de un servicio específico
          :id es un parámetro que se pasa al componente ServiceDetailPage
          Ejemplo: /services/123 → ServiceDetailPage recibe id="123"
        */}
        <Route
          path="/services/:id"
          element={
            <ProtectedRoute>
              <ServiceDetailPage />
            </ProtectedRoute>
          }
        />

        {/* 
          Ejemplos de futuras rutas protegidas (comentadas porque aún no existen)
          Descomenta y crea los componentes cuando los necesites:
        */}
        {/* 
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        */}

        {/* 
          RUTA 404 - DEBE IR AL FINAL
          
          path="*" es un "catch-all" que captura cualquier URL que no coincida
          con las rutas anteriores. Por eso debe estar al final de todas las rutas.
          
          Ejemplos de URLs que mostrarían NotFoundPage:
          - /pagina-inexistente
          - /dashboard/error
          - /cualquier/cosa
        */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


