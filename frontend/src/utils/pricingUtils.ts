import type { VisaDestination } from '../data/visasData';

export const parsePriceNumber = (val: string | number | undefined | null): number => {
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.round(val);
  if (!val || typeof val !== 'string') return 0;
  const cleanStr = val.replace(/\([^)]*%\s*[^)]*\)/gi, '').trim();
  const matchNum = cleanStr.match(/\d[\d,]*/);
  if (matchNum) {
    const num = parseInt(matchNum[0].replace(/,/g, ''), 10);
    if (!isNaN(num)) return num;
  }
  return 0;
};

export const parseTaxNumber = (taxVal: string | number | undefined | null, subtotal: number = 0): number => {
  if (typeof taxVal === 'number') return isNaN(taxVal) ? 0 : Math.round(taxVal);
  if (!taxVal || typeof taxVal !== 'string') return 0;
  const trimmed = taxVal.trim();

  // 1. Remove parenthesized percentages e.g. "(18% GST)", "(18%)"
  const cleanStr = trimmed.replace(/\([^)]*%\s*[^)]*\)/gi, '').trim();

  // 2. Remove all standalone percentage tokens like "18%", "18 %", "18% GST"
  const strippedPercent = cleanStr.replace(/\b\d+(?:\.\d+)?\s*%\s*(gst)?/gi, '').trim();

  // 3. Now whatever number is left in strippedPercent is an explicit rupee amount
  const amountMatch = strippedPercent.match(/\d[\d,]*/);
  if (amountMatch) {
    const val = parseInt(amountMatch[0].replace(/,/g, ''), 10);
    if (!isNaN(val) && val > 0) return val;
  }

  // 4. If no amount was left, check if original string had a percentage (e.g. "18% GST" or "18%")
  const percentMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch && percentMatch[1]) {
    const pct = parseFloat(percentMatch[1]);
    if (!isNaN(pct) && pct > 0) {
      return Math.round((subtotal * pct) / 100);
    }
  }

  return 0;
};

export const calculateCategoryTotal = (
  visaPrice: string | number | undefined,
  ourCharges: string | number | undefined,
  taxRate: string | number | undefined
) => {
  const vP = parsePriceNumber(visaPrice);
  const oC = parsePriceNumber(ourCharges);
  const tR = parseTaxNumber(taxRate, vP + oC);
  const total = vP + oC + tR;
  return {
    vP,
    oC,
    tR,
    total,
    formattedTotal: total > 0 ? `₹${total.toLocaleString('en-IN')}` : '₹4,999',
  };
};

export const getStartingPrice = (visa?: VisaDestination | null): string => {
  if (!visa) return '₹4,999';
  const prices: number[] = [];

  if (Array.isArray(visa.customCategories) && visa.customCategories.length > 0) {
    for (const cat of visa.customCategories) {
      if (cat.price) {
        const num = parsePriceNumber(cat.price);
        if (num > 0) prices.push(num);
      } else {
        const { total } = calculateCategoryTotal(cat.visaPrice, cat.ourCharges, cat.taxRate);
        if (total > 0) prices.push(total);
      }
    }
  }

  if (visa.categoryPricing) {
    const keys: ('tourist' | 'express' | 'business')[] = ['tourist', 'express', 'business'];
    for (const key of keys) {
      const cp = visa.categoryPricing[key];
      if (cp?.price) {
        const num = parsePriceNumber(cp.price);
        if (num > 0) prices.push(num);
      }
    }
  }

  if (visa.price) {
    const num = parsePriceNumber(visa.price);
    if (num > 0) prices.push(num);
  }

  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    return `₹${minPrice.toLocaleString('en-IN')}`;
  }

  return visa.price || '₹4,999';
};
