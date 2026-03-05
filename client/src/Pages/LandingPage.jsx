import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  Security,
  FAQ,
  Footer,
} from "../components/landing";
import { useTheme } from "../Context/ThemeContext";

const LandingPage = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#030712]" : "bg-white"
      }`}
    >
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Security />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
