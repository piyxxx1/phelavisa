import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Disclaimer } from './components/Disclaimer';
import { HomePage } from './pages/HomePage';
import { VisasPage } from './pages/VisasPage';
import { VisaDetailPage } from './pages/VisaDetailPage';
import { ApplyVisaPage } from './pages/ApplyVisaPage';
import { LoginPage, type UserProfile } from './pages/LoginPage';
import { ALL_VISAS, type VisaDestination } from './data/visasData';

interface ApplyParams {
  visa: VisaDestination;
  travelersCount: number;
  variant: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'visas' | 'login'>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/visas')) return 'visas';
    if (path.startsWith('/login')) return 'login';
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

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/visas')) {
        setCurrentPage('visas');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/login')) {
        setCurrentPage('login');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.includes('/apply')) {
        const id = path.replace('/visa/', '').replace('/apply', '');
        const found = ALL_VISAS.find((v) => v.id === id);
        if (found) {
          setSelectedVisa(found);
          setApplyParams({ visa: found, travelersCount: 1, variant: 'tourist' });
        } else {
          setCurrentPage('home');
        }
      } else if (path.startsWith('/visa/')) {
        const id = path.replace('/visa/', '');
        const found = ALL_VISAS.find((v) => v.id === id);
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
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: 'home' | 'visas' | 'login') => {
    setCurrentPage(page);
    setSelectedVisa(null);
    setApplyParams(null);
    let newPath = '/';
    if (page === 'visas') newPath = '/visas';
    if (page === 'login') newPath = '/login';

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
