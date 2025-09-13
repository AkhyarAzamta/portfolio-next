import Blogs from "@/components/Blogs";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import Projects from "@/components/Projects";
import About from "./about/page";


export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects 
        limit={3} 
        title="Featured Projects" 
        description="Here are some of my recent projects. Click on the links to view the code or live demo."
        showViewAll={true}
      />
      <Blogs limit={3} title="Latest Blog Posts" showViewAll={true} />
      <Newsletter />
    </main>
  );
} 