import GridGlow from "@/components/GridGlow";
import Sidebar from "@/components/Sidebar";
import About from "@/components/About";
import Dissertation from "@/components/Dissertation";
import Research from "@/components/Research";
import Teaching from "@/components/Teaching";
import CV from "@/components/CV";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="lg:flex">
      <GridGlow />
      <Sidebar />
      <main className="min-h-screen px-6 py-24 lg:ml-[45%] lg:w-[55%] lg:px-16 lg:py-24">
        {/* Tree */}
        <div className="mb-8 font-mono text-sm">
          <p>
            <span className="text-slate-500">$</span>{" "}
            <span className="text-cyan-400">tree</span>{" "}
            <span className="text-slate-300">~/research</span>
          </p>
          <div className="mt-3 leading-relaxed text-slate-500">
            <p>├── <span className="text-blue-400">presidential-power/</span></p>
            <p>│   ├── <span className="text-green-400">unilateral-actions/</span></p>
            <p>│   └── <span className="text-green-400">continuous-cost-constraint-theory/</span></p>
            <p>├── <span className="text-blue-400">computational-methods/</span></p>
            <p>│   ├── <span className="text-green-400">llm-classification/</span></p>
            <p>│   ├── <span className="text-green-400">aes/</span></p>
            <p>│   └── <span className="text-green-400">multimodal-analysis/</span></p>
            <p>└── <span className="text-blue-400">political-communication/</span></p>
            <p>{'\u00A0\u00A0\u00A0\u00A0'}└── <span className="text-slate-600 italic">coming soon</span></p>
          </div>
        </div>
        <About />
        <Dissertation />
        <Research />
        <Teaching />
        <CV />
        <Footer />
      </main>
    </div>
  );
}
