import { useState, useEffect } from 'react';
import { API_BASE_URL } from './config/apiConfig';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Disclaimer } from './components/Disclaimer';
import { HomePage } from './pages/HomePage';
import { VisasPage } from './pages/VisasPage';
import { VisaDetailPage } from './pages/VisaDetailPage';
import { ApplyVisaPage } from './pages/ApplyVisaPage';
import { LoginPage, type UserProfile } from './pages/LoginPage';
import { B2BPage } from './pages/B2BPage';
import { DummyTicketsPage } from './pages/DummyTicketsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPage } from './pages/RefundPage';
import { GovernmentDisclaimerPage } from './pages/GovernmentDisclaimerPage';
import type { VisaDestination } from './data/visasData';

interface ApplyParams {
  visa: VisaDestination;
  travelersCount: number;
  variant: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/visas')) return 'visas';
    if (path.startsWith('/b2b')) return 'b2b';
    if (path.startsWith('/login')) return 'login';
    if (path.startsWith('/dummy-tickets')) return 'dummy-tickets';
    if (path.startsWith('/orders')) return 'orders';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/privacy')) return 'privacy';
    if (path.startsWith('/terms')) return 'terms';
    if (path.startsWith('/refund')) return 'refund';
    if (path.startsWith('/disclaimer')) return 'disclaimer';
    if (path.startsWith('/contact')) return 'contact';
    return 'home';
  });

  const [selectedVisa, setSelectedVisa] = useState<VisaDestination | null>(null);
  const [applyParams, setApplyParams] = useState<ApplyParams | null>(null);

  // User Authentication State loaded from localStorage
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('pehla_visa_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [liveVisas, setLiveVisas] = useState<VisaDestination[]>([]);

  useEffect(() => {
    async function fetchLiveVisas() {
      try {
        const res = await fetch(`${API_BASE_URL}/visas`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setLiveVisas(data);
          }
        }
      } catch (err) {
        console.warn('App.tsx live visas fetch warning:', err);
      }
    }
    fetchLiveVisas();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/visas')) {
        setCurrentPage('visas');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/b2b')) {
        setCurrentPage('b2b');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/dummy-tickets')) {
        setCurrentPage('dummy-tickets');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/orders')) {
        setCurrentPage('orders');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/profile')) {
        setCurrentPage('profile');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/privacy')) {
        setCurrentPage('privacy');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/terms')) {
        setCurrentPage('terms');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/refund')) {
        setCurrentPage('refund');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/disclaimer')) {
        setCurrentPage('disclaimer');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/contact')) {
        setCurrentPage('contact');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/login')) {
        setCurrentPage('login');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.includes('/apply')) {
        const id = path.replace('/visa/', '').replace('/apply', '');
        const found = liveVisas.find((v) => v.id === id || v.id === id + '-visa');
        if (found) {
          setSelectedVisa(found);
          setApplyParams({ visa: found, travelersCount: 1, variant: 'tourist' });
        } else {
          setCurrentPage('home');
        }
      } else if (path.startsWith('/visa/')) {
        const id = path.replace('/visa/', '');
        const found = liveVisas.find((v) => v.id === id || v.id === id + '-visa');
        if (found) {
          setSelectedVisa(found);
          setApplyParams(null);
        } else {
          setCurrentPage('home');
        }
      } else {
        setCurrentPage('home');
        setSelectedVisa(null);
        setApplyParams(null);
      }
    };
    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [liveVisas]);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setSelectedVisa(null);
    setApplyParams(null);
    let newPath = '/';
    if (page === 'visas') newPath = '/visas';
    if (page === 'b2b') newPath = '/b2b';
    if (page === 'login') newPath = '/login';
    if (page === 'dummy-tickets') newPath = '/dummy-tickets';
    if (page === 'orders') newPath = '/orders';
    if (page === 'profile') newPath = '/profile';
    if (page === 'privacy') newPath = '/privacy';
    if (page === 'terms') newPath = '/terms';
    if (page === 'refund') newPath = '/refund';
    if (page === 'disclaimer') newPath = '/disclaimer';
    if (page === 'contact') newPath = '/contact';

    window.history.pushState(null, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVisa = (visa: VisaDestination) => {
    setSelectedVisa(visa);
    setApplyParams(null);
    window.history.pushState(null, '', `/visa/${visa.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartApplication = (visa: VisaDestination, travelersCount: number, variant: string) => {
    setSelectedVisa(visa);
    setApplyParams({ visa, travelersCount, variant });
    window.history.pushState(null, '', `/visa/${visa.id}/apply`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    try {
      localStorage.setItem('pehla_visa_user', JSON.stringify(userProfile));
    } catch {
      // ignore localStorage errors
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('pehla_visa_user');
    } catch {
      // ignore
    }
  };

  return (
    <div className="app-root">
      <Header
        currentPage={currentPage}
        user={user}
        onNavigate={navigateTo}
        onLogout={handleLogout}
      />
      <main>
        {applyParams ? (
          <ApplyVisaPage
            visa={applyParams.visa}
            user={user}
            initialTravelersCount={applyParams.travelersCount}
            initialVariant={applyParams.variant}
            onBackToVisaDetail={() => {
              setApplyParams(null);
              window.history.pushState(null, '', `/visa/${applyParams.visa.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => navigateTo('home')}
            onNavigateVisas={() => navigateTo('visas')}
          />
        ) : selectedVisa ? (
          <VisaDetailPage
            visa={selectedVisa}
            user={user}
            onLoginSuccess={handleLoginSuccess}
            onBack={() => {
              setSelectedVisa(null);
              window.history.pushState(null, '', currentPage === 'visas' ? '/visas' : '/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateVisas={() => navigateTo('visas')}
            onStartApplication={handleStartApplication}
          />
        ) : currentPage === 'dummy-tickets' ? (
          <DummyTicketsPage user={user} onNavigate={navigateTo} />
        ) : currentPage === 'orders' ? (
          <OrdersPage user={user} onNavigate={navigateTo} />
        ) : currentPage === 'profile' ? (
          <ProfilePage user={user} onLogout={handleLogout} onNavigate={navigateTo} />
        ) : currentPage === 'privacy' ? (
          <PrivacyPage />
        ) : currentPage === 'terms' ? (
          <TermsPage />
        ) : currentPage === 'refund' ? (
          <RefundPage />
        ) : currentPage === 'disclaimer' ? (
          <GovernmentDisclaimerPage />
        ) : currentPage === 'contact' ? (
          <ContactPage />
        ) : currentPage === 'b2b' ? (
          <B2BPage
            onNavigateHome={() => navigateTo('home')}
            onNavigateVisas={() => navigateTo('visas')}
          />
        ) : currentPage === 'login' ? (
          <LoginPage
            onLoginSuccess={(u) => {
              handleLoginSuccess(u);
              navigateTo('home');
            }}
            onNavigateHome={() => navigateTo('home')}
          />
        ) : currentPage === 'home' ? (
          <HomePage onSelectVisa={handleSelectVisa} />
        ) : (
          <VisasPage onSelectVisa={handleSelectVisa} />
        )}
        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
