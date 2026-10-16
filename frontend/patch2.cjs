const fs = require('fs');
let code = fs.readFileSync('d:/projects/Phelavisa/frontend/src/App.tsx', 'utf8');

const oldNavigate = `const navigateTo = (page: 'home' | 'visas' | 'b2b' | 'login' | 'dummy-tickets' | 'orders' | 'profile' | 'privacy' | 'terms' | 'refund' | 'disclaimer') => {`;
const newNavigate = `const navigateTo = (page: string) => {`;
code = code.replace(oldNavigate, newNavigate);

const oldState = `const [currentPage, setCurrentPage] = useState<'home' | 'visas' | 'b2b' | 'login' | 'dummy-tickets' | 'orders' | 'profile' | 'privacy' | 'terms' | 'refund' | 'disclaimer'>(() => {`;
const newState = `const [currentPage, setCurrentPage] = useState<string>(() => {`;
code = code.replace(oldState, newState);

fs.writeFileSync('d:/projects/Phelavisa/frontend/src/App.tsx', code);
console.log('App.tsx type issues patched');
