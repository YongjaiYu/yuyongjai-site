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
    <section id="teaching" className="site_section">
      <h2 className="section_heading">Teaching</h2>

      <h3 className="section_kicker mb-4">Instructor</h3>

      <div className="card_grid">
        <article className="surface_card">
          <h4 className="font-semibold leading-snug text-slate-200">
            Summer Quant Camp Instructor
          </h4>
          <p className="mt-1 text-base text-slate-400">UC Riverside</p>
          <p className="mt-2 font-sans text-base leading-relaxed text-slate-300">
            Instruction in foundational statistics and R for incoming
            graduate students.
          </p>
        </article>

        <article className="surface_card">
          <h4 className="font-semibold leading-snug text-slate-200">
            MacREU Instructor
          </h4>
          <p className="mt-1 text-base text-slate-400">UC Riverside</p>
          <p className="mt-2 font-sans text-base leading-relaxed text-slate-300">
            Guest lectures on data literacy, research presentations, poster
            design, and abstract writing for the MacREU/MEMENCYS summer
            program.
          </p>
        </article>
      </div>

      <h3 className="section_kicker mb-4 mt-12">Teaching Assistant</h3>

      <p className="content_limiter font-sans text-base text-slate-300">
        UC Riverside (2023 &ndash; Present)
      </p>

      <div className="card_grid mt-8">
        <div className="surface_card">
          <h4 className="section_kicker mb-4">
            Graduate
          </h4>
          <ul className="grid gap-2">
            {graduateCourses.map((course) => (
              <li key={course.code} className="text-base">
                <span className="font-mono text-cyan-400">{course.code}</span>
                <span className="text-slate-200"> {course.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface_card">
          <h4 className="section_kicker mb-4">
            Undergraduate
          </h4>
          <ul className="grid gap-2">
            {undergraduateCourses.map((course) => (
              <li key={course.code} className="text-base">
                <span className="font-mono text-cyan-400">{course.code}</span>
                <span className="text-slate-200"> {course.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
