// app/dashboard/projects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import ProjectList from "@/app/projects/components/ProjectList"
import { Project } from "@/types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        next: { revalidate: 60 },
      });
      const data = await res.json();
      setProjects(data);
    };
    
    fetchProjects();
  }, []); // Empty dependency array since we only want to run once

  return (
    <ProjectList
      projects={projects}
      title="My Projects"
      description="Here are some of my recent projects. Click on the links to view the code or live demo."
      layout="grid"
      showViewAll={false}
    />
  )
}