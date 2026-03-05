import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogClient from './BlogClient';
import { getBlogs } from '@/lib/store';

export const metadata = {
  title: 'Blog — Malhar Pawar',
  description: 'Articles on data engineering, Power BI, Azure analytics, and AI by Malhar Pawar.',
};

export default function BlogPage() {
  const blogs = getBlogs().filter(b => b.status === 'published');
  return (
    <>
      <Navbar />
      <BlogClient blogs={blogs} />
      <Footer />
    </>
  );
}
