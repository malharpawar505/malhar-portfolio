import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AILabClient from './AILabClient';

export const metadata = {
  title: 'AI Lab — Malhar Pawar',
  description: 'Experiments in agentic AI, LLM applications, and AI-powered data analytics by Malhar Pawar.',
};

export default function AILabPage() {
  return (
    <>
      <Navbar />
      <AILabClient />
      <Footer />
    </>
  );
}
