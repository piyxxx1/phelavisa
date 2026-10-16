import mongoose from 'mongoose';

const dummyTicketSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    serviceType: { type: String, enum: ['flight', 'hotel', 'combo'], default: 'flight' },
    passengerName: { type: String, default: '' },
    passengerEmail: { type: String, default: '' },
    email: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    passengerPhone: { type: String, default: '' },
    passportNum: { type: String, default: '' },
    fromCity: { type: String, default: '' },
    toCity: { type: String, default: '' },
    departDate: { type: String, default: '' },
    returnDate: { type: String, default: '' },
    tripType: { type: String, default: 'round' },
    hotelCity: { type: String, default: '' },
    checkInDate: { type: String, default: '' },
    checkOutDate: { type: String, default: '' },
    hotelGuestName: { type: String, default: '' },
    amountPaid: { type: String, default: '₹499' },
    paymentStatus: { type: String, enum: ['PAID', 'PENDING'], default: 'PAID' },
    orderStatus: { type: String, enum: ['CONFIRMED', 'PENDING_ISSUE', 'COMPLETED'], default: 'CONFIRMED' },
    pnrCode: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true, strict: false }
);

const dummyPricingSchema = new mongoose.Schema(
  {
    id: { type: String, default: 'global_dummy_pricing' },
    flightPrice: { type: Number, default: 499 },
    hotelPrice: { type: Number, default: 399 },
    comboPrice: { type: Number, default: 799 },
  },
  { timestamps: true }
);

export const DummyTicket = mongoose.model('DummyTicket', dummyTicketSchema);
export const DummyPricing = mongoose.model('DummyPricing', dummyPricingSchema);
