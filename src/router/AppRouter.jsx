import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from '../components/routing/PublicRoute';
import ProtectedRoute from '../components/routing/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
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
        {/* Rutas públicas - Solo visibles si NO estás logueado */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
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

        {/* Ruta por defecto - redirige según autenticación */}
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        {/* Ruta 404 - debe ir al final */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;


