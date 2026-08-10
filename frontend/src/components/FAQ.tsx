import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi2';

const FAQS_DATA = [
  {
    q: 'How long does it take to get a visa through Pehla Visa?',
    a: 'Dubai and most Southeast Asian visas (Singapore, Malaysia, Thailand) are processed within 24–72 hours. UK, USA, and Schengen visas take 2–4 weeks depending on the embassy schedule. We offer express processing for select countries to cut standard timelines in half.',
  },
  {
    q: 'What documents are required to apply for a visa?',
    a: 'Most applications need a valid Indian passport (6+ months validity), recent passport-size photographs, confirmed flight and hotel bookings, bank statements, and proof of employment or business. Our booking wizard shows the exact checklist for your specific destination and visa type.',
  },
  {
    q: 'Is Pehla Visa a legitimate and trusted visa agency?',
    a: 'Yes. Pehla Visa is registered with the Ministry of Tourism, Government of India, and is a member of TAAI (Travel Agents Association of India). We have processed 500,000+ visas with a 99.2% approval rate.',
  },
  {
    q: 'Can I apply for a visa for my whole family?',
    a: 'Our booking flow supports multi-traveler applications for up to 10 people including adults and children. Each traveler gets a tailored document checklist based on their age category and destination.',
  },
  {
    q: 'What happens if my visa is rejected?',
    a: 'Pehla Visa refunds our service fee for rejections caused by processing errors on our end. Embassy and government fees are non-refundable as per standard policy. Our team will help you understand the rejection reason and guide you through reapplying.',
  },
  {
    q: 'Does Dubai require a visa for Indian citizens?',
    a: 'Yes. Indian passport holders need a UAE visa to visit Dubai. We process 14-day, 30-day, and 60-day tourist visas with a typical turnaround of 24–72 hours. Apply online with your passport copy and a recent photograph.',
  },
  {
    q: 'Which countries does a Schengen visa cover?',
    a: 'A Schengen visa allows travel across 27 European countries with a single visa, including France, Germany, Italy, Spain, Netherlands, Greece, Switzerland, and Austria. Indian passport holders need a Schengen visa for any of these countries.',
  },
  {
    q: 'How do I track my visa application status?',
    a: 'Once you apply through Pehla Visa, you can track your application in real time from your dashboard. You also receive email and SMS updates at every stage — from document verification to final visa approval.',
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="section-padding bg-white">
      <div className="faq-container">
        <div className="section-header">
          <p className="faq-subtitle-tag">Got Questions?</p>
          <h2 className="section-main-title">Frequently Asked Questions</h2>
          <p className="section-desc">
            Everything you need to know about getting your visa with Pehla Visa.
          </p>
        </div>

        <div className="faq-list">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-card ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleAccordion(idx)}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <span className="faq-icon-wrapper">
                    <HiChevronDown className={`faq-chevron ${isOpen ? 'rotate' : ''}`} size={20} />
                  </span>
                </button>
                {isOpen && (
                  <div className="faq-answer-body">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
