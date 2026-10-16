import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51PhelavisaDummySecretKey123';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

export const getStripePublishableKey = () => {
  return process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51PhelavisaDummyPublishableKey123';
};
