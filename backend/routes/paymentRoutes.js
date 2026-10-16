import express from 'express';
import {
  getStripeConfig,
  createCheckoutSession,
  createPaymentIntent,
  verifyPayment,
  verifyAndConfirmOrder,
  handleWebhook,
  getRazorpayConfig,
  createRazorpayOrder,
  verifyRazorpaySignature,
  testEmailTrigger,
} from '../controllers/paymentController.js';

const router = express.Router();

// GET Razorpay Key Config
router.get('/razorpay/config', getRazorpayConfig);

// POST Create Razorpay Order
router.post('/razorpay/create-order', createRazorpayOrder);

// POST Verify Razorpay Signature & Save Order
router.post('/razorpay/verify-signature', verifyRazorpaySignature);

// POST Test Email Notification Endpoint
router.post('/test-email', testEmailTrigger);

// GET Stripe Publishable Key config
router.get('/config', getStripeConfig);

// POST Create Official Stripe Hosted Checkout Session
router.post('/create-checkout-session', createCheckoutSession);

// POST Create Stripe PaymentIntent
router.post('/create-intent', createPaymentIntent);

// POST Verify Stripe Payment Status
router.post('/verify', verifyPayment);

// POST Secret Verification & Automatic Order Creation
router.post('/verify-and-confirm', verifyAndConfirmOrder);

// POST Stripe Webhook Event Listener
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
