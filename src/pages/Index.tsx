import { Helmet } from "react-helmet-async";
import TriviaGame from "@/components/TriviaGame";

export default function Index() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://triviolivia.com/#website",
        "url": "https://triviolivia.com/",
        "name": "Triviolivia",
        "description": "Play Triviolivia free in your browser — thousands of say-aloud trivia questions across 25 categories, 5 difficulties, and 12 eras.",
        "publisher": { "@id": "https://triviolivia.com/#org" },
      },
      {
        "@type": "Organization",
        "@id": "https://triviolivia.com/#org",
        "name": "Triviolivia",
        "url": "https://triviolivia.com/",
        "logo": "https://triviolivia.com/favicon.png",
      },
      {
        "@type": "Game",
        "name": "Triviolivia",
        "url": "https://triviolivia.com/",
        "description": "Free online trivia game with thousands of questions across 25 categories, 5 difficulty levels, and 12 historical eras. Play solo or with friends — say your answer aloud and reveal!",
        "genre": ["Trivia", "Quiz", "Educational"],
        "applicationCategory": "Game",
        "operatingSystem": "Web",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Triviolivia — Free Trivia Game | 25 Categories, 12 Eras</title>
        <meta
          name="description"
          content="Play Triviolivia free in your browser — thousands of say-aloud trivia questions across 25 categories, 5 difficulties, and 12 eras. No signup."
        />
        <link rel="canonical" href="https://triviolivia.com/" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:url" content="https://triviolivia.com/" />
        <meta property="og:site_name" content="Triviolivia" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <TriviaGame />
    </>
  );
}
