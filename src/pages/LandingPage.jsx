import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

/**
 * LandingPage - Página de inicio de Market del Este
 * Plataforma de marketplace enfocada en Punta del Este
 */
const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container">
          <div className="nav-content">
            <div className="logo-nav">
              <h1 className="logo-text">Market del Este</h1>
            </div>
            <div className="nav-actions">
              <button onClick={() => navigate('/login')} className="btn-nav-secondary">
                Iniciar Sesión
              </button>
              <button onClick={() => navigate('/signup')} className="btn-nav-primary">
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🏖️ Marketplace de Punta del Este</span>
            </div>
            <h1 className="hero-title">
              Conectamos servicios e insumos
              <br />
              <span className="gradient-text">en la costa este</span>
            </h1>
            <p className="hero-description">
              La plataforma que une solicitantes, proveedores de servicios y proveedores de insumos en Punta del Este y la región. Transforma cómo trabajas.
            </p>
            <div className="hero-cta">
              <button onClick={handleGetStarted} className="btn-hero-primary">
                Empezar gratis
                <span className="btn-arrow">→</span>
              </button>
              <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="btn-hero-secondary">
                Ver más
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Servicios activos</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Proveedores</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Disponibilidad</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <div className="card-icon">🏗️</div>
            <div className="card-title">Construcción</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🔧</div>
            <div className="card-title">Servicios</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">📦</div>
            <div className="card-title">Insumos</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Características</div>
            <h2 className="section-title">
              Todo lo que necesitas para
              <br />
              <span className="gradient-text">gestionar tu proyecto</span>
            </h2>
            <p className="section-description">
              Una plataforma completa diseñada para conectar la comunidad de Punta del Este
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">👤</div>
              </div>
              <h3 className="feature-title">Para Solicitantes</h3>
              <p className="feature-description">
                Publica tus necesidades de servicios e insumos de forma simple y rápida. 
                Encuentra profesionales confiables y recibe múltiples cotizaciones.
              </p>
              <ul className="feature-list">
                <li>✓ Publicación gratuita</li>
                <li>✓ Múltiples cotizaciones</li>
                <li>✓ Seguimiento en tiempo real</li>
              </ul>
            </div>

            <div className="feature-card feature-card-primary">
              <div className="feature-badge">Popular</div>
              <div className="feature-icon-wrapper">
                <div className="feature-icon">⚙️</div>
              </div>
              <h3 className="feature-title">Proveedores de Servicios</h3>
              <p className="feature-description">
                Amplía tu cartera de clientes y recibe solicitudes de trabajo. 
                Gestiona cotizaciones y conecta directamente con quienes necesitan tus servicios.
              </p>
              <ul className="feature-list">
                <li>✓ Acceso a oportunidades</li>
                <li>✓ Gestión de cotizaciones</li>
                <li>✓ Perfil profesional</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📊</div>
              </div>
              <h3 className="feature-title">Proveedores de Insumos</h3>
              <p className="feature-description">
                Haz llegar tus productos a quienes los necesitan. 
                Gestiona ofertas de insumos y amplía tu alcance en la región.
              </p>
              <ul className="feature-list">
                <li>✓ Ofertas dirigidas</li>
                <li>✓ Gestión de inventario</li>
                <li>✓ Alcance regional</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Proceso</div>
            <h2 className="section-title">
              ¿Cómo funciona?
              <br />
              <span className="gradient-text">Simple y rápido</span>
            </h2>
          </div>
          
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Crea tu cuenta</h3>
              <p className="step-description">
                Regístrate según tu rol y completa tu perfil en minutos
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Publica o busca</h3>
              <p className="step-description">
                Publica tus necesidades o servicios, o explora lo que otros ofrecen
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Conecta y trabaja</h3>
              <p className="step-description">
                Recibe cotizaciones, haz ofertas y conecta con la comunidad
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">¿Listo para comenzar?</h2>
            <p className="cta-description">
              Únete a Market del Este y forma parte de la comunidad que está transformando 
              cómo se conectan servicios e insumos en Punta del Este
            </p>
            <button onClick={handleGetStarted} className="btn-cta-primary">
              Crear cuenta gratis
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3 className="footer-logo">Market del Este</h3>
              <p className="footer-tagline">Marketplace de Punta del Este</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-title">Plataforma</h4>
                <a href="#features" className="footer-link">Características</a>
                <a href="#how-it-works" className="footer-link">Cómo funciona</a>
                <a href="/login" className="footer-link">Iniciar sesión</a>
              </div>
              <div className="footer-column">
                <h4 className="footer-title">Comunidad</h4>
                <a href="#" className="footer-link">Sobre nosotros</a>
                <a href="#" className="footer-link">Contacto</a>
                <a href="#" className="footer-link">Soporte</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Market del Este. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

