import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeClient from './HomeClient';
import { getProjects } from '@/lib/store';
import { getBlogs } from '@/lib/store';
import { getActivities } from '@/lib/store';

export default function Home() {
  const projects = getProjects().filter(p => p.status === 'published').slice(0, 3);
  const blogs = getBlogs().filter(b => b.status === 'published').slice(0, 3);
  const activities = getActivities().slice(0, 4);

  return (
    <>
      <Navbar />
      <HomeClient projects={projects} blogs={blogs} activities={activities} />
      <Footer />
    </>
  );
}
