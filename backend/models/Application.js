import mongoose from 'mongoose';

const submittedDocumentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Document' },
  fileType: { type: String, default: 'pdf' },
  fileSize: { type: String, default: '1.5 MB' },
  fileUrl: { type: String, required: true },
});

const individualApplicantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  applicantNumber: { type: Number, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  dob: { type: String, default: '' },
  gender: { type: String, default: 'Male' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  passportNumber: { type: String, default: '' },
  passportIssuePlace: { type: String, default: '' },
  passportExpiry: { type: String, default: '' },
  documentsSubmitted: [submittedDocumentSchema],
});

const applicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    bookingRefId: { type: String, required: true, unique: true },
    countryId: { type: String, required: true },
    countryName: { type: String, required: true },
    visaTitle: { type: String, required: true },
    visaCategory: { type: String, default: 'TOURIST VISA' },
    variant: { type: String, default: 'tourist' },
    variantLabel: { type: String, default: 'Standard Tourist Visa' },
    processingTime: { type: String, default: '5-7 Days' },
    stayPeriod: { type: String, default: '30 Days' },
    validity: { type: String, default: '180 Days' },
    entryType: { type: String, default: 'Single Entry' },
    applicantName: { type: String, required: true },
    applicantPhone: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    passportNumber: { type: String, default: '' },
    passportExpiry: { type: String, default: '' },
    travelDate: { type: String, default: '' },
    returnDate: { type: String, default: '' },
    travelersCount: { type: Number, default: 1 },
    applicantsList: [mongoose.Schema.Types.Mixed],
    travelers: [mongoose.Schema.Types.Mixed],
    basePrice: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Online UPI / Card' },
    paymentTransactionId: { type: String, default: '' },
    paymentStatus: { type: String, default: 'PAID' },
    applicationStatus: {
      type: String,
      enum: ['PENDING_VERIFICATION', 'UNDER_EMBASSY_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'PENDING_VERIFICATION',
    },
    submittedAt: { type: String, required: true },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true, strict: false }
);

export const Application = mongoose.model('Application', applicationSchema);
