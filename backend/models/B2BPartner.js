import mongoose from 'mongoose';

const b2bPartnerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    agencyName: { type: String, required: true },
    contactName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    businessType: { type: String, default: 'Travel Agency' },
    monthlyVolume: { type: String, default: '10-50 Visas / mo' },
    city: { type: String, default: 'New Delhi' },
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING_VERIFICATION'],
      default: 'PENDING_VERIFICATION',
    },
    assignedOffice: { type: String, default: 'New Delhi HQ' },
    submittedAt: { type: String, required: true },
    adminNotes: { type: String, default: '' },
    verificationFile: { type: String, default: '' },
    verificationFileName: { type: String, default: '' },
  },
  { timestamps: true }
);

export const B2BPartner = mongoose.model('B2BPartner', b2bPartnerSchema);
