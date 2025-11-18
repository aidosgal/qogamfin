export interface LessonDetailed {
  id: number;
  title: string;
  description: string;
  video: string;
  course_id: number;
  order: number;
  favourite: number;
  translations: LessonTranslation[];
}

export interface LessonTranslation {
  id: number;
  locale: string;
  title: string;
  description: string;
  video: string;
}

export interface Material {
  id: number;
  material_id?: number;
  lesson_id: number;
  locale?: string;
  title: string;
  description?: string;
  content?: string;
  file_url?: string;
  file_type?: string;
  file_path?: string;
  created_at: string;
  updated_at?: string;
}

export interface LessonResponse {
  status: boolean;
  message: string;
  data?: LessonDetailed;
}

export interface MaterialsResponse {
  status: boolean;
  message: string;
  data?: Material[];
}

export interface CompleteLessonResponse {
  status: boolean;
  message: string;
}
