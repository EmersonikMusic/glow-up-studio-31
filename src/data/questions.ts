export type Difficulty = "Easy" | "Medium" | "Hard" | "Genius";
export type Category = "Science" | "History" | "Geography" | "Sports" | "Entertainment" | "Literature";

export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  correctId: string;
  category: Category;
  difficulty: Difficulty;
  author: string;
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Which form of far-right, authoritarian ultranationalism, characterized by dictatorial power, forcible suppression of opposition, and strong regimentation of society and the economy rose to prominence in early 20th century Europe?",
    answers: [
      { id: "A", text: "Communism" },
      { id: "B", text: "Fascism" },
      { id: "C", text: "Anarchism" },
      { id: "D", text: "Libertarianism" },
    ],
    correctId: "B",
    category: "History",
    difficulty: "Genius",
    author: "Dr. Eleanor Marsh",
  },
  {
    id: 2,
    text: "What is the powerhouse of the cell?",
    answers: [
      { id: "A", text: "Nucleus" },
      { id: "B", text: "Ribosome" },
      { id: "C", text: "Mitochondria" },
      { id: "D", text: "Golgi apparatus" },
    ],
    correctId: "C",
    category: "Science",
    difficulty: "Easy",
    author: "Prof. Samuel Webb",
  },
  {
    id: 3,
    text: "Which country is home to the ancient city of Petra, carved directly into rose-red rock cliffs?",
    answers: [
      { id: "A", text: "Egypt" },
      { id: "B", text: "Saudi Arabia" },
      { id: "C", text: "Turkey" },
      { id: "D", text: "Jordan" },
    ],
    correctId: "D",
    category: "Geography",
    difficulty: "Medium",
    author: "Amara Osei",
  },
  {
    id: 4,
    text: "In Shakespeare's 'Hamlet', what is the name of Hamlet's father's ghost who reveals the truth of his murder?",
    answers: [
      { id: "A", text: "King Fortinbras" },
      { id: "B", text: "King Hamlet" },
      { id: "C", text: "King Claudius" },
      { id: "D", text: "King Polonius" },
    ],
    correctId: "B",
    category: "Literature",
    difficulty: "Medium",
    author: "Clara Fontaine",
  },
  {
    id: 5,
    text: "Which athlete holds the world record for the 100m sprint with a time of 9.58 seconds, set at the 2009 World Championships in Berlin?",
    answers: [
      { id: "A", text: "Asafa Powell" },
      { id: "B", text: "Tyson Gay" },
      { id: "C", text: "Usain Bolt" },
      { id: "D", text: "Justin Gatlin" },
    ],
    correctId: "C",
    category: "Sports",
    difficulty: "Hard",
    author: "Marcus Reyes",
  },
  {
    id: 6,
    text: "In which film did the fictional AI system 'HAL 9000' famously refuse to open the pod bay doors?",
    answers: [
      { id: "A", text: "Blade Runner" },
      { id: "B", text: "Interstellar" },
      { id: "C", text: "2001: A Space Odyssey" },
      { id: "D", text: "Ex Machina" },
    ],
    correctId: "C",
    category: "Entertainment",
    difficulty: "Medium",
    author: "Nadia Kapoor",
  },
];
