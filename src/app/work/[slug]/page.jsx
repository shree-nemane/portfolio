import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "../../../data/projects";
import ProjectEditorialView from "../../../components/ProjectEditorialView";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = project.title;
  const description =
    project.tagline ||
    project.description ||
    `${project.title} — Software project by Shree Nemane.`;

  return {
    title: title,
    description: description,
    alternates: {
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      title: `${title} | Shree Nemane`,
      description: description,
      url: `/work/${project.slug}`,
      images: project.image ? [{ url: project.image, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Shree Nemane`,
      description: description,
      images: project.image ? [project.image] : [],
    },
  };
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
