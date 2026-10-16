const fs = require('fs');

// 1. Patch Footer.tsx
let footerCode = fs.readFileSync('d:/projects/Phelavisa/frontend/src/components/Footer.tsx', 'utf8');
const oldFooterList = `<ul className="footer-list">
              <li><a href="#visas">Visa Services</a></li>
              <li><a href="#b2b">B2B Partner Portal</a></li>
              <li><a href="#apostille">Apostille Services</a></li>
              <li><a href="#attestation">Document Attestation</a></li>
              <li><a href="#faqs">Frequently Asked Questions</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>`;

const newFooterList = `<ul className="footer-list">
              <li><a href="#visas">Visa Services</a></li>
              <li><a href="#b2b">B2B Partner Portal</a></li>
              <li><a href="#faqs">Frequently Asked Questions</a></li>
              <li><a href="/contact">Contact Support</a></li>
            </ul>`;
footerCode = footerCode.replace(oldFooterList, newFooterList);
fs.writeFileSync('d:/projects/Phelavisa/frontend/src/components/Footer.tsx', footerCode);
console.log('Footer patched.');

// 2. Patch App.tsx
let appCode = fs.readFileSync('d:/projects/Phelavisa/frontend/src/App.tsx', 'utf8');

// Add import
const importToAdd = `import { ContactPage } from './pages/ContactPage';\nimport { PrivacyPage`;
appCode = appCode.replace(`import { PrivacyPage`, importToAdd);

// Add initial routing
appCode = appCode.replace(`if (path.startsWith('/disclaimer')) return 'disclaimer';`, `if (path.startsWith('/disclaimer')) return 'disclaimer';\n    if (path.startsWith('/contact')) return 'contact';`);

// Add popstate routing
appCode = appCode.replace(`} else if (path.startsWith('/disclaimer')) {
        setCurrentPage('disclaimer');
        setSelectedVisa(null);
        setApplyParams(null);`, `} else if (path.startsWith('/disclaimer')) {
        setCurrentPage('disclaimer');
        setSelectedVisa(null);
        setApplyParams(null);
      } else if (path.startsWith('/contact')) {
        setCurrentPage('contact');
        setSelectedVisa(null);
        setApplyParams(null);`);

// Add navigateTo routing
appCode = appCode.replace(`if (page === 'disclaimer') newPath = '/disclaimer';`, `if (page === 'disclaimer') newPath = '/disclaimer';\n    if (page === 'contact') newPath = '/contact';`);

// Add JSX return
appCode = appCode.replace(`) : currentPage === 'disclaimer' ? (
          <GovernmentDisclaimerPage />`, `) : currentPage === 'disclaimer' ? (
          <GovernmentDisclaimerPage />
        ) : currentPage === 'contact' ? (
          <ContactPage />`);

fs.writeFileSync('d:/projects/Phelavisa/frontend/src/App.tsx', appCode);
console.log('App.tsx patched.');
