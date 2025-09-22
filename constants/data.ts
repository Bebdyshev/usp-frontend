import { NavItem } from '../types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Панель управления',
    url: '/d/dashboard',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Студенты',
    url: '/d/students',
    icon: 'users',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },

];

interface Question {
  question_title: string;
  answer: string;
}

interface FormData {
  id: number;
  candidate: string;
  status: string;
  questions: Question[];
  cv: string;
}

export const formsData: FormData[] = [
  {
    id: 1,
    candidate: "Berdyshev Kerey",
    status: "Complete",
    questions: [
      {
        question_title: "What is your name",
        answer: "Berdyshev Kerey"
      }
    ],
    cv: "document"
  },
  {
    id: 2,
    candidate: "Baglanov Alikhan",
    status: "In-progress",
    questions: [
      {
        question_title: "What is your name",
        answer: "Baglanov Alikhan"
      }
    ],
    cv: "document"
  },
  {
    id: 3,
    candidate: "Mazhitov Jafar",
    status: "Pending",
    questions: [
      {
        question_title: "What is your name",
        answer: ""
      }
    ],
    cv: "document"
  }
];

export interface ClassInfo {
  id: number;
  class_liter: string;
  classNumber: String;
  curator: string;
}

interface subjectInfo {
  id: number;
  classNumber: String;
  subjects: string[];
}

export const classData: ClassInfo[] = [
  // 1 класс
  { id: 1, class_liter: "1A", classNumber: "1", curator: "Анна Викторовна" },
  { id: 2, class_liter: "1B", classNumber: "1", curator: "Мария Сергеевна" },
  { id: 3, class_liter: "1C", classNumber: "1", curator: "Светлана Александровна" },
  
  // 2 класс
  { id: 4, class_liter: "2A", classNumber: "2", curator: "Ольга Петровна" },
  { id: 5, class_liter: "2B", classNumber: "2", curator: "Наталья Ивановна" },
  { id: 6, class_liter: "2C", classNumber: "2", curator: "Елена Николаевна" },
  
  // 3 класс
  { id: 7, class_liter: "3A", classNumber: "3", curator: "Татьяна Михайловна" },
  { id: 8, class_liter: "3B", classNumber: "3", curator: "Галина Васильевна" },
  { id: 9, class_liter: "3C", classNumber: "3", curator: "Ирина Владимировна" },
  
  // 4 класс
  { id: 10, class_liter: "4A", classNumber: "4", curator: "Людмила Дмитриевна" },
  { id: 11, class_liter: "4B", classNumber: "4", curator: "Валентина Федоровна" },
  { id: 12, class_liter: "4C", classNumber: "4", curator: "Зинаида Романовна" },
  
  // 5 класс
  { id: 13, class_liter: "5A", classNumber: "5", curator: "Вера Николаевна" },
  { id: 14, class_liter: "5B", classNumber: "5", curator: "Лариса Анатольевна" },
  { id: 15, class_liter: "5C", classNumber: "5", curator: "Оксана Сергеевна" },
  
  // 6 класс
  { id: 16, class_liter: "6A", classNumber: "6", curator: "Инна Юрьевна" },
  { id: 17, class_liter: "6B", classNumber: "6", curator: "Маргарита Львовна" },
  { id: 18, class_liter: "6C", classNumber: "6", curator: "Раиса Григорьевна" },
  
  // 7 класс
  { id: 19, class_liter: "7A", classNumber: "7", curator: "Нина Павловна" },
  { id: 20, class_liter: "7B", classNumber: "7", curator: "Клавдия Тимофеевна" },
  { id: 21, class_liter: "7C", classNumber: "7", curator: "Алла Владиславовна" },
  
  // 8 класс
  { id: 22, class_liter: "8A", classNumber: "8", curator: "Лидия Константиновна" },
  { id: 23, class_liter: "8B", classNumber: "8", curator: "Антонина Ефимовна" },
  { id: 24, class_liter: "8C", classNumber: "8", curator: "Полина Олеговна" },
  
  // 9 класс
  { id: 25, class_liter: "9A", classNumber: "9", curator: "Татьяна Викторовна" },
  { id: 26, class_liter: "9B", classNumber: "9", curator: "Ирина Сергеевна" },
  { id: 27, class_liter: "9C", classNumber: "9", curator: "Ольга Викторовна" },
  { id: 28, class_liter: "9D", classNumber: "9", curator: "Светлана Николаевна" },
  { id: 29, class_liter: "9E", classNumber: "9", curator: "Наталья Борисовна" },
  { id: 30, class_liter: "9F", classNumber: "9", curator: "Марина Александровна" },
  
  // 10 класс
  { id: 31, class_liter: "10A", classNumber: "10", curator: "Елена Петровна" },
  { id: 32, class_liter: "10B", classNumber: "10", curator: "Анна Васильевна" },
  { id: 33, class_liter: "10C", classNumber: "10", curator: "Галина Александровна" },
  { id: 34, class_liter: "10D", classNumber: "10", curator: "Оксана Юрьевна" },
  { id: 35, class_liter: "10E", classNumber: "10", curator: "Вероника Ивановна" },
  { id: 36, class_liter: "10F", classNumber: "10", curator: "Дарья Сергеевна" },
  
  // 11 класс
  { id: 37, class_liter: "11A", classNumber: "11", curator: "Юлия Викторовна" },
  { id: 38, class_liter: "11B", classNumber: "11", curator: "Татьяна Андреевна" },
  { id: 39, class_liter: "11C", classNumber: "11", curator: "Мария Николаевна" },
  { id: 40, class_liter: "11D", classNumber: "11", curator: "Виктория Павловна" },
  { id: 41, class_liter: "11E", classNumber: "11", curator: "Людмила Григорьевна" },
  { id: 42, class_liter: "11F", classNumber: "11", curator: "Ольга Сергеевна" }
];

export const subjectData: subjectInfo[] = [
  { id: 1, classNumber: "1", subjects: ["Букварь", "Математика", "Познание мира", "Физическая культура", "Музыка", "Трудовое обучение", "Изобразительное искусство"]},
  { id: 2, classNumber: "2", subjects: ["Русский язык", "Литературное чтение", "Математика", "Познание мира", "Физическая культура", "Музыка", "Трудовое обучение", "Изобразительное искусство"]},
  { id: 3, classNumber: "3", subjects: ["Русский язык", "Литературное чтение", "Математика", "Естествознание", "Физическая культура", "Музыка", "Трудовое обучение", "Изобразительное искусство"]},
  { id: 4, classNumber: "4", subjects: ["Русский язык", "Литературное чтение", "Математика", "Естествознание", "Физическая культура", "Музыка", "Трудовое обучение", "Изобразительное искусство"]},
  { id: 5, classNumber: "5", subjects: ["Казахский язык и литература", "Русский язык", "Русская литература", "Математика", "Естествознание", "История", "География", "Английский язык", "Физическая культура", "Музыка", "Изобразительное искусство", "Технология"]},
  { id: 6, classNumber: "6", subjects: ["Казахский язык и литература", "Русский язык", "Русская литература", "Математика", "Биология", "История", "География", "Английский язык", "Физическая культура", "Музыка", "Изобразительное искусство", "Технология"]},
  { id: 7, classNumber: "7", subjects: ["Казахский язык и литература", "Русский язык", "Русская литература", "Алгебра", "Геометрия", "Физика", "Биология", "Химия", "История Казахстана", "Всемирная история", "География", "Английский язык", "Физическая культура", "Информатика", "Технология"]},
  { id: 8, classNumber: "8", subjects: ["Казахский язык и литература", "Русский язык", "Русская литература", "Алгебра", "Геометрия", "Физика", "Биология", "Химия", "История Казахстана", "Всемирная история", "География", "Английский язык", "Физическая культура", "Информатика", "Технология"]},
  { id: 9, classNumber: "9", subjects: ["Казахский язык и литература", "Русская литература", "Русский язык", "Математика", "Физическая культура", "Искусство", "История Казахстана", "Химия", "Английский язык","Физика", "Биология", "Всемирная история", "География", "Основы права", "Информатика"]},
  { id: 10, classNumber: "10", subjects: ["Казахский язык и литература", "Русская литература", "Русский язык", "Алгебра и начала анализа", "Геометрия", "Физика", "Химия", "Биология", "История Казахстана", "Всемирная история", "География", "Английский язык", "Физическая культура", "Информатика", "Основы права", "Экономика"]},
  { id: 11, classNumber: "11", subjects: ["Казахский язык и литература", "Русская литература", "Русский язык", "Алгебра и начала анализа", "Геометрия", "Физика", "Химия", "Биология", "История Казахстана", "Всемирная история", "География", "Английский язык", "Физическая культура", "Информатика", "Основы права", "Экономика", "Технология"]}
];

export interface Student {
  id?: number;
  student_name: string;
  actual_score: number[];
  predicted_score: number[];
  danger_level: number;
  delta_percentage: number;
  class_liter: string;
  curator_name: string;
}