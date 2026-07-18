// Sub-topic descriptions surfaced as tooltips on Settings rows.
// Keep values as plain comma-separated strings — the tooltip renders them as-is.

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Art: "Artists, Architecture, Sculpture, Photography, Painting, Museums, Styles, Terms, Typography, Theory, Techniques, Statues, Festivals, Digital Art, Awards, Colors, Design, Fashion, Heraldry, Logos",
  Economy: "Business, Currency, Stocks, Terms, Trade, Businesspeople, Cryptocurrency, Institutions, Finance, Microeconomics, Economists, Marketing, Policies, Accounting, Events, Banking, Ecommerce, Brands, Investing, Macroeconomics, Unions",
  "Food & Drink": "Origins, Foodstuffs, Brands, Ingredients, Restaurants, Alcohol, Cooking, National Dishes, Drinks, Terms, Diets, Agriculture, Cuisines, Producers, Nutrition, Processing, Restrictions, Spices",
  Games: "Board Games, Card Games, Tabletop Games, Puzzles, Games of Chance, Party Games, Schoolyard Games, Dexterity Games, Bar Games, Skill Toys, Genres",
  Geography: "Capitals, Regions, Territories, Countries, Bodies of Water, Cities, Landmarks, Cartography, Terms, Islands",
  History: "War, Events, Figures, Civilizations, Deaths, Royalty, Empires, Firsts, Periods, Quotes, Archaeology, Prehistory, Rulers, Terms, Artifacts, Explorers, Kingdoms, Names, Organizations, Places, Historians, Museums, Societies",
  "Human Body": "Anatomy, Disease, Physiology, Systems, Organs, Terms, Pregnancy, Disorders, Tests, Conditions",
  Language: "Definitions, Terms, Languages, Translation, Codes, Shorthands, Slang, Words, Alphabets, Linguistics, Parts of Speech, Punctuation, Anagrams, Idioms, Sayings, Dialects, Sign Language",
  Law: "Terms, Cases, Laws, Enforcement, Courts, Prisons, Concepts, Codes, Institutions, Principles, Doctrines, Events, Firms, Branches, Figures",
  Literature: "Authors, Characters, Books, Details, Poetry, Lines, Awards, Stories, Literary Devices, Novellas, Terms, Fanbases, Genres, Publications, Publishers, Fables, Graphic Novels, Journalism, Magazines, Quotes, Writing",
  Math: "Numbers, Problems, Mathematicians, Geometry, Terms, Units, Statistics, Concepts, Branches, Notation, Calculus, Instruments, Probability, Symbols",
  Miscellaneous: "Flags, Terms, Education, Buildings, Calendar, Journalism, Culture, Slogans, Organizations, Awards, Names, Products, Amusement Parks, Logos, Events, Symbols, Clothing, Fashion, Martial Arts, Quotes, Standards",
  Movies: "Characters, Actors, Awards, Films, Details, Directors, Box Office, Lines, Taglines, Cinematography, Studios, Festivals, Filmmaking, Franchises, Industry, Musicals, Screenwriters",
  Music: "Artists, Lyrics, Songs, Instruments, Composers, Albums, Concerts, Theory, Genres, Labels, Festivals, Aliases, Awards, Streaming, Anthems, Fanbases, Terms, Notation, Hardware, Producers, Music Videos, Production, Clubs, Contests, DJs, Industry, Publications",
  Nature: "Animals, Environment, Space, Plants, National Parks, Natural Processes, Terms, Natural Disasters, Geology, Weather, Life, Parks",
  "Performing Arts": "Plays, Characters, Theaters, Playwrights, Opera, Musicals, Terms, Awards, Dance, Schools, Actors, Lines, Acting, Genres, Comedy, Performers, Podcasting, Circus, Magicians",
  Philosophy: "Philosophers, Texts, Branches, Terms, Principles, Concepts, Journals, Schools, Ideologies, Logic, Movements, Argumentation, Activism, Metaphysics",
  Politics: "Politicians, Government, Geopolitics, Unions, Terms, Events, Movements, Parties, Elections, Treaties, Political Buildings, Revolutions, Activism, Institutions, International Politics, Alliances, Documents, Political Science",
  "Pop Culture": "Celebrities, Aliases, Comics, Scandals, Criminals, Deaths, Fashion, Magazines, Products, Traditions, Trends, Pseudoscience, Memes, Entertainment, Generations, Societies, Events, Websites, Lifestyle, Social Media, Superstition, Applications, Legends, Podcasts, Publications, Terms, Viral Videos",
  Science: "Chemistry, Physics, Psychology, Biology, Scientists, Medicine, Biochemistry, Fields, Units, Astronomy, Geology, Sociology, Terms, Materials Science, Journals, Pathology, Research Centers, Techniques, Anthropology, Scientific Method, Meteorology",
  Sports: "Teams, Olympics, Athletes, Leagues, Terms, Rules, Awards, Motorsports, World Cups, Events, Mascots, Records, Games, Equipment, Sports Entertainment, Ranks, Stadiums, Fanbases, Positions, Governing Bodies, Martial Arts, Penalties, Coaches, Competitions, Fitness, Names, Recreation, Statistics",
  Technology: "Internet, Software, Machines, Hardware, Vehicles, Companies, Programming, Terms, Inventors, Websites, Computers, Engineering, Weapons, Infrastructure, Advances, Names, Applications, Founders, AI, Materials, Tools, Events, Cyberattacks, Inventions, Standards",
  Television: "Characters, Details, Actors, Shows, Game Shows, Streaming, Reality TV, Producers, Theme Songs, News, Fanbases, Lines, Commercials, Terms, Animation, Broadcasting, Episodes, Events, Networks, Awards, Specials, Talk Shows, YouTube",
  Theology: "Mythology, World Religions, Holy Books, Places of Worship, Traditions, Holy Days, Astrology, Popes, Saints, Terms, Folklore, Leaders, Symbols, Apparel, Clergy, Events, Institutions, Irreligion, Titles",
  "Video Games": "Games, Characters, Details, Consoles, Developers, Awards, Items, Genres, Publications, Hardware, Esports, Levels, Terms, Accessories, Conventions",
};

export const DIFFICULTY_DESCRIPTIONS: Record<string, string> = {
  Casual: "General Knowledge, Universal Concepts, Everyday Facts, Pop Culture Basics, Broadly Accessible, Beginner, Relaxed, Low Barrier to Entry",
  Easy: "Common Knowledge, Basic History, Straightforward Questions, Popular Media, Highly Recognizable, Minimal Trickery, Standard Education",
  Average: "Standard Trivia, Moderate Depth, Specific Details, Balanced Challenge, Active Recall, Intermediate Complexity, Pub Trivia Level",
  Hard: "Niche Topics, Deep Cuts, Specific Dates, Subtle Nuances, Specialized Fields, Rigorous Challenge, Trivia Enthusiast",
  Genius: "Obscure Facts, Expert Level, Highly Esoteric, Extreme Detail, Academic Rigor, Rarely Known, Trivia Master",
};

export const ERA_DESCRIPTIONS: Record<string, string> = {
  "Pre-1500": "Ancient Civilizations, Classical Antiquity, Middle Ages, Feudalism, The Crusades, Silk Road, Pre-Columbian Americas, Bronze Age, Iron Age, Dawn of Agriculture, Renaissance, The Black Death, Gutenberg Press, Homer's Odyssey, Dante's Inferno, Canterbury Tales, Beowulf, King Arthur Legends",
  "1500-1800": "Age of Discovery, Protestant Reformation, Scientific Revolution, The Enlightenment, Colonialism, American Revolution, French Revolution, Transatlantic Slave Trade, High Renaissance, Baroque Period, Shakespeare's Plays, Don Quixote, Paradise Lost, Robinson Crusoe, Gulliver's Travels",
  "1800-1900": "Industrial Revolution, Victorian Era, American Civil War, Age of Imperialism, Romanticism, Gilded Age, Meiji Restoration, Wild West, Abolitionism, Theory of Evolution, Transcontinental Railroads, Sherlock Holmes, Dracula, Pride and Prejudice, Moby-Dick, Alice in Wonderland, A Christmas Carol, Frankenstein, Les Misérables",
  "1900-1950": "World War I, Roaring Twenties, Great Depression, World War II, Russian Revolution, Atomic Age, League of Nations, Early Aviation, Jazz Age, The Holocaust, Discovery of Penicillin, The Wizard of Oz, Citizen Kane, Casablanca, Gone with the Wind, The Great Gatsby, 1984, The Hobbit",
  "1950s": "Cold War, Rock and Roll, Space Race, Suburbia, Civil Rights Movement, Television Golden Age, Korean War, Decolonization, Discovery of DNA Structure, I Love Lucy, The Twilight Zone, Rebel Without a Cause, The Lord of the Rings Books, Cat on a Hot Tin Roof",
  "1960s": "Counterculture, Moon Landing, Vietnam War, Beatlemania, Civil Rights Act, Cuban Missile Crisis, Pop Art, Second-Wave Feminism, Stonewall Riots, Woodstock, Star Trek, Doctor Who, Psycho, James Bond, To Kill a Mockingbird",
  "1970s": "Disco, Watergate, Energy Crisis, Punk Rock, Post-Vietnam Era, Early Video Games, Personal Computers, Environmentalism, Birth of Hip Hop, Stagflation, Star Wars, Jaws, The Godfather, Saturday Night Live, M*A*S*H, Stephen King's Carrie, The Hitchhiker's Guide to the Galaxy",
  "1980s": "Fall of the Berlin Wall, MTV Generation, Arcade Games, Reagan Era, Synthesizer Pop, End of the Cold War, Yuppie Culture, Early Home Consoles, The AIDS Epidemic, Chernobyl, Back to the Future, Indiana Jones, The Simpsons, Seinfeld, Cheers, The Shining, Neuromancer",
  "1990s": "World Wide Web, Dot-Com Boom, Grunge Era, Post-Cold War, Britpop, End of Apartheid, Rise of Cell Phones, Console Wars, The Human Genome Project, Cloning, Friends, Titanic, Jurassic Park, Harry Potter, The Matrix, Pulp Fiction, The Lion King",
  "2000s": "9/11 Attacks, War on Terror, Early Social Media, The Great Recession, Rise of Broadband, Reality TV Boom, MP3 Players, Y2K, Globalization, Emergence of Smartphones, The Lord of the Rings Trilogy, The Office, Lost, The Dark Knight, Avatar, Twilight, The Da Vinci Code",
  "2010s": "Streaming Services, Smartphone Ubiquity, Arab Spring, Gig Economy, Influencer Culture, Climate Activism, Meme Culture, Populism, CRISPR, Crypto Boom, Game of Thrones, Marvel Cinematic Universe, Breaking Bad, Stranger Things, The Hunger Games",
  "2020s": "COVID-19 Pandemic, Artificial Intelligence Boom, Remote Work, Commercial Spaceflight, Electric Vehicles, TikTok Culture, Inflation, Web3, mRNA Vaccines, Succession, Dune, Squid Game, Barbie, Oppenheimer, The Last of Us",
};
