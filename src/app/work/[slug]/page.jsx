import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "../../../data/projects";
import ProjectEditorialView from "../../../components/ProjectEditorialView";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

// Render the Modular Editorial Storytelling Canvas (automatically adapts for web, mobile, and lab experiments)
  return <ProjectEditorialView project={project} />;
}
