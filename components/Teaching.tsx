interface Course {
  code: string;
  name: string;
  level: "graduate" | "undergraduate";
}

const COURSES: Course[] = [
  {
    code: "POSC 202A",
    name: "Survey of Quantitative Methods",
    level: "graduate",
  },
  {
    code: "POSC 202B",
    name: "Survey of Quantitative Methods",
    level: "graduate",
  },
  {
    code: "POSC 010",
    name: "American Politics",
    level: "undergraduate",
  },
  {
    code: "POSC 015",
    name: "Comparative Politics",
    level: "undergraduate",
  },
  {
    code: "POSC 017",
    name: "Politics of Global South",
    level: "undergraduate",
  },
  {
    code: "POSC 186",
    name: "Regulation: A Political Perspective",
    level: "undergraduate",
  },
  {
    code: "POSC 182E",
    name: "Politics and Economic Policy: American Politics",
    level: "undergraduate",
  },
];

export default function Teaching() {
  const graduateCourses = COURSES.filter((c) => c.level === "graduate");
  const undergraduateCourses = COURSES.filter(
    (c) => c.level === "undergraduate"
  );

  return (
    <section id="teaching" className="py-20">
      <h3 className="mb-6 text-2xl font-semibold text-slate-200">Teaching</h3>

      <p className="text-base text-slate-200">
        Teaching Assistant &mdash; UC Riverside (2023 &ndash; Present)
      </p>

      {/* Graduate Courses */}
      <h3 className="mt-8 mb-4 text-sm font-medium uppercase tracking-widest text-slate-500">
        Graduate
      </h3>
      <ul className="space-y-2">
        {graduateCourses.map((course) => (
          <li key={course.code} className="text-base">
            <span className="font-mono text-cyan-400">{course.code}</span>
            <span className="text-slate-200"> {course.name}</span>
          </li>
        ))}
      </ul>

      {/* Undergraduate Courses */}
      <h3 className="mt-8 mb-4 text-sm font-medium uppercase tracking-widest text-slate-500">
        Undergraduate
      </h3>
      <ul className="space-y-2">
        {undergraduateCourses.map((course) => (
          <li key={course.code} className="text-base">
            <span className="font-mono text-cyan-400">{course.code}</span>
            <span className="text-slate-200"> {course.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
