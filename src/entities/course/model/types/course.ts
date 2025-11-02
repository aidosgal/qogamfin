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

export interface CourseDetailed {
  id: number;
  lessons_count: number;
  img: string;
  title: string;
  description: string;
  translations: CourseTranslation[];
  lessons: CourseLessons[];
}

export interface CourseLessons {
  id: number;
  favourite: number;
  title: string;
  description: string;
  video: string;
  translations: LessonTranslation[];
}

export interface LessonTranslation {
  id: number;
  locale: string;
  title: string;
  description: string;
  video: string;
}
