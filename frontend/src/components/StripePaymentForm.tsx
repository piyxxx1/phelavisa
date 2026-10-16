import React, { useState } from 'react';
import { HiCreditCard, HiLockClosed, HiSparkles } from 'react-icons/hi2';
import { API_BASE_URL } from '../config/apiConfig';

interface StripePaymentFormProps {
  amount: number;
  currency?: string;
  countryName: string;
  bookingRefId: string;
  applicantName: string;
  applicantEmail: string;
  onPaymentSuccess: (paymentResult: { paymentIntentId: string; status: string }) => void;
  onPaymentError?: (errorMessage: string) => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  amount,
  currency = 'INR',
  countryName,
  bookingRefId,
  applicantName,
  applicantEmail,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(applicantName || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Quick Auto-fill Stripe Standard Test Card
  const handleAutoFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('123');
    setCardName(applicantName || 'Piyush Sharma');
    setPaymentError(null);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 15) {
      setPaymentError('Please enter a valid 16-digit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setPaymentError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      setPaymentError('Please enter a valid 3-digit CVC code.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create PaymentIntent on Backend Express Server
      const intentRes = await fetch(`${API_BASE_URL}/payment/create-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          countryName,
          bookingRefId,
          applicantName: cardName || applicantName,
          applicantEmail,
        }),
      });

      const intentData = await intentRes.json();

      if (!intentRes.ok || !intentData.success) {
        throw new Error(intentData.message || 'Failed to initialize Stripe PaymentIntent');
      }

      // 2. Verify Payment on Backend
      const verifyRes = await fetch(`${API_BASE_URL}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: intentData.paymentIntentId,
        }),
      });

      const verifyData = await verifyRes.json();

      setIsProcessing(false);

      if (verifyData.success && verifyData.status === 'succeeded') {
        onPaymentSuccess({
          paymentIntentId: intentData.paymentIntentId,
          status: 'succeeded',
        });
      } else {
        throw new Error(verifyData.message || 'Payment verification pending or failed');
      }
    } catch (err: any) {
      setIsProcessing(false);
      const errMsg = err.message || 'An unexpected error occurred during Stripe payment processing.';
      setPaymentError(errMsg);
      if (onPaymentError) onPaymentError(errMsg);
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '0.85rem', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
      {/* Stripe Header & Test Chip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: '#635bff', color: '#ffffff', width: '32px', height: '32px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HiCreditCard size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
              Stripe Secure Payment
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>256-Bit SSL Encrypted Transaction</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAutoFillTestCard}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#f1f5f9',
            color: '#475569',
            border: '1px solid #cbd5e1',
            borderRadius: '0.35rem',
            padding: '0.3rem 0.65rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <HiSparkles size={14} style={{ color: '#635bff' }} />
          <span>Fill Stripe Test Card (4242...)</span>
        </button>
      </div>

      {paymentError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.6rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.825rem', marginBottom: '1rem' }}>
          ⚠️ {paymentError}
        </div>
      )}

      <form onSubmit={handleSubmitPayment}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Cardholder Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              Cardholder Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Piyush Sharma"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Card Number */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
              Card Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength={19}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  letterSpacing: '1px',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              <HiCreditCard size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
          </div>

          {/* Expiry & CVC Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Expiry Date (MM/YY)
              </label>
              <input
                type="text"
                required
                placeholder="MM / YY"
                value={cardExpiry}
                onChange={handleExpiryChange}
                maxLength={5}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                CVC / CVV Code
              </label>
              <input
                type="password"
                required
                placeholder="123"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                maxLength={4}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Payment Button */}
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            width: '100%',
            marginTop: '1.25rem',
            background: isProcessing ? '#94a3b8' : '#635bff',
            color: '#ffffff',
            padding: '0.85rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 14px rgba(99,91,255,0.3)',
          }}
        >
          {isProcessing ? (
            <span>Processing Stripe Transaction...</span>
          ) : (
            <>
              <HiLockClosed size={18} />
              <span>Pay ₹{amount.toLocaleString('en-IN')} via Stripe</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
