const fs = require('fs');
let code = fs.readFileSync('d:/projects/Phelavisa/frontend/src/components/Footer.tsx', 'utf8');

// Add imports
code = code.replace(/import \{ FaFacebookF/, "import { useState, useEffect } from 'react';\nimport { API_BASE_URL } from '../config/apiConfig';\nimport { FaFacebookF");

// Add state and effect
const componentStart = `export const Footer = () => {`;
const stateAndEffect = `export const Footer = () => {
  const [popularVisas, setPopularVisas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch(\`\${API_BASE_URL}/visas\`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const popular = data.filter(v => v.popular).slice(0, 8);
            setPopularVisas(popular);
          }
        }
      } catch (e) {
        console.warn('Footer popular visas fetch error:', e);
      }
    }
    fetchPopular();
  }, []);
`;
code = code.replace(componentStart, stateAndEffect);

// Replace the hardcoded list
const hardcodedList = `            <ul className="footer-list">
              <li><a href="#dubai">Dubai Tourist Visa</a></li>
              <li><a href="#thailand">Thailand eVisa</a></li>
              <li><a href="#singapore">Singapore Tourist Visa</a></li>
              <li><a href="#vietnam">Vietnam E-Visa</a></li>
              <li><a href="#malaysia">Malaysia MDAC</a></li>
              <li><a href="#schengen">Schengen Europe Visa</a></li>
              <li><a href="#us">US B1/B2 Visa</a></li>
              <li><a href="#uk">UK Standard Visitor</a></li>
            </ul>`;

const dynamicList = `            <ul className="footer-list">
              {popularVisas.map((visa: any) => (
                <li key={visa.id || visa._id}>
                  <a href={\`/visa/\${visa.id || visa._id}\`}>{visa.country} {visa.title}</a>
                </li>
              ))}
            </ul>`;

code = code.replace(hardcodedList, dynamicList);

fs.writeFileSync('d:/projects/Phelavisa/frontend/src/components/Footer.tsx', code);
console.log('Footer patched with dynamic popular visas');
