import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Disclaimer } from './components/Disclaimer';
import { HomePage } from './pages/HomePage';
import { VisasPage } from './pages/VisasPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'visas'>(() => {
    return window.location.pathname.startsWith('/visas') ? 'visas' : 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.startsWith('/visas')) {
        setCurrentPage('visas');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (page: 'home' | 'visas') => {
    setCurrentPage(page);
    const newPath = page === 'visas' ? '/visas' : '/';
    window.history.pushState(null, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      <Header currentPage={currentPage} onNavigate={navigateTo} />
      <main>
        {currentPage === 'home' ? <HomePage /> : <VisasPage />}
        <Disclaimer />
      </main>
      <Footer />
    </div>
  );
}

export default App;
