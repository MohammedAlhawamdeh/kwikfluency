import Benefits from "./components/(homepage)/Beneftis";
import CTA from "./components/(homepage)/CTA";
import Footer from "./components/(homepage)/Footer";
import Hero from "./components/(homepage)/Hero";
import Pricing from "./components/(homepage)/Pricing";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
