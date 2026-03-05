import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectDetailClient from './ProjectDetailClient';
import { getProjects, getProjectById } from '@/lib/store';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — Malhar Pawar`,
    description: project.problem,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  const project = getProjectById(id);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <ProjectDetailClient project={project} />
      <Footer />
    </>
  );
}
