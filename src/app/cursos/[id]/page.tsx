import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { courses } from "@/data/courses";
import { CourseDetail } from "@/components/CourseDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return courses.map((course) => ({ id: course.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);
  if (!course) return {};

  return {
    title: course.title.pt,
    description: course.summary.pt,
    alternates: { canonical: `/cursos/${course.id}` },
    openGraph: {
      title: course.title.pt,
      description: course.summary.pt,
      type: "article",
      url: `/cursos/${course.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: course.title.pt,
      description: course.summary.pt,
    },
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = courses.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <CourseDetail course={course} />
    </main>
  );
}
