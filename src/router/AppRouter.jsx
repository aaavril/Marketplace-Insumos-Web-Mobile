import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import DashboardPage from '../pages/DashboardPage';
import CreateServicePage from '../pages/CreateServicePage';
import ServicesListPage from '../pages/ServicesListPage';
import ServiceDetailPage from '../pages/ServiceDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * AppRouter - Configuración de rutas de la aplicación
 * 
 * Rutas públicas (solo si NO estás autenticado):
 * - /login → Solo visible si NO estás logueado
 * 
 * Rutas protegidas (solo si estás autenticado):
 * - /dashboard → Dashboard principal
 * - Futuras: /services, /profile, /quotes, etc.
 * 
 * Otras:
 * - / → Redirige a /dashboard si autenticado, /login si no
 * - /* → Cualquier otra URL → 404
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page - Siempre accesible */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Rutas públicas - Solo visibles si NO estás logueado */}
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

        {/* Rutas protegidas - Solo visibles si estás autenticado */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/create"
          element={
            <ProtectedRoute>
              <CreateServicePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/:id"
          element={
            <ProtectedRoute>
              <ServiceDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Ejemplos de futuras rutas protegidas (comentadas por ahora) */}
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


        {/* Ruta 404 - debe ir al final */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


