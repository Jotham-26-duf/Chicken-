export interface Movie {
  title: string;
  slug: string;
  year: string;
  rating: string;
  genres: string[];
  image: string;
  description: string;
  explainer: string;
  translator: string;
  language: string;
  type: string;
}

export const movies: Movie[] = [
  {
    title: "The Last Kingdom",
    slug: "the-last-kingdom",
    year: "2026",
    rating: "8.7",
    genres: ["Action", "Adventure", "Drama", "War"],
    image:
      "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?auto=format&fit=crop&w=800&q=80",
    description:
      "A powerful warrior fights to protect his kingdom from enemies and betrayal.",
    explainer:
      "Sikov explains the story of a warrior who must fight through battles and political conflicts to protect his people.",
    translator: "Sikov",
    language: "Kinyarwanda",
    type: "Movie",
  },

  {
    title: "Dark Horizon",
    slug: "dark-horizon",
    year: "2026",
    rating: "8.5",
    genres: ["Thriller", "Mystery", "Crime"],
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80",
    description:
      "A detective discovers a mysterious secret connected to a series of dangerous crimes.",
    explainer:
      "Sikov explains how the investigation slowly reveals a hidden conspiracy.",
    translator: "Sikov",
    language: "Kinyarwanda",
    type: "Movie",
  },

  {
    title: "Lost in Space",
    slug: "lost-in-space",
    year: "2025",
    rating: "8.9",
    genres: ["Sci-Fi", "Adventure", "Mystery"],
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
    description:
      "A group of explorers becomes stranded in deep space and searches for a way home.",
    explainer:
      "Sikov explains the challenges the crew faces while trying to survive far away from Earth.",
    translator: "Sikov",
    language: "Kinyarwanda",
    type: "Movie",
  },

  {
    title: "The Warrior",
    slug: "the-warrior",
    year: "2026",
    rating: "8.2",
    genres: ["Action", "War", "Revenge"],
    image:
      "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?auto=format&fit=crop&w=800&q=80",
    description:
      "A skilled warrior returns home seeking justice after losing everything.",
    explainer:
      "Sikov explains the warrior's journey of revenge, sacrifice, and redemption.",
    translator: "Sikov",
    language: "Kinyarwanda",
    type: "Movie",
  },

  {
    title: "Night City",
    slug: "night-city",
    year: "2026",
    rating: "8.4",
    genres: ["Drama", "Crime", "Mystery"],
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    description:
      "Life in a dangerous city changes when an ordinary man becomes involved in a criminal conflict.",
    explainer:
      "Sikov explains how one decision changes the lives of several people in the city.",
    translator: "Sikov",
    language: "Kinyarwanda",
    type: "Movie",
  },

  {
    title: "The Journey",
    slug: "the-journey",
    year: "2025",
    rating: "8.1",
    genres: ["Adventure", "Fantasy", "Romance"],
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    description:
      "Two travelers begin an unexpected journey that changes their lives forever.",
    explainer:
      "Sikov explains the adventure, relationships, and difficult choices made during their journey.",
    translator: "Sikov",
    language: "Kinyarwanda",
    type: "Movie",
  },
];