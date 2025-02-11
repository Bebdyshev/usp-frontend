import Header from '@/components/landing/header';
import CTA from '@/components/landing/cta';
import Clouds from '@/components/landing/clouds';
import Hero from '@/components/landing/hero';
import Bento from '@/components/landing/bento';
import News from '@/components/landing/news';

export default function Home() {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <CTA />
        <Hero />
        <Bento />
        <Clouds />
        <News />
      </div>
    );
  }