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
        "name": "TRIVIOLIVIA.com",
        "description": "Earth's deepest trivia source — free trivia game with 25 categories, 5 difficulties, and 12 eras.",
        "publisher": { "@id": "https://triviolivia.com/#org" },
      },
      {
        "@type": "Organization",
        "@id": "https://triviolivia.com/#org",
        "name": "TRIVIOLIVIA.com",
        "url": "https://triviolivia.com/",
        "logo": "https://triviolivia.com/favicon.png",
      },
      {
        "@type": "Game",
        "name": "TRIVIOLIVIA.com",
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
        <title>TRIVIOLIVIA.com - Earth's Deepest Trivia Source</title>
        <meta
          name="description"
          content="Triviolivia is a free trivia game with thousands of say-aloud questions across 25 categories, 5 difficulties, and 12 eras. No signup — play instantly in your browser."
        />
        <link rel="canonical" href="https://triviolivia.com/" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:url" content="https://triviolivia.com/" />
        <meta property="og:site_name" content="TRIVIOLIVIA.com" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <TriviaGame />
    </>
  );
}
