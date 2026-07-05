interface WorkingPaper {
  title: string;
  coauthors?: string;
  status?: string;
  journal?: string;
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
    title:
      "When Sparse Beats Dense: Vocabulary Separability and Model Selection in Political Text Analysis",
    coauthors: "with Eunseong Oh",
    description:
      "Develops a diagnostic of vocabulary separability to guide model selection in political text classification, and explains when sparse representations outperform dense alternatives.",
    tags: ["Text Analysis", "NLP", "Model Selection"],
  },
  {
    title:
      "When Conspiracy Belief Mobilizes Donors: Campaign Contributions in American Politics",
    description:
      "Examines whether conspiracy beliefs shape campaign contributions in American politics, using the 2012 and 2016 ANES. The paper links conspiratorial belief to donor behavior across partisan contexts.",
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
];

const WORKS_IN_PROGRESS: WorkInProgress[] = [
  {
    title:
      "Fandom Politics: A Formal Theory of Unconditional Partisan Loyalty and Democratic Backsliding",
  },
  {
    title: "Korean National Assembly YouTube Communication",
    coauthors: "with Kyusik Yang",
    status: "Multimodal analysis.",
  },
  {
    title:
      "Measuring Regulatory Change Through Delegated Legislation: Evidence from Korean Presidential Decrees",
  },
  {
    title: "Collaborative Pedagogy at Minority-Serving Institutions",
    coauthors: "with Karina Alpayeva, Emmanoel Ferreira, Sarah Siddique, and Kim Yi Dionne",
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
    <span className="text-base text-slate-500">
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
    <section id="research" className="site_section">
      <h2 className="section_heading">Research</h2>

      <p className="content_limiter mb-8 text-base font-sans leading-relaxed text-slate-300">
        My research brings together political institutions, political
        communication, and computational methods to study political actors&apos;
        strategy and representation.
      </p>

      {/* Publications */}
      <h3 className="section_kicker mb-4 mt-6">
        Publications
      </h3>

      <div className="feed">
        {PUBLICATIONS.map((pub) => (
          <article key={pub.title} className="surface_card">
            <HighlightedAuthors
              authors={pub.authors}
              highlighted={pub.highlighted}
            />
            <span className="text-base text-slate-500"> ({pub.year}). </span>
            <span className="text-base text-slate-300">
              &ldquo;{pub.title}.&rdquo;
            </span>{" "}
            <span className="text-base italic text-slate-500">
              {pub.journal}.
            </span>
            <span className="text-base text-slate-500"> (KCI)</span>
          </article>
        ))}
      </div>

      {/* Working Papers */}
      <h3 className="section_kicker mb-4 mt-12">
        Working Papers
      </h3>

      <div className="feed">
        {WORKING_PAPERS.map((paper) => (
          <article
            key={paper.title}
            className="surface_card"
          >
            <h4 className="font-semibold leading-snug text-slate-200">
              {paper.title}
            </h4>
            {paper.coauthors && (
              <p className="mt-1 text-base italic text-slate-500">
                {paper.coauthors}
              </p>
            )}
            {paper.status && (
              <p className="mt-1 text-base text-slate-500">
                {paper.status}
                {paper.journal && (
                  <>
                    {" at "}
                    <span className="italic">{paper.journal}</span>
                  </>
                )}
              </p>
            )}
            <p className="mt-2 text-base font-sans leading-relaxed text-slate-300">
              {paper.description}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {paper.tags.join(" \u00B7 ")}
            </p>
          </article>
        ))}
      </div>

      {/* Works in Progress */}
      <h3 className="section_kicker mb-4 mt-12">
        Works in Progress
      </h3>

      <ul className="card_grid">
        {WORKS_IN_PROGRESS.map((item) => (
          <li key={item.title} className="surface_card text-base">
            <span className="block font-medium leading-snug text-slate-200">
              {item.title}
            </span>
            {item.coauthors && (
              <span className="mt-2 block italic text-slate-500">
                {item.coauthors}
              </span>
            )}
            {item.status && (
              <span className="mt-2 block text-sm text-slate-500">
                {item.status}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
