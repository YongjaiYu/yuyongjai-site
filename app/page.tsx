import GridGlow from "@/components/GridGlow";
import Sidebar from "@/components/Sidebar";
import About from "@/components/About";
import Dissertation from "@/components/Dissertation";
import Research from "@/components/Research";
import Teaching from "@/components/Teaching";
import Software from "@/components/Software";
import CV from "@/components/CV";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="lg:flex">
      <GridGlow />
      <Sidebar />
      <main className="min-h-screen px-6 py-24 lg:ml-[38%] lg:w-[62%] lg:px-12 lg:py-24">
        <About />
        <Dissertation />
        <Research />
        <Teaching />
        <Software />
        <CV />
        <Footer />
      </main>
    </div>
  );
}
