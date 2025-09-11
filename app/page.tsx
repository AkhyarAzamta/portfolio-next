import Blogs from "@/components/Blogs";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import Projects from "@/components/Projects";


export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Blogs />
      <Newsletter />
    </main>
  );
} 