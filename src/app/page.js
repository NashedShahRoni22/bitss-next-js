import Container from "@/components/shared/Container";
import Hero from "@/components/Home/Hero";
import Featured from "@/components/Home/Featured";
import Solutions from "@/components/Home/Solutions";
import SolutionHighlights from "@/components/Home/SolutionHighlights";
import Contact from "@/components/Home/Contact";
import Faq from "@/components/Home/Faq";
import { homeFaq } from "@/data/homeFaq";

export default function Home() {
  return (
    <Container>
      <Hero />
      <Featured />
      <Solutions />
      <SolutionHighlights />
      <Contact />
      <Faq faqData={homeFaq} />
    </Container>
  );
}
