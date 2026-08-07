import React from 'react';

const FEATURES = [
  {
    title: 'Lightning Fast Processing',
    desc: 'Get your visa approved in record time with our streamlined digital process. Most visas processed within 24-48 hours.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
    ),
  },
  {
    title: '99.2% Success Rate',
    desc: 'Our expert team ensures your application meets all requirements with the highest approval rate in the industry.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
  },
  {
    title: '24/7 Expert Support',
    desc: 'Round-the-clock assistance from visa specialists who guide you through every step of the application process.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
  },
  {
    title: '100% Secure & Confidential',
    desc: 'Your personal information and documents are protected with bank-level security and encryption.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
    ),
  },
  {
    title: 'Transparent Pricing',
    desc: 'No hidden fees or surprise charges. Clear, upfront pricing with money-back guarantee if visa is rejected.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
    ),
  },
  {
    title: 'Global Coverage',
    desc: 'Apply for visas to 150+ countries worldwide. From tourist visas to business permits, we cover it all.',
    icon: (
      <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path>
      </svg>
    ),
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-main-title">Why Choose Pehla Visa?</h2>
          <p className="section-desc">
            Join thousands of travelers who trust us for fast, reliable, and hassle-free visa processing
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feat, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon-box">
                {feat.icon}
              </div>
              <h3 className="feature-title">{feat.title}</h3>
              <p className="feature-desc">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Big CTA Card */}
        <div className="features-cta-banner">
          <h3 className="cta-banner-title">Ready to Get Your Visa with Pehla Visa?</h3>
          <p className="cta-banner-desc">
            Start your application today and join 50,000+ satisfied travelers who got their visas on time
          </p>
          <a href="#apply" className="cta-banner-btn">
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
