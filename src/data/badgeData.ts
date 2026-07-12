// Badge catalog. Data-only — no unlock logic here.

export type Badge = {
  id: string;
  badgeType: string;
  setting: string;
  tier: number;
  badgeName: string;
  requirement: string;
  visualDesign: string;
};

export const BADGE_CATEGORIES = [
  "Progression & Consistency",
  "Mode & Difficulty Mastery",
  "Time Travelers (Eras)",
  "Category Specialists",
  "Custom Combo Games",
] as const;

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeId(b: Omit<Badge, "id">) {
  return [b.badgeType, b.setting, b.badgeName].map(slug).filter(Boolean).join("-");
}

const RAW: Omit<Badge, "id">[] = [
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 1, badgeName: "The Icebreaker", requirement: "Complete 1st Game", visualDesign: "A single, bright spark on a navy blue circle." },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 2, badgeName: "Decathlon", requirement: "Complete 10 Games", visualDesign: "A clean Roman numeral 'X' rendered in polished bronze." },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 3, badgeName: "The Regular", requirement: "Complete 25 Games", visualDesign: "A crisp Roman numeral 'XXV' rendered in metallic silver." },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 4, badgeName: "Half-Century", requirement: "Complete 50 Games", visualDesign: "A bold, glowing Roman numeral 'L' in bright gold." },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 5, badgeName: "Centurion", requirement: "Complete 100 Games", visualDesign: "A radiant gold '100' (or a Roman 'C') with a small crown sitting atop the numbers." },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "Spontaneous", requirement: "Complete 10 Quickplay games", visualDesign: "A neon yellow lightning bolt cutting diagonally across a dark purple circle." },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "The Architect", requirement: "Complete a Custom game", visualDesign: "A minimalist white blueprint compass" },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "The Spectrum", requirement: "Complete a game on all 5 difficulties", visualDesign: "A circular gradient rainbow ring" },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "Century Hopper", requirement: "Play games spanning 5 different eras", visualDesign: "A minimalist hourglass with glowing neon sand" },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "The Polymath", requirement: "Play at least one game in all 25 categories", visualDesign: "A Da Vinci-style Vitruvian Man in simple white lines" },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "Weekender", requirement: "Play a game on a Saturday or Sunday", visualDesign: "A minimalist sun rising behind sunglasses" },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "Night Owl", requirement: "Play any game between midnight and 4:00 AM", visualDesign: "A glowing yellow crescent moon and stars on a midnight blue background" },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "Early Riser", requirement: "Play any game between 4:00 AM and 8:00 AM", visualDesign: "A bright, minimalist sunrise rising out of a coffee cup" },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "Speed Demon", requirement: "Play a game with the question/answer timers manually adjusted to their minimum settings", visualDesign: "A digital stopwatch with glowing neon motion blur lines" },
  { badgeType: "Progression & Consistency", setting: "N/A", tier: 0, badgeName: "Marathoner", requirement: "Play 10 games within a single 24-hour period", visualDesign: "A glowing water bottle or a winged track shoe" },

  { badgeType: "Mode & Difficulty Mastery", setting: "Casual", tier: 1, badgeName: "Casual Cruiser", requirement: "Play 10 games including Casual", visualDesign: "A stylized paper boat on calm turquoise waves" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Casual", tier: 2, badgeName: "Smooth Operator", requirement: "Play 50 games including Casual", visualDesign: "A sleek, retro sailboat gliding over the water" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Casual", tier: 3, badgeName: "Zen Master", requirement: "Play 100 games including Casual", visualDesign: "A glowing pink lotus flower resting on a still pond" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Easy", tier: 1, badgeName: "The Warm-Up", requirement: "Play 10 games including Easy", visualDesign: "A simple, classic canvas sneaker" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Easy", tier: 2, badgeName: "Walk in the Park", requirement: "Play 50 games including Easy", visualDesign: "A minimalist, leafy green park tree" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Easy", tier: 3, badgeName: "Easy Rider", requirement: "Play 100 games including Easy", visualDesign: "A stylized, vintage cruiser bicycle" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Medium", tier: 1, badgeName: "Middle Ground", requirement: "Play 10 games including Medium", visualDesign: "A simple, perfectly balanced silver scale" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Medium", tier: 2, badgeName: "Equilibrium", requirement: "Play 50 games including Medium", visualDesign: "A stack of three smooth, balanced zen stones" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Medium", tier: 3, badgeName: "Perfectly Balanced", requirement: "Play 100 games including Medium", visualDesign: "A polished, geometric gyroscope spinning perfectly" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Hard", tier: 1, badgeName: "Tough Cookie", requirement: "Play 10 games including Hard", visualDesign: "A cracked, hardened stone shield" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Hard", tier: 2, badgeName: "Iron Will", requirement: "Play 50 games including Hard", visualDesign: "A heavy, solid cast-iron anvil" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Hard", tier: 3, badgeName: "Unbreakable", requirement: "Play 100 games including Hard", visualDesign: "A brilliant, indestructible diamond shield" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Genius", tier: 1, badgeName: "The Spark", requirement: "Play 10 games including Genius", visualDesign: "A glowing, bronze-filament lightbulb" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Genius", tier: 2, badgeName: "The Mastermind", requirement: "Play 50 games including Genius", visualDesign: "A glowing, geometric brain made of connected nodes" },
  { badgeType: "Mode & Difficulty Mastery", setting: "Genius", tier: 3, badgeName: "The Oracle", requirement: "Play 100 games including Genius", visualDesign: "A cosmic, glowing eye surrounded by orbital rings" },

  { badgeType: "Time Travelers (Eras)", setting: "Pre-1500", tier: 1, badgeName: "Ancient Historian", requirement: "Play 10 games including the Pre-1500 era", visualDesign: "A bronze Roman coin silhouette" },
  { badgeType: "Time Travelers (Eras)", setting: "Pre-1500", tier: 2, badgeName: "Antiquity Scholar", requirement: "Play 50 games including the Pre-1500 era", visualDesign: "A silver rolled parchment scroll" },
  { badgeType: "Time Travelers (Eras)", setting: "Pre-1500", tier: 3, badgeName: "Mythic Master", requirement: "Play 100 games including the Pre-1500 era", visualDesign: "A glowing golden Greek column" },
  { badgeType: "Time Travelers (Eras)", setting: "1900-1950", tier: 1, badgeName: "Roaring Twenties", requirement: "Play 10 games including the 1900-1950 era", visualDesign: "A bronze Art Deco geometric pattern" },
  { badgeType: "Time Travelers (Eras)", setting: "1900-1950", tier: 2, badgeName: "Mid-Century Maven", requirement: "Play 50 games including the 1900-1950 era", visualDesign: "A silver vintage gramophone" },
  { badgeType: "Time Travelers (Eras)", setting: "1900-1950", tier: 3, badgeName: "Golden Age", requirement: "Play 100 games including the 1900-1950 era", visualDesign: "A golden classic broadcast microphone" },
  { badgeType: "Time Travelers (Eras)", setting: "1960s/1970s", tier: 1, badgeName: "Flower Child", requirement: "Play 10 games including the 1960s or 1970s", visualDesign: "A vibrant, psychedelic daffodil with swirling tie-dye petals on a bright sunny yellow background." },
  { badgeType: "Time Travelers (Eras)", setting: "1960s/1970s", tier: 2, badgeName: "Disco Dynamo", requirement: "Play 50 games including the 1960s or 1970s", visualDesign: "A glittering silver disco ball casting colorful, geometric light rays across a dark dancefloor." },
  { badgeType: "Time Travelers (Eras)", setting: "1960s/1970s", tier: 3, badgeName: "Boogie Boss", requirement: "Play 100 games including the 1960s or 1970s", visualDesign: "A classic, smooth-flowing lava lamp with neon orange and green wax bubbling upward." },
  { badgeType: "Time Travelers (Eras)", setting: "1980s", tier: 1, badgeName: "Insert Coin", requirement: "Play 10 games including the 1980s era", visualDesign: "A glowing neon pink and cyan arcade coin slot resting on a dark retro wireframe grid." },
  { badgeType: "Time Travelers (Eras)", setting: "1980s", tier: 2, badgeName: "Neon Glider", requirement: "Play 50 games including the 1980s era", visualDesign: "A neon-outlined roller skate leaving a glowing magenta light trail against a classic synthwave sunset." },
  { badgeType: "Time Travelers (Eras)", setting: "1980s", tier: 3, badgeName: "Synth Lord", requirement: "Play 100 games including the 1980s era", visualDesign: "A chrome-reflective keytar with glowing cyan keys set against a dark, starry purple background." },
  { badgeType: "Time Travelers (Eras)", setting: "1990s/2000s", tier: 1, badgeName: "Y2K Survivor", requirement: "Play 10 games including the 1990s/2000s eras", visualDesign: "A bronze pixelated desktop mouse" },
  { badgeType: "Time Travelers (Eras)", setting: "1990s/2000s", tier: 2, badgeName: "Millennium Bug", requirement: "Play 50 games including the 1990s/2000s eras", visualDesign: "A silver neon floppy disk" },
  { badgeType: "Time Travelers (Eras)", setting: "1990s/2000s", tier: 3, badgeName: "Dot Com Mogul", requirement: "Play 100 games including the 1990s/2000s eras", visualDesign: "A glowing gold early-internet globe icon" },
  { badgeType: "Time Travelers (Eras)", setting: "2020s", tier: 1, badgeName: "Trendsetter", requirement: "Play 10 games including the 2020s era", visualDesign: "A bronze sleek smartphone silhouette" },
  { badgeType: "Time Travelers (Eras)", setting: "2020s", tier: 2, badgeName: "The Modernist", requirement: "Play 50 games including the 2020s era", visualDesign: "A silver stylized wifi or cloud symbol" },
  { badgeType: "Time Travelers (Eras)", setting: "2020s", tier: 3, badgeName: "The Zeitgeist", requirement: "Play 100 games including the 2020s era", visualDesign: "A gold glowing smart-watch interface" },

  { badgeType: "Category Specialists", setting: "STEM", tier: 1, badgeName: "Tech Apprentice", requirement: "Play 10 games including Math, Science, or Technology", visualDesign: "A bronze atom symbol with intersecting orbital rings" },
  { badgeType: "Category Specialists", setting: "STEM", tier: 2, badgeName: "Tech Innovator", requirement: "Play 50 games including Math, Science, or Technology", visualDesign: "A silver atom symbol glowing softly" },
  { badgeType: "Category Specialists", setting: "STEM", tier: 3, badgeName: "Tech Visionary", requirement: "Play 100 games including Math, Science, or Technology", visualDesign: "A radiant gold atom symbol with a diamond core" },
  { badgeType: "Category Specialists", setting: "Culture", tier: 1, badgeName: "Culture Vulture", requirement: "Play 10 games including Art, Literature, or Performing Arts", visualDesign: "A bronze comedy/tragedy theater mask duo" },
  { badgeType: "Category Specialists", setting: "Culture", tier: 2, badgeName: "Culture Critic", requirement: "Play 50 games including Art, Literature, or Performing Arts", visualDesign: "A polished silver mask duo" },
  { badgeType: "Category Specialists", setting: "Culture", tier: 3, badgeName: "Culture Maestro", requirement: "Play 100 games including Art, Literature, or Performing Arts", visualDesign: "A glittering gold mask duo on a deep velvet red background" },
  { badgeType: "Category Specialists", setting: "Globe", tier: 1, badgeName: "Globe Trotter", requirement: "Play 10 games including Geography, History, or Politics", visualDesign: "A minimalist bronze wireframe globe" },
  { badgeType: "Category Specialists", setting: "Globe", tier: 2, badgeName: "World Explorer", requirement: "Play 50 games including Geography, History, or Politics", visualDesign: "A silver globe with embossed continents" },
  { badgeType: "Category Specialists", setting: "Globe", tier: 3, badgeName: "Global Citizen", requirement: "Play 100 games including Geography, History, or Politics", visualDesign: "A spinning gold globe on a cobalt blue background" },
  { badgeType: "Category Specialists", setting: "Gourmet", tier: 1, badgeName: "The Foodie", requirement: "Play 10 games including Food", visualDesign: "A bronze crossed chef's knife and fork beneath a classic cloche on a forest green circle." },
  { badgeType: "Category Specialists", setting: "Gourmet", tier: 2, badgeName: "The Gourmet", requirement: "Play 50 games including Food", visualDesign: "A polished silver cloche with a subtle, stylized steam swirl rising from the top." },
  { badgeType: "Category Specialists", setting: "Gourmet", tier: 3, badgeName: "Master Chef", requirement: "Play 100 games including Food", visualDesign: "A gleaming gold cloche resting on a pristine white ceramic plate with a golden laurel wreath border." },
  { badgeType: "Category Specialists", setting: "Pop Culture", tier: 1, badgeName: "Pop Icon", requirement: "Play 10 games including Pop Culture categories", visualDesign: "A bronze retro broadcast microphone with neon pink accents." },
  { badgeType: "Category Specialists", setting: "Pop Culture", tier: 2, badgeName: "Silver Screen", requirement: "Play 50 games including Pop Culture categories", visualDesign: "A classic Hollywood clapperboard rendered in polished silver." },
  { badgeType: "Category Specialists", setting: "Pop Culture", tier: 3, badgeName: "Hall of Famer", requirement: "Play 100 games including Pop Culture categories", visualDesign: "A radiant, neon-lined gold star on a dark terrazzo-style background." },
  { badgeType: "Category Specialists", setting: "Sports", tier: 1, badgeName: "The Warm-Up", requirement: "Play 10 games including Sports", visualDesign: "A simple bronze referee whistle" },
  { badgeType: "Category Specialists", setting: "Sports", tier: 2, badgeName: "The Striker", requirement: "Play 50 games including Sports", visualDesign: "A sleek silver soccer ball" },
  { badgeType: "Category Specialists", setting: "Sports", tier: 3, badgeName: "The Champion", requirement: "Play 100 games including Sports", visualDesign: "A large, shining gold trophy cup" },

  { badgeType: "Custom Combo Games", setting: "N/A", tier: 0, badgeName: "Couch Potato", requirement: "Play a Custom game including Movies, Television, and Video Games", visualDesign: "A retro tube TV set resting next to a striped popcorn bucket" },
  { badgeType: "Custom Combo Games", setting: "N/A", tier: 0, badgeName: "Renaissance Soul", requirement: "Play a Custom game including Art, Science, and History", visualDesign: "A classic wooden artist's palette crossed with a brass telescope" },
  { badgeType: "Custom Combo Games", setting: "N/A", tier: 0, badgeName: "The World Stage", requirement: "Play a Custom game including Sports and Geography", visualDesign: "A classic black-and-white soccer ball hovering over a minimalist world map" },
  { badgeType: "Custom Combo Games", setting: "N/A", tier: 0, badgeName: "Culinary Tour", requirement: "Play a Custom game including Food and Geography", visualDesign: "A travel passport stamped with a crossed fork and chef's knife" },
  { badgeType: "Custom Combo Games", setting: "N/A", tier: 0, badgeName: "Existential Crisis", requirement: "Play a Custom game including Philosophy, Theology, and Human Body", visualDesign: "A Rodin 'The Thinker' silhouette inside a glowing cosmic nebula" },
  { badgeType: "Custom Combo Games", setting: "N/A", tier: 0, badgeName: "The Hustle", requirement: "Play a Custom game including Economics, Law, and Politics", visualDesign: "A gleaming silver briefcase overflowing with gold coins" },
];

export const BADGES: readonly Badge[] = Object.freeze(
  RAW.map((b) => ({ ...b, id: makeId(b) })),
);

export function findBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}
