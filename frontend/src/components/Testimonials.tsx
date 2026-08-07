import React from 'react';

const REVIEWS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    visa: 'Dubai Visa',
    date: 'July 2025',
    initial: 'P',
    color: '#6366f1',
    quote: 'Amazing service! Got my Dubai visa in just 2 hours. The team was super helpful and the process was seamless. Highly recommend 99Country for anyone planning to travel.',
  },
  {
    name: 'Rajesh Kumar',
    location: 'Delhi, India',
    visa: 'Singapore Visa',
    date: 'June 2025',
    initial: 'R',
    color: '#8b5cf6',
    quote: 'I was worried about the visa process, but 99Country made it so easy! Got my Singapore visa approved within 3 days. Professional service and great communication.',
  },
  {
    name: 'Anita Patel',
    location: 'Ahmedabad, India',
    visa: 'Thailand Visa',
    date: 'July 2025',
    initial: 'A',
    color: '#ec4899',
    quote: 'Excellent experience with 99Country. The team guided me through every step for my Thailand visa. Fast, reliable, and trustworthy service. Will definitely use again!',
  },
  {
    name: 'Vikram Singh',
    location: 'Bangalore, India',
    visa: 'USA Visa',
    date: 'May 2025',
    initial: 'V',
    color: '#3b82f6',
    quote: "Getting a US visa seemed impossible, but 99Country's expert team made it happen! Their guidance and document preparation service was outstanding. Thank you!",
  },
  {
    name: 'Meera Joshi',
    location: 'Pune, India',
    visa: 'UK Visa',
    date: 'June 2025',
    initial: 'M',
    color: '#10b981',
    quote: 'Professional and efficient service for my UK visa application. The team was always available to answer my questions. Got my visa approved in 15 days!',
  },
  {
    name: 'Arjun Reddy',
    location: 'Hyderabad, India',
    visa: 'Canada Visa',
    date: 'April 2025',
    initial: 'A',
    color: '#f59e0b',
    quote: '99Country exceeded my expectations! They handled my Canada visa application perfectly. Great communication and follow-up throughout the process.',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="section-padding bg-gray-light">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-main-title">What Our Customers Say</h2>
          <p className="section-desc">
            Join thousands of satisfied travelers who trusted 99Country for their visa processing needs
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="testimonials-grid">
          {REVIEWS.map((rev, i) => (
            <div key={i} className="review-card">
              <div className="star-rating">
                {[...Array(5)].map((_, sIdx) => (
                  <svg key={sIdx} className="star-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                ))}
              </div>

              <blockquote className="review-text">
                "{rev.quote}"
              </blockquote>

              <div className="review-author-row">
                <div className="author-avatar" style={{ backgroundColor: rev.color }}>
                  {rev.initial}
                </div>
                <div className="author-meta">
                  <div className="author-name">{rev.name}</div>
                  <div className="author-sub">{rev.location} • <span className="visa-name-highlight">{rev.visa}</span></div>
                  <div className="author-date">{rev.date}</div>
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
            <div className="metric-num">99.2%</div>
            <div className="metric-label">Success Rate</div>
          </div>
          <div className="metric-box">
            <div className="metric-num">24/7</div>
            <div className="metric-label">Support</div>
          </div>
        </div>

        <div className="cta-center-box">
          <a href="#apply" className="primary-cta-btn">
            Start Your Application
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
