import React from 'react';
import {
  HiBolt,
  HiCheckBadge,
  HiClock,
  HiLockClosed,
  HiBanknotes,
  HiGlobeAmericas,
  HiArrowRight,
} from 'react-icons/hi2';

const FEATURES = [
  {
    title: 'Lightning Fast Processing',
    desc: 'Get your visa approved in record time with our streamlined digital process. Most visas processed within 24-48 hours.',
    icon: <HiBolt size={28} />,
  },
  {
    title: '99.2% Success Rate',
    desc: 'Our expert team ensures your application meets all requirements with the highest approval rate in the industry.',
    icon: <HiCheckBadge size={28} />,
  },
  {
    title: '24/7 Expert Support',
    desc: 'Round-the-clock assistance from visa specialists who guide you through every step of the application process.',
    icon: <HiClock size={28} />,
  },
  {
    title: '100% Secure & Confidential',
    desc: 'Your personal information and documents are protected with bank-level security and encryption.',
    icon: <HiLockClosed size={28} />,
  },
  {
    title: 'Transparent Pricing',
    desc: 'No hidden fees or surprise charges. Clear, upfront pricing with money-back guarantee if visa is rejected.',
    icon: <HiBanknotes size={28} />,
  },
  {
    title: 'Global Coverage',
    desc: 'Apply for visas to 150+ countries worldwide. From tourist visas to business permits, we cover it all.',
    icon: <HiGlobeAmericas size={28} />,
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
          <a href="#visas" className="cta-banner-btn">
            Start Your Application
            <HiArrowRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};
