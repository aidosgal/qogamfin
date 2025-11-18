export interface Certificate {
  id: number;
  name: string;
  created_at: string;
  url?: string;
  course_name?: string;
  description?: string;
}

export interface CertificatesResponse {
  certificates: Certificate[];
}
