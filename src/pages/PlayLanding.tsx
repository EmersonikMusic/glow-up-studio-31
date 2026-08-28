import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import TriviaGame from "@/components/TriviaGame";
import NotFound from "./NotFound";
import { getPlayPreset } from "@/data/playSlugs";

const SITE = "https://triviolivia.com";

export default function PlayLanding() {
  const { slug } = useParams<{ slug: string }>();
  const preset = getPlayPreset(slug);

  if (!preset) return <NotFound />;

  const url = `${SITE}/play/${preset.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Game",
    name: preset.headline,
    url,
    description: preset.metaDescription,
    genre: ["Trivia", "Quiz"],
    applicationCategory: "Game",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Triviolivia", url: `${SITE}/` },
  };

  return (
    <>
      <Helmet>
        <title>{preset.metaTitle}</title>
        <meta name="description" content={preset.metaDescription} />
        <link rel="canonical" href={url} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:title" content={preset.metaTitle} />
        <meta property="og:description" content={preset.metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content="Triviolivia" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={preset.metaTitle} />
        <meta name="twitter:description" content={preset.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <TriviaGame preset={preset} />
    </>
  );
}
