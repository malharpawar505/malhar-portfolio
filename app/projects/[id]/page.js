'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Reveal } from '@/components/Reveal';
import { ArrowLeft, Zap, Layers, Box, Database, BarChart3, Award, Github, ExternalLink } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(data => { setProject(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="pt-28 pb-24 min-h-screen max-w-3xl mx-auto px-5 sm:px-8">
        <div className="h-8 w-32 shimmer rounded mb-8" />
        <div className="h-12 w-3/4 shimmer rounded mb-4" />
        <div className="h-6 w-1/2 shimmer rounded mb-12" />
        {[1,2,3].map(i => <div key={i} className="h-32 shimmer rounded-xl mb-6" />)}
      </div>
    );
  }

  if (!project || project.error) {
    return (
      <div className="pt-28 pb-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link href="/projects" className="text-accent hover:underline">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  const sections = [
    { icon: Zap, title: 'Business Problem', content: project.problem },
    { icon: Layers, title: 'Data Architecture', content: project.architecture },
    { icon: Box, title: 'Data Modeling', content: project.modeling },
    { icon: Database, title: 'ETL / Pipeline', content: project.pipeline },
    { icon: BarChart3, title: 'Dashboards & Reporting', content: project.dashboards },
    { icon: Award, title: 'Key Insights & Impact', content: project.insights },
  ].filter(s => s.content);

  return (
    <div className="page-enter pt-28 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <Reveal>
          <Link href="/projects"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent transition-colors mb-8 group">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Projects
          </Link>
        </Reveal>

        <Reveal delay={1}>
          <div className="mb-12">
            <div className="flex gap-2 flex-wrap mb-5">
              <span className="tag-green px-3 py-1.5 rounded-full text-xs font-semibold">{project.category}</span>
              <span className="tag-gold px-3 py-1.5 rounded-full text-xs font-semibold">{project.industry}</span>
              <span className="tag-blue px-3 py-1.5 rounded-full text-xs font-semibold">{project.timeline}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-5">{project.title}</h1>
            <div className="flex gap-2 flex-wrap">
              {project.tools?.map((t, i) => (
                <span key={i} className="px-3 py-1.5 bg-bg-card border border-border rounded-lg text-xs font-mono text-text-secondary">{t}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="space-y-0">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <Reveal key={i} delay={i + 2}>
                <div className="py-8 border-b border-border last:border-b-0">
                  <h3 className="flex items-center gap-3 text-lg font-bold text-accent mb-4">
                    <Icon size={20} /> {section.title}
                  </h3>
                  <p className="text-[15px] text-text-secondary leading-[1.85]">{section.content}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {project.github && (
          <Reveal>
            <a href={project.github} target="_blank" rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-sm font-semibold hover:border-accent hover:text-accent transition-all">
              <Github size={16} /> View on GitHub <ExternalLink size={14} />
            </a>
          </Reveal>
        )}
      </div>
    </div>
  );
}
