export interface Course {
  id: number;
  lessons_count: number;
  img: string;
  title: string;
  description: string;
  translations: CourseTranslation[];
}

export interface CourseTranslation {
  id: number;
  locale: string;
  title: string;
  description: string;
  img: string;
}
