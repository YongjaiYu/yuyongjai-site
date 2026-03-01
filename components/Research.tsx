interface WorkingPaper {
  title: string;
  coauthors?: string;
  status: string;
  description: string;
  tags: string[];
}

interface WorkInProgress {
  title: string;
  coauthors?: string;
  status?: string;
}

interface Publication {
  authors: string;
  year: number;
  title: string;
  journal: string;
  highlighted: string;
}

const WORKING_PAPERS: WorkingPaper[] = [
  {
    title: "Campaign Contributions and Conspiracy Theory Propagation",
    status: "Work in progress",
    description:
      "Politicians may spread conspiracy theories to raise funds from extremists. Uses 2012 and 2016 ANES data. Finding: Among Republicans, conspiracy theory believers contribute more to candidates.",
    tags: ["Campaign Finance", "Conspiracy Theories", "ANES"],
  },
  {
    title:
      "When Text Meets Image: Unlocking Frames of Political Videos with Multimodal CLIP",
    coauthors: "with Eunseong Oh",
    status: "Presented at PolMeth 2025",
    description:
      "Uses CLIP technology to analyze how political videos portray megadonors. Applies multimodal deep learning to understand the framing of political visual media.",
    tags: ["Multimodal Analysis", "CLIP", "Political Communication"],
  },
  {
    title: "Collaborative Pedagogy at Minority-Serving Institutions",
    coauthors:
      "with Karina Alpayeva, Emmanoel Ferreira, Sarah Siddique, and Kim Yi Dionne",
    status: "Work in progress",
    description:
      "Active learning strategies in large enrollment courses. Examines collaborative teaching approaches that improve student outcomes at minority-serving institutions.",
    tags: ["Pedagogy", "Higher Education", "Active Learning"],
  },
];

const WORKS_IN_PROGRESS: WorkInProgress[] = [
  {
    title: "Public Interest Representation in Unilateral Actions",
    status: "Early stage.",
  },
  {
    title: "Domain-Specific Language Models for Legislative Texts",
    coauthors: "with Eunseong Oh",
    status: "Presented at PolMeth 2025.",
  },
  {
    title: "Economic Conditions and Presidential Agenda-Setting",
    coauthors: "with Jon Rogowski and Alex Evert",
  },
  {
    title: "Korean National Assembly YouTube Communication",
    coauthors: "with Kyusik Yang",
    status: "Multimodal analysis.",
  },
];

const PUBLICATIONS: Publication[] = [
  {
    authors:
      "Cho, Eunmi, Sinjae Kang, Kyusik Yang, Yongjai Yu, and Yoonseok Lee",
    year: 2024,
    title:
      "Measuring Legislators' Ideology and Analyzing Ideological Differences Across Standing Committees Using Wordfish",
    journal: "Journal of Research Methodology",
    highlighted: "Yongjai Yu",
  },
];

function HighlightedAuthors({
  authors,
  highlighted,
}: {
  authors: string;
  highlighted: string;
}) {
  const parts = authors.split(highlighted);

  return (
    <span className="text-sm text-slate-500">
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="font-semibold text-slate-200">{highlighted}</span>
          )}
        </span>
      ))}
    </span>
  );
}

export default function Research() {
  return (
    <section id="research" className="py-20">
      <p className="text-sm">
        <span className="text-slate-500">$</span>{" "}
        <span className="text-cyan-400">ls</span>{" "}
        <span className="text-blue-400">~/research/</span>
      </p>

      {/* Publications */}
      <h3 className="mt-8 mb-6 text-lg font-semibold text-slate-200">
        Publications
      </h3>

      <div className="space-y-4">
        {PUBLICATIONS.map((pub) => (
          <div key={pub.title}>
            <HighlightedAuthors
              authors={pub.authors}
              highlighted={pub.highlighted}
            />
            <span className="text-sm text-slate-500"> ({pub.year}). </span>
            <span className="text-sm text-slate-300">
              &ldquo;{pub.title}.&rdquo;
            </span>{" "}
            <span className="text-sm italic text-slate-500">
              {pub.journal}.
            </span>
            <span className="text-sm text-slate-500"> (KCI)</span>
          </div>
        ))}
      </div>

      {/* Working Papers */}
      <h3 className="mt-12 mb-6 text-lg font-semibold text-slate-200">
        Working Papers
      </h3>

      <div className="space-y-0">
        {WORKING_PAPERS.map((paper) => (
          <article
            key={paper.title}
            className="border-b border-slate-800 py-6 first:pt-0 last:border-b-0"
          >
            <h4 className="font-semibold text-slate-200">{paper.title}</h4>
            {paper.coauthors && (
              <p className="mt-1 text-sm italic text-slate-500">
                {paper.coauthors}
              </p>
            )}
            <p className="mt-1 text-sm text-slate-500">{paper.status}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-200">
              {paper.description}
            </p>
            <p className="mt-2 text-xs text-slate-600">
              {paper.tags.join(" \u00B7 ")}
            </p>
          </article>
        ))}
      </div>

      {/* Works in Progress */}
      <h3 className="mt-12 mb-6 text-lg font-semibold text-slate-200">
        Works in Progress
      </h3>

      <ul className="space-y-3">
        {WORKS_IN_PROGRESS.map((item) => (
          <li key={item.title} className="text-sm">
            <span className="text-slate-200">{item.title}</span>
            {item.coauthors && (
              <span className="italic text-slate-500">
                {" "}
                ({item.coauthors})
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
