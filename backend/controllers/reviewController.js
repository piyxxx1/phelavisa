import { Review } from '../models/Review.js';

// Default initial seed reviews with Pehla Visa branding
const DEFAULT_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    visa: 'Dubai Visa',
    rating: 5,
    date: 'July 2026',
    initial: 'P',
    color: '#2563eb',
    quote: 'Amazing service! Got my Dubai visa in just 2 hours. The team was super helpful and the process was seamless. Highly recommend Pehla Visa for anyone planning to travel.',
    isFeatured: true,
  },
  {
    id: 'rev-2',
    name: 'Rajesh Kumar',
    location: 'Delhi, India',
    visa: 'Singapore Visa',
    rating: 5,
    date: 'June 2026',
    initial: 'R',
    color: '#7c3aed',
    quote: 'I was worried about the visa process, but Pehla Visa made it so easy! Got my Singapore visa approved within 3 days. Professional service and great communication.',
    isFeatured: true,
  },
  {
    id: 'rev-3',
    name: 'Anita Patel',
    location: 'Ahmedabad, India',
    visa: 'Thailand Visa',
    rating: 5,
    date: 'July 2026',
    initial: 'A',
    color: '#db2777',
    quote: 'Excellent experience with Pehla Visa. The team guided me through every step for my Thailand visa. Fast, reliable, and trustworthy service. Will definitely use again!',
    isFeatured: true,
  },
  {
    id: 'rev-4',
    name: 'Vikram Singh',
    location: 'Bangalore, India',
    visa: 'USA Visa',
    rating: 5,
    date: 'May 2026',
    initial: 'V',
    color: '#0284c7',
    quote: "Getting a US visa seemed impossible, but Pehla Visa's expert team made it happen! Their guidance and document preparation service was outstanding. Thank you!",
    isFeatured: true,
  },
  {
    id: 'rev-5',
    name: 'Meera Joshi',
    location: 'Pune, India',
    visa: 'UK Visa',
    rating: 5,
    date: 'June 2026',
    initial: 'M',
    color: '#059669',
    quote: 'Professional and efficient service for my UK visa application. The team was always available to answer my questions. Got my visa approved in 15 days!',
    isFeatured: true,
  },
  {
    id: 'rev-6',
    name: 'Arjun Reddy',
    location: 'Hyderabad, India',
    visa: 'Canada Visa',
    rating: 5,
    date: 'April 2026',
    initial: 'A',
    color: '#d97706',
    quote: 'Pehla Visa exceeded my expectations! They handled my Canada visa application perfectly. Great communication and follow-up throughout the process.',
    isFeatured: true,
  },
];

/**
 * @desc Get all customer reviews (Auto-seed default reviews if empty)
 * @route GET /api/reviews
 */
export const getAllReviews = async (req, res) => {
  try {
    let reviews = await Review.find().sort({ createdAt: -1 });

    if (!reviews || reviews.length === 0) {
      console.log('Seeding default Pehla Visa customer reviews to MongoDB...');
      await Review.insertMany(DEFAULT_REVIEWS);
      reviews = await Review.find().sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.warn('MongoDB connection notice in getAllReviews:', error.message);
    res.json({
      success: true,
      count: DEFAULT_REVIEWS.length,
      data: DEFAULT_REVIEWS,
      isFallback: true,
    });
  }
};

/**
 * @desc Create new customer review
 * @route POST /api/reviews
 */
export const createReview = async (req, res) => {
  try {
    const { name, location, visa, rating, quote, avatarUrl, date, isFeatured } = req.body;

    if (!name || !quote || !visa) {
      return res.status(400).json({
        success: false,
        message: 'Name, visa destination, and review quote are required fields.',
      });
    }

    const initials = name.trim().charAt(0).toUpperCase();
    const colors = ['#2563eb', '#7c3aed', '#db2777', '#0284c7', '#059669', '#d97706', '#dc2626'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newReview = new Review({
      id: 'rev-' + Date.now(),
      name: name.trim(),
      location: location ? location.trim() : 'India',
      visa: visa.trim(),
      rating: Number(rating) || 5,
      quote: quote.trim(),
      date: date || 'August 2026',
      initial: initials,
      color: randomColor,
      avatarUrl: avatarUrl || '',
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : true,
    });

    const saved = await newReview.save();
    res.status(201).json({
      success: true,
      message: 'Customer review created successfully!',
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update customer review by ID
 * @route PUT /api/reviews/:id
 */
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, visa, rating, quote, avatarUrl, date, isFeatured } = req.body;

    const existing = await Review.findOne({ id });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (name) existing.name = name.trim();
    if (location !== undefined) existing.location = location.trim();
    if (visa) existing.visa = visa.trim();
    if (rating !== undefined) existing.rating = Number(rating);
    if (quote) existing.quote = quote.trim();
    if (avatarUrl !== undefined) existing.avatarUrl = avatarUrl;
    if (date !== undefined) existing.date = date;
    if (isFeatured !== undefined) existing.isFeatured = Boolean(isFeatured);

    const updated = await existing.save();

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Delete review by ID
 * @route DELETE /api/reviews/:id
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Review.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
