import express from 'express';
import { Visa } from '../models/Visa.js';
import { Application } from '../models/Application.js';
import { B2BPartner } from '../models/B2BPartner.js';

const router = express.Router();

const INITIAL_VISAS = [
  {
    id: 'france-schengen-visa',
    country: 'France',
    region: 'Europe',
    flagCode: 'fr',
    coverImg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    title: 'France Schengen Tourist Visa',
    visaCategory: 'TOURIST VISA',
    deliveryTime: 'This Week',
    documents: 'Only Passport',
    badgeTag: 'POPULAR CHOICE',
    getBy: '19 Aug',
    type: 'Tourist Visa',
    price: '₹4,998',
    visaPrice: '₹3,500',
    ourCharges: '₹999',
    taxRate: '₹499 (18% GST)',
    processingTime: '5-7 Days',
    stayPeriod: '90 Days',
    validity: '180 Days',
    entryType: 'Multiple Entry',
    popular: true,
    express: true,
    availableCategories: ['tourist', 'express', 'business'],
    customCategories: [
      { id: 'tourist', name: 'Tourist Visa', badge: 'Standard Process', visaPrice: '₹3,500', ourCharges: '₹999', taxRate: '₹499 (18% GST)', price: '₹4,998' },
      { id: 'express', name: 'Express eVisa', badge: '⚡ 24h Fast Track', visaPrice: '₹5,500', ourCharges: '₹1,499', taxRate: '₹999 (18% GST)', price: '₹7,998' },
      { id: 'business', name: 'Business Visa', badge: '1 Year Multiple', visaPrice: '₹10,500', ourCharges: '₹2,499', taxRate: '₹1,999 (18% GST)', price: '₹14,998' },
    ],
    categoryPricing: {
      tourist: { price: '₹4,998', visaPrice: '₹3,500', ourCharges: '₹999', taxRate: '₹499 (18% GST)' },
      express: { price: '₹7,998', visaPrice: '₹5,500', ourCharges: '₹1,499', taxRate: '₹999 (18% GST)' },
      business: { price: '₹14,998', visaPrice: '₹10,500', ourCharges: '₹2,499', taxRate: '₹1,999 (18% GST)' },
    },
    docChecklist: [
      { id: 'doc-1', forVisaCategory: 'all', category: 'mandatory', title: 'Original Passport', description: 'Valid for 6 months beyond stay with 2 blank pages.', isRequired: true },
      { id: 'doc-2', forVisaCategory: 'all', category: 'mandatory', title: 'Passport Size Photos', description: '2 recent color photos (35x45mm, white background).', isRequired: true },
      { id: 'doc-3', forVisaCategory: 'all', category: 'financial', title: 'Bank Account Statement', description: '6 months bank statement with bank seal and signature.', isRequired: true },
    ],
    keySpecs: [
      { id: 'ks-1', label: 'Processing Time', value: '5-7 Days', icon: 'clock' },
      { id: 'ks-2', label: 'Stay Duration', value: '90 Days', icon: 'calendar' },
      { id: 'ks-3', label: 'Visa Validity', value: '180 Days', icon: 'document' },
      { id: 'ks-4', label: 'Entry Type', value: 'Multiple Entry', icon: 'id' },
    ],
    faqs: [
      { id: 'faq-1', question: 'Is a physical interview required for France visa?', answer: 'VFS biometric appointment is required.' },
    ],
  },
  {
    id: 'dubai-uae-evisa',
    country: 'Dubai (UAE)',
    region: 'Middle East',
    flagCode: 'ae',
    coverImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80',
    title: 'Dubai 30-Days Express eVisa',
    visaCategory: 'EVISA',
    deliveryTime: 'Within 48 Hrs',
    documents: 'Only Passport',
    badgeTag: 'FAST APPROVAL',
    getBy: '48 Hours',
    type: 'Express eVisa',
    price: '₹6,490',
    visaPrice: '₹4,500',
    ourCharges: '₹1,200',
    taxRate: '₹790 (18% GST)',
    processingTime: '24-48 Hours',
    stayPeriod: '30 Days',
    validity: '60 Days',
    entryType: 'Single Entry',
    popular: true,
    express: true,
    availableCategories: ['tourist', 'express', 'multiple'],
    customCategories: [
      { id: 'tourist', name: '30 Days Tourist eVisa', badge: 'Standard Process', visaPrice: '₹4,500', ourCharges: '₹1,200', taxRate: '₹790 (18% GST)', price: '₹6,490' },
      { id: 'express', name: 'Express 24h eVisa', badge: '⚡ Urgent Fast Track', visaPrice: '₹6,000', ourCharges: '₹1,500', taxRate: '₹990 (18% GST)', price: '₹8,490' },
      { id: 'multiple', name: '60 Days Multiple Entry', badge: 'Multiple Entry', visaPrice: '₹8,500', ourCharges: '₹1,800', taxRate: '₹1,190 (18% GST)', price: '₹11,490' },
    ],
    categoryPricing: {
      tourist: { price: '₹6,490', visaPrice: '₹4,500', ourCharges: '₹1,200', taxRate: '₹790 (18% GST)' },
      express: { price: '₹8,490', visaPrice: '₹6,000', ourCharges: '₹1,500', taxRate: '₹990 (18% GST)' },
      multiple: { price: '₹11,490', visaPrice: '₹8,500', ourCharges: '₹1,800', taxRate: '₹1,190 (18% GST)' },
    },
    docChecklist: [
      { id: 'doc-d1', forVisaCategory: 'all', category: 'mandatory', title: 'Passport Front & Back Scan', description: 'Color copy of first and last page of valid passport.', isRequired: true },
      { id: 'doc-d2', forVisaCategory: 'all', category: 'mandatory', title: 'Passport Size Photograph', description: 'Recent studio photo with white background.', isRequired: true },
    ],
    keySpecs: [
      { id: 'ks-1', label: 'Processing Time', value: '24-48 Hours', icon: 'clock' },
      { id: 'ks-2', label: 'Stay Duration', value: '30 Days', icon: 'calendar' },
      { id: 'ks-3', label: 'Visa Validity', value: '60 Days', icon: 'document' },
      { id: 'ks-4', label: 'Entry Type', value: 'Single Entry', icon: 'id' },
    ],
    faqs: [
      { id: 'faq-d1', question: 'Do Indians need visa for Dubai?', answer: 'Yes, Indian passport holders need a pre-arranged visa or eVisa before traveling.' },
    ],
  },
  {
    id: 'thailand-tourist-evisa',
    country: 'Thailand',
    region: 'Asia',
    flagCode: 'th',
    coverImg: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&auto=format&fit=crop&q=80',
    title: 'Thailand eVisa on Arrival',
    visaCategory: 'EVISA',
    deliveryTime: 'Within 48 Hrs',
    documents: 'Only Passport',
    badgeTag: 'DIRECT ENTRY',
    getBy: '24 Hours',
    type: 'eVisa on Arrival',
    price: '₹2,999',
    visaPrice: '₹1,800',
    ourCharges: '₹799',
    taxRate: '₹400 (18% GST)',
    processingTime: '24 Hours',
    stayPeriod: '15 Days',
    validity: '30 Days',
    entryType: 'Single Entry',
    popular: true,
    express: true,
    availableCategories: ['arrival', 'tourist', 'express'],
    customCategories: [
      { id: 'arrival', name: 'eVisa on Arrival', badge: 'Airport Fast Track', visaPrice: '₹1,800', ourCharges: '₹799', taxRate: '₹400 (18% GST)', price: '₹2,999' },
      { id: 'tourist', name: '60 Days Tourist Visa', badge: 'Standard Process', visaPrice: '₹3,200', ourCharges: '₹999', taxRate: '₹500 (18% GST)', price: '₹4,699' },
      { id: 'express', name: 'Express eVisa', badge: '⚡ 12h Urgent', visaPrice: '₹4,500', ourCharges: '₹1,200', taxRate: '₹699 (18% GST)', price: '₹6,399' },
    ],
    categoryPricing: {
      arrival: { price: '₹2,999', visaPrice: '₹1,800', ourCharges: '₹799', taxRate: '₹400 (18% GST)' },
      tourist: { price: '₹4,699', visaPrice: '₹3,200', ourCharges: '₹999', taxRate: '₹500 (18% GST)' },
      express: { price: '₹6,399', visaPrice: '₹4,500', ourCharges: '₹1,200', taxRate: '₹699 (18% GST)' },
    },
    docChecklist: [
      { id: 'doc-t1', forVisaCategory: 'all', category: 'mandatory', title: 'Passport Bio Page', description: 'Color scan of passport front bio page.', isRequired: true },
      { id: 'doc-t2', forVisaCategory: 'all', category: 'mandatory', title: 'Flight Confirmation Ticket', description: 'Confirmed return flight ticket to and from Thailand.', isRequired: true },
    ],
    keySpecs: [
      { id: 'ks-1', label: 'Processing Time', value: '24 Hours', icon: 'clock' },
      { id: 'ks-2', label: 'Stay Duration', value: '15 Days', icon: 'calendar' },
      { id: 'ks-3', label: 'Visa Validity', value: '30 Days', icon: 'document' },
      { id: 'ks-4', label: 'Entry Type', value: 'Single Entry', icon: 'id' },
    ],
    faqs: [
      { id: 'faq-t1', question: 'How soon can I get Thailand eVisa?', answer: 'Express eVisa is processed and sent via WhatsApp within 12-24 hours.' },
    ],
  },
];

const INITIAL_APPLICATIONS = [
  {
    id: 'app-101',
    bookingRefId: 'PV-784920',
    countryId: 'france-schengen-visa',
    countryName: 'France',
    visaTitle: 'France Schengen Tourist Visa',
    visaCategory: 'TOURIST VISA',
    variant: 'tourist',
    variantLabel: 'Standard Tourist Visa',
    processingTime: '5-7 Days',
    stayPeriod: '90 Days',
    validity: '180 Days',
    entryType: 'Multiple Entry',
    applicantName: 'Piyush Sharma',
    applicantPhone: '+91 98765 43210',
    applicantEmail: 'piyush.sharma@example.com',
    passportNumber: 'Z9876543',
    passportExpiry: '2032-11-20',
    travelDate: '2026-09-15',
    returnDate: '2026-09-30',
    travelersCount: 2,
    applicantsList: [
      {
        id: 'ap-1a',
        applicantNumber: 1,
        fullName: 'Piyush Sharma',
        phone: '+91 98765 43210',
        email: 'piyush.sharma@example.com',
        dob: '1992-05-14',
        gender: 'Male',
        address: 'Plot 42, Green Park Main, Near Metro Station, Hauz Khas',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
        passportNumber: 'Z9876543',
        passportIssuePlace: 'RPO Delhi',
        passportExpiry: '2032-11-20',
        documentsSubmitted: [
          { id: 'doc-p1', name: 'Piyush_Passport_Front_Back_Scan.pdf', category: 'Passport Scan', fileType: 'pdf', fileSize: '2.4 MB', fileUrl: 'http://localhost:5000/uploads/dummy_passport.pdf' },
        ],
      },
      {
        id: 'ap-1b',
        applicantNumber: 2,
        fullName: 'Neha Sharma',
        phone: '+91 98765 43211',
        email: 'neha.sharma@example.com',
        dob: '1994-09-18',
        gender: 'Female',
        address: 'Plot 42, Green Park Main, Near Metro Station, Hauz Khas',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110016',
        passportNumber: 'Z9876544',
        passportIssuePlace: 'RPO Delhi',
        passportExpiry: '2033-04-10',
        documentsSubmitted: [
          { id: 'doc-n1', name: 'Neha_Passport_Scan_Full.pdf', category: 'Passport Scan', fileType: 'pdf', fileSize: '2.1 MB', fileUrl: 'http://localhost:5000/uploads/dummy_passport.pdf' },
        ],
      },
    ],
    basePrice: 9998,
    gstAmount: 1799,
    totalPrice: 11797,
    paymentMethod: 'HDFC Credit Card',
    paymentTransactionId: 'TXN-998841204',
    paymentStatus: 'PAID',
    applicationStatus: 'PENDING_VERIFICATION',
    submittedAt: '2026-08-14 18:45',
    adminNotes: 'Application documents submitted via web portal.',
  },
];

const INITIAL_B2B = [
  {
    id: 'B2B-8801',
    agencyName: 'Skyline Travel & Tours',
    contactName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul@skylinetravels.com',
    businessType: 'Travel Agency',
    monthlyVolume: '10-50 Visas / mo',
    city: 'New Delhi',
    status: 'ACTIVE',
    submittedAt: '2026-08-14 14:30',
    assignedOffice: 'New Delhi HQ',
    adminNotes: 'Verified IATA travel agency license. Direct B2B partnership activated.',
  },
  {
    id: 'B2B-8802',
    agencyName: 'GlobeTrotter Travels Pvt Ltd',
    contactName: 'Priya Nair',
    phone: '+91 98123 45678',
    email: 'priya@globetrotter.in',
    businessType: 'Tour Operator',
    monthlyVolume: '50-200 Visas / mo',
    city: 'Mumbai',
    status: 'PENDING_VERIFICATION',
    submittedAt: '2026-08-15 09:15',
    assignedOffice: 'New Delhi HQ',
    adminNotes: 'Requested unbranded white-label tracking links.',
  },
];

// POST /api/seed - Seed database
router.post('/', async (req, res) => {
  try {
    await Visa.deleteMany({});
    await Application.deleteMany({});
    await B2BPartner.deleteMany({});

    const visas = await Visa.insertMany(INITIAL_VISAS);
    const apps = await Application.insertMany(INITIAL_APPLICATIONS);
    const b2b = await B2BPartner.insertMany(INITIAL_B2B);

    res.json({
      message: '🎉 MongoDB Database successfully seeded!',
      visasCount: visas.length,
      applicationsCount: apps.length,
      b2bPartnersCount: b2b.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
});

export { INITIAL_VISAS, INITIAL_APPLICATIONS, INITIAL_B2B };
export default router;
