import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

export const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_TbE9pDpy0cOe05';
export const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'GTtKHdBkzH0h5EqklzZzbH5W';

export const razorpayInstance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
});
