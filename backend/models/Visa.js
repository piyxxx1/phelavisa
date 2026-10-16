import mongoose from 'mongoose';

const requiredDocumentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    forVisaCategory: { type: String, default: 'all' },
    category: { type: String, default: 'mandatory' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    isRequired: { type: Boolean, default: true },
  },
  { _id: false }
);

const keySpecificationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String, default: 'shield' },
});

const faqSchema = new mongoose.Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const categoryPricingBreakdownSchema = new mongoose.Schema(
  {
    price: { type: String, default: '₹4,999' },
    visaPrice: { type: String, default: '₹3,500' },
    ourCharges: { type: String, default: '₹999' },
    taxRate: { type: String, default: '₹499 (18% GST)' },
  },
  { _id: false }
);

const customCategoryItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    badge: { type: String, default: 'Standard Process' },
    price: { type: String, default: '₹4,999' },
    visaPrice: { type: String, default: '₹3,500' },
    ourCharges: { type: String, default: '₹999' },
    taxRate: { type: String, default: '₹499 (18% GST)' },
  },
  { _id: false }
);

const visaSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    flagCode: { type: String, required: true },
    coverImg: { type: String, required: true },
    title: { type: String, required: true },
    visaCategory: { type: String, required: true },
    deliveryTime: { type: String, required: true },
    documents: { type: String, required: true },
    deliveryTimeTags: { type: [String], default: [] },
    typeTags: { type: [String], default: [] },
    documentsTags: { type: [String], default: [] },
    regionTags: { type: [String], default: [] },
    badgeTag: { type: String, default: 'POPULAR CHOICE' },
    getBy: { type: String, default: 'This Week' },
    type: { type: String, default: 'Tourist Visa' },
    price: { type: String, required: true },
    visaPrice: { type: String, default: '₹3,500' },
    ourCharges: { type: String, default: '₹999' },
    taxRate: { type: String, default: '₹499 (18% GST)' },
    processingTime: { type: String, required: true },
    stayPeriod: { type: String, required: true },
    validity: { type: String, required: true },
    entryType: { type: String, required: true },
    popular: { type: Boolean, default: false },
    feeLabel: { type: String, enum: ['Embassy Govt Fee', 'Appointment Fees'], default: 'Embassy Govt Fee' },
    express: { type: Boolean, default: false },
    availableCategories: {
      type: [String],
      default: ['tourist', 'express', 'business'],
    },
    categoryPricing: {
      tourist: { type: categoryPricingBreakdownSchema, default: () => ({ price: '₹4,999', visaPrice: '₹3,500', ourCharges: '₹999', taxRate: '₹499 (18% GST)' }) },
      express: { type: categoryPricingBreakdownSchema, default: () => ({ price: '₹7,999', visaPrice: '₹5,500', ourCharges: '₹1,499', taxRate: '₹999 (18% GST)' }) },
      business: { type: categoryPricingBreakdownSchema, default: () => ({ price: '₹14,999', visaPrice: '₹10,500', ourCharges: '₹2,499', taxRate: '₹1,999 (18% GST)' }) },
    },
    customCategories: [customCategoryItemSchema],
    docChecklist: [requiredDocumentSchema],
    keySpecs: [keySpecificationSchema],
    faqs: [faqSchema],
  },
  { timestamps: true }
);

export const Visa = mongoose.model('Visa', visaSchema);
