import { Hero } from '../components/Hero';
import { PopularVisas } from '../components/PopularVisas';
import { Testimonials } from '../components/Testimonials';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { FAQ } from '../components/FAQ';

export const HomePage = () => {
  return (
    <>
      <Hero />
      <PopularVisas />
      <Testimonials />
      <WhyChooseUs />
      <FAQ />
    </>
  );
};
