import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsClient from './ProjectsClient';
import { getProjects } from '@/lib/store';

export const metadata = {
  title: 'Projects — Malhar Pawar',
  description: 'Data engineering, BI, and analytics projects by Malhar Pawar.',
};

export default function ProjectsPage() {
  const projects = getProjects().filter(p => p.status === 'published');
  return (
    <>
      <Navbar />
      <ProjectsClient projects={projects} />
      <Footer />
    </>
  );
}
