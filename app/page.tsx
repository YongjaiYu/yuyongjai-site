import GridGlow from "@/components/GridGlow";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import About from "@/components/About";
import Dissertation from "@/components/Dissertation";
import Research from "@/components/Research";
import Teaching from "@/components/Teaching";
import Software from "@/components/Software";
import Playground from "@/components/Playground";
import CV from "@/components/CV";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="lg:flex">
      <GridGlow />
      <MobileNav />
      <Sidebar />
      <main className="min-h-screen px-6 pt-14 pb-24 lg:ml-[38%] lg:w-[62%] lg:px-12 lg:pt-24 lg:pb-24">
        <About />
        <Dissertation />
        <Research />
        <Teaching />
        <Software />
        <Playground />
        <CV />
        <Footer />
      </main>
    </div>
  );
}
