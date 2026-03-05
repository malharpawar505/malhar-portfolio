import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactClient from './ContactClient';

export const metadata = {
  title: 'Contact — Malhar Pawar',
  description: 'Get in touch with Malhar Pawar for data engineering, BI, or AI consulting.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactClient />
      <Footer />
    </>
  );
}
