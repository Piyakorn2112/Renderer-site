import { HeroSection } from "./components/HeroSection";
import { ArgumentSection } from "./components/ArgumentSection";
import { DistanceSection } from "./components/DistanceSection";
import { ArchitectureDiagram } from "./components/ArchitectureDiagram";
import { CoherenceChart } from "./components/CoherenceChart";
import { ModelRecommendation } from "./components/ModelRecommendation";
import { QualitySection } from "./components/QualitySection";
import { ReviewSample } from "./components/ReviewSample";
import { FullReviewReport } from "./components/FullReviewReport";
import { NovelsSection } from "./components/NovelsSection";
import { SetupGuide } from "./components/SetupGuide";
import { CTASection } from "./components/CTASection";
import { Disclaimer } from "./components/Disclaimer";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div id="argument">
          <ArgumentSection />
        </div>
        <DistanceSection />
        <div id="architecture">
          <ArchitectureDiagram />
        </div>
        <CoherenceChart />
        <ModelRecommendation />
        <div id="quality">
          <QualitySection />
        </div>
        <ReviewSample />
        <FullReviewReport />
        <div id="novels">
          <NovelsSection />
        </div>
        <SetupGuide />
        <CTASection />
        <Disclaimer />
      </main>
      <Footer />
    </>
  );
}

export default App;
