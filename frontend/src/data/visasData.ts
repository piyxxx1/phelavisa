export interface RequiredDocumentItem {
  id: string;
  forVisaCategory?: string;
  category: string;
  title: string;
  description: string;
  isRequired: boolean;
}

export interface KeySpecificationItem {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface CategoryPricingItem {
  price?: string;
  visaPrice?: string;
  ourCharges?: string;
  taxRate?: string;
}

export interface CustomCategoryItem {
  id: string;
  name: string;
  badge?: string;
  price?: string;
  visaPrice?: string;
  ourCharges?: string;
  taxRate?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface VisaDestination {
  id: string;
  country: string;
  region: string;
  flagCode: string;
  coverImg: string;
  title: string;
  visaCategory: 'TOURIST VISA' | 'EVISA' | 'BUSINESS VISA';
  deliveryTime: 'Within 48 Hrs' | 'This Week' | 'This Month' | '2+ Months';
  documents: 'Only Passport' | 'Bank Statement Required' | 'Invitation Letter';
  badgeTag: 'POPULAR CHOICE' | 'LONG-TERM PROCESS' | 'EMBASSY PROCESS' | 'FAST APPROVAL' | 'DIRECT ENTRY';
  getBy: string;
  type: string;
  price: string;
  visaPrice?: string;
  ourCharges?: string;
  taxRate?: string;
  processingTime: string;
  stayPeriod: string;
  validity: string;
  entryType: string;
  popular: boolean;
  feeLabel?: string;
  express: boolean;
  availableCategories?: string[];
  categoryPricing?: {
    tourist?: CategoryPricingItem;
    express?: CategoryPricingItem;
    business?: CategoryPricingItem;
  };
  customCategories?: CustomCategoryItem[];
  docChecklist?: RequiredDocumentItem[];
  keySpecs?: KeySpecificationItem[];
  faqs?: FaqItem[];
  deliveryTimeTags?: string[];
  typeTags?: string[];
  documentsTags?: string[];
  regionTags?: string[];
}

export const ALL_VISAS: VisaDestination[] = [];
