import type { Metadata } from "next";
import { courses } from "@/data/courses";
import { CourseCard } from "@/components/CourseCard";
import { PageHeading } from "@/components/PageHeading";
import { CoursesEmptyState } from "@/components/CoursesEmptyState";

export const metadata: Metadata = {
  title: "Cursos",
  description:
    "Cursos e formações de Marcos em inteligência artificial, engenharia de software e infraestrutura.",
  alternates: { canonical: "/cursos" },
  twitter: {
    card: "summary_large_image",
    title: "Cursos — Marcos",
    description:
      "Cursos e formações de Marcos em inteligência artificial, engenharia de software e infraestrutura.",
  },
};

export default function CursosPage() {
  const sortedCourses = [...courses].sort((a, b) => {
    if (a.status === "em-andamento" && b.status !== "em-andamento") return -1;
    if (a.status !== "em-andamento" && b.status === "em-andamento") return 1;
    const dateA = a.completedAt ?? "";
    const dateB = b.completedAt ?? "";
    return dateB.localeCompare(dateA);
  });

  return (
    <main className="flex-1 px-6 pt-16 pb-20 text-foreground">
      <PageHeading pageKey="cursos" />

      {sortedCourses.length === 0 ? (
        <div className="mx-auto max-w-xl">
          <CoursesEmptyState />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </main>
  );
}
