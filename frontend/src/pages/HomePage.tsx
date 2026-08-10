import { Hero } from '../components/Hero';
import { PopularVisas } from '../components/PopularVisas';
import { Testimonials } from '../components/Testimonials';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { FAQ } from '../components/FAQ';
import type { VisaDestination } from '../data/visasData';

interface HomePageProps {
  onSelectVisa?: (visa: VisaDestination) => void;
}

export const HomePage = ({ onSelectVisa }: HomePageProps) => {
  return (
    <>
      <Hero />
      <PopularVisas onSelectVisa={onSelectVisa} />
      <Testimonials />
      <WhyChooseUs />
      <FAQ />
    </>
  );
};
