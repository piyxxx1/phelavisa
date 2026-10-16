export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Visa Manager' | 'Support Specialist';
  avatar?: string;
}

export interface DocumentRequirement {
  id: string;
  category: 'mandatory' | 'financial' | 'travel';
  title: string;
  description: string;
  isRequired: boolean;
}

export interface VisaFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface KeySpecificationItem {
  id: string;
  label: string;
  value: string;
  icon?: string;
}

export interface CustomVisaDetails {
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
  processingTime: string;
  stayPeriod: string;
  validity: string;
  entryType: string;
  popular: boolean;
  express: boolean;
  docChecklist?: DocumentRequirement[];
  faqs?: VisaFaqItem[];
  keySpecs?: KeySpecificationItem[];
  gstPercentage?: number;
}

export interface SubmittedDocumentFile {
  id: string;
  name: string;
  category: string;
  fileType: 'pdf' | 'image';
  fileSize: string;
  fileUrl: string;
}

export interface IndividualApplicantRecord {
  id: string;
  applicantNumber: number;
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  passportNumber: string;
  passportIssuePlace: string;
  passportExpiry: string;
  documentsSubmitted: SubmittedDocumentFile[];
}

export interface VisaApplicationRecord {
  id: string;
  bookingRefId: string;
  countryId: string;
  countryName: string;
  visaTitle?: string;
  visaCategory?: 'TOURIST VISA' | 'EVISA' | 'BUSINESS VISA';
  variant: string;
  variantLabel?: string;
  processingTime?: string;
  stayPeriod?: string;
  validity?: string;
  entryType?: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  passportNumber?: string;
  passportExpiry?: string;
  travelDate?: string;
  returnDate?: string;
  travelersCount: number;
  applicantsList?: IndividualApplicantRecord[];
  basePrice?: number;
  gstAmount?: number;
  totalPrice: number;
  paymentMethod: string;
  paymentTransactionId?: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  applicationStatus: 'PENDING_VERIFICATION' | 'UNDER_EMBASSY_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  adminNotes?: string;
}
