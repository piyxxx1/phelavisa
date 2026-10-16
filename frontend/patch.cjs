const fs = require('fs');
let code = fs.readFileSync('d:/projects/Phelavisa/frontend/src/App.tsx', 'utf8');

const importsToAdd = `import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPage } from './pages/RefundPage';
import { GovernmentDisclaimerPage } from './pages/GovernmentDisclaimerPage';`;
code = code.replace(/import \{ ProfilePage \} from '\.\/pages\/ProfilePage';/, "import { ProfilePage } from './pages/ProfilePage';\n" + importsToAdd);

const oldType = `'home' | 'visas' | 'b2b' | 'login' | 'dummy-tickets' | 'orders' | 'profile'`;
const newType = `'home' | 'visas' | 'b2b' | 'login' | 'dummy-tickets' | 'orders' | 'profile' | 'privacy' | 'terms' | 'refund' | 'disclaimer'`;
code = code.split(oldType).join(newType);

const initialRouting = `if (path.startsWith('/profile')) return 'profile';`;
const newInitialRouting = `if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/privacy')) return 'privacy';
    if (path.startsWith('/terms')) return 'terms';
    if (path.startsWith('/refund')) return 'refund';
    if (path.startsWith('/disclaimer')) return 'disclaimer';`;
code = code.replace(initialRouting, newInitialRouting);

const popStateRouting = `      } else if (path.startsWith('/profile')) {
        setCurrentPage('profile');
        setSelectedVisa(null);
        setApplyParams(null);`;
const newPopStateRouting = popStateRouting + `
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
        setApplyParams(null);`;
code = code.replace(popStateRouting, newPopStateRouting);

const navigateRouting = `if (page === 'profile') newPath = '/profile';`;
const newNavigateRouting = `if (page === 'profile') newPath = '/profile';
    if (page === 'privacy') newPath = '/privacy';
    if (page === 'terms') newPath = '/terms';
    if (page === 'refund') newPath = '/refund';
    if (page === 'disclaimer') newPath = '/disclaimer';`;
code = code.replace(navigateRouting, newNavigateRouting);

const jsxReturn = `        ) : currentPage === 'profile' ? (
          <ProfilePage user={user} onLogout={handleLogout} onNavigate={navigateTo} />`;
const newJsxReturn = jsxReturn + `
        ) : currentPage === 'privacy' ? (
          <PrivacyPage />
        ) : currentPage === 'terms' ? (
          <TermsPage />
        ) : currentPage === 'refund' ? (
          <RefundPage />
        ) : currentPage === 'disclaimer' ? (
          <GovernmentDisclaimerPage />`;
code = code.replace(jsxReturn, newJsxReturn);

fs.writeFileSync('d:/projects/Phelavisa/frontend/src/App.tsx', code);
console.log('App.tsx patched successfully');
