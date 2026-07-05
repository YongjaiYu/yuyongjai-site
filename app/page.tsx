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
    <div className="site_shell">
      <GridGlow />
      <Sidebar />
      <main className="site_main">
        <MobileNav />
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
