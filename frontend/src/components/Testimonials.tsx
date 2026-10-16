import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  visa: string;
  rating?: number;
  date?: string;
  initial?: string;
  color?: string;
  quote: string;
  avatarUrl?: string;
  isFeatured?: boolean;
}

const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    visa: 'Dubai Visa',
    rating: 5,
    date: 'July 2026',
    initial: 'P',
    color: '#6366f1',
    quote: 'Amazing service! Got my Dubai visa in just 2 hours. The team was super helpful and the process was seamless. Highly recommend Pehla Visa for anyone planning to travel.',
  },
  {
    id: 'rev-2',
    name: 'Rajesh Kumar',
    location: 'Delhi, India',
    visa: 'Singapore Visa',
    rating: 5,
    date: 'June 2026',
    initial: 'R',
    color: '#8b5cf6',
    quote: 'I was worried about the visa process, but Pehla Visa made it so easy! Got my Singapore visa approved within 3 days. Professional service and great communication.',
  },
  {
    id: 'rev-3',
    name: 'Anita Patel',
    location: 'Ahmedabad, India',
    visa: 'Thailand Visa',
    rating: 5,
    date: 'July 2026',
    initial: 'A',
    color: '#ec4899',
    quote: 'Excellent experience with Pehla Visa. The team guided me through every step for my Thailand visa. Fast, reliable, and trustworthy service. Will definitely use again!',
  },
  {
    id: 'rev-4',
    name: 'Vikram Singh',
    location: 'Bangalore, India',
    visa: 'USA Visa',
    rating: 5,
    date: 'May 2026',
    initial: 'V',
    color: '#3b82f6',
    quote: "Getting a US visa seemed impossible, but Pehla Visa's expert team made it happen! Their guidance and document preparation service was outstanding. Thank you!",
  },
  {
    id: 'rev-5',
    name: 'Meera Joshi',
    location: 'Pune, India',
    visa: 'UK Visa',
    rating: 5,
    date: 'June 2026',
    initial: 'M',
    color: '#10b981',
    quote: 'Professional and efficient service for my UK visa application. The team was always available to answer my questions. Got my visa approved in 15 days!',
  },
  {
    id: 'rev-6',
    name: 'Arjun Reddy',
    location: 'Hyderabad, India',
    visa: 'Canada Visa',
    rating: 5,
    date: 'April 2026',
    initial: 'A',
    color: '#f59e0b',
    quote: 'Pehla Visa exceeded my expectations! They handled my Canada visa application perfectly. Great communication and follow-up throughout the process.',
  },
];

export const Testimonials: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(DEFAULT_REVIEWS);

  useEffect(() => {
    const fetchLiveReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setReviewsList(data.data);
        }
      } catch (err) {
        console.warn('Backend API review fetch notice (using defaults):', err);
      }
    };

    fetchLiveReviews();
  }, []);

  return (
    <section className="section-padding bg-gray-light">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-main-title">What Our Customers Say</h2>
          <p className="section-desc">
            Join thousands of satisfied travelers who trusted Pehla Visa for their visa processing needs
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="testimonials-grid">
          {reviewsList.map((rev, i) => (
            <div key={rev.id || i} className="review-card">
              <div className="star-rating">
                {[...Array(rev.rating || 5)].map((_, sIdx) => (
                  <svg key={sIdx} className="star-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                ))}
              </div>

              <blockquote className="review-text">
                "{rev.quote}"
              </blockquote>

              <div className="review-author-row">
                {rev.avatarUrl ? (
                  <img
                    src={rev.avatarUrl}
                    alt={rev.name}
                    className="author-avatar-img"
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="author-avatar" style={{ backgroundColor: rev.color || '#2563eb' }}>
                    {rev.initial || rev.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="author-meta">
                  <div className="author-name">{rev.name}</div>
                  <div className="author-sub">{rev.location} • <span className="visa-name-highlight">{rev.visa}</span></div>
                  {rev.date && <div className="author-date">{rev.date}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Metrics Banner */}
        <div className="metrics-banner">
          <div className="metric-box">
            <div className="metric-num">50K+</div>
            <div className="metric-label">Happy Customers</div>
          </div>
          <div className="metric-box">
            <div className="metric-num">4.9 ★</div>
            <div className="metric-label">Average Rating</div>
          </div>
          <div className="metric-box">
            <div className="metric-num">99.4%</div>
            <div className="metric-label">Approval Success</div>
          </div>
        </div>
      </div>
    </section>
  );
};
