import Header from '@/components/landing/header';
import CTA from '@/components/landing/cta';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <CTA />
      </main>
    </div>
  );
}