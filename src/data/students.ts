export interface Student {
  id: number;
  name: string;
  email: string;
  initials: string;
  enrolledCourseIds: number[];
  joinDate: string;
  status: "active" | "inactive";
  avgScore: number;
  hoursLearned: number;
}

export const initialStudents: Student[] = [
  {
    id: 1,
    name: "Tife Abayomi",
    email: "tife@futuretch.io",
    initials: "TA",
    enrolledCourseIds: [1, 2, 3, 4],
    joinDate: "Jan 10, 2026",
    status: "active",
    avgScore: 88,
    hoursLearned: 47,
  },
  {
    id: 2,
    name: "Amara Osei",
    email: "amara@futuretch.io",
    initials: "AO",
    enrolledCourseIds: [1, 5],
    joinDate: "Jan 12, 2026",
    status: "active",
    avgScore: 92,
    hoursLearned: 38,
  },
  {
    id: 3,
    name: "Kwame Mensah",
    email: "kwame@futuretch.io",
    initials: "KM",
    enrolledCourseIds: [2, 3, 6],
    joinDate: "Jan 18, 2026",
    status: "active",
    avgScore: 76,
    hoursLearned: 29,
  },
  {
    id: 4,
    name: "Zara Nwosu",
    email: "zara@futuretch.io",
    initials: "ZN",
    enrolledCourseIds: [1, 2],
    joinDate: "Jan 25, 2026",
    status: "active",
    avgScore: 84,
    hoursLearned: 22,
  },
  {
    id: 5,
    name: "Emeka Diallo",
    email: "emeka@futuretch.io",
    initials: "ED",
    enrolledCourseIds: [3, 4, 5],
    joinDate: "Feb 2, 2026",
    status: "inactive",
    avgScore: 71,
    hoursLearned: 14,
  },
  {
    id: 6,
    name: "Chisom Eze",
    email: "chisom@futuretch.io",
    initials: "CE",
    enrolledCourseIds: [1, 6],
    joinDate: "Feb 8, 2026",
    status: "active",
    avgScore: 95,
    hoursLearned: 55,
  },
  {
    id: 7,
    name: "Folake Adeyemi",
    email: "folake@futuretch.io",
    initials: "FA",
    enrolledCourseIds: [2, 4, 5],
    joinDate: "Feb 14, 2026",
    status: "active",
    avgScore: 81,
    hoursLearned: 33,
  },
  {
    id: 8,
    name: "Olumide Bello",
    email: "olumide@futuretch.io",
    initials: "OB",
    enrolledCourseIds: [1, 3],
    joinDate: "Feb 20, 2026",
    status: "active",
    avgScore: 79,
    hoursLearned: 19,
  },
];
