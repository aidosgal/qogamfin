export interface Role {
  id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  name: string;
  translations: Array<{
    id: number;
    role_id: number;
    locale: string;
    name: string;
  }>;
}

export interface Certificate {
  id: number;
  name: string;
  created_at: string;
  url?: string;
  course_name?: string;
  description?: string;
}

export interface User {
  id: number;
  name: string;
  role_id: number;
  type_jurist: string | null;
  email: string | null;
  iin: string | null;
  phone: string;
  phone_2: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  region_id: number;
  district_id: number;
  locality: string | null;
  birthday: string | null;
  source: string | null;
  points: number;
  role: Role;
  districts: any[];
  pjsip_user: any | null;
  certificate: Certificate | null;
}

export interface UserInfoResponse {
  id: number;
  name: string;
  role_id: number;
  type_jurist: string | null;
  email: string | null;
  iin: string | null;
  phone: string;
  phone_2: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  region_id: number;
  district_id: number;
  locality: string | null;
  birthday: string | null;
  source: string | null;
  points: number;
  role: Role;
  districts: any[];
  pjsip_user: any | null;
  certificate: Certificate | null;
}

export interface UpdateUserRequest {
  name: string;
  email: string | null;
  iin: string | null;
  region_id: number;
  district_id: number;
  birthday: string | null;
  password?: string;
  password_confirmation?: string | null;
}

export interface UpdateUserResponse {
  success: boolean;
}
