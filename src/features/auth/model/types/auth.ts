export interface User {
  id: number;
  phone: string;
  name: string;
  role_id: number;
  created_at: string;
}

export interface LoginRequest {
  phone: string;
  token: string;
}

export interface SendOtpRequest {
  phone: string;
  channel?: 'whatsapp' | 'sms';
}

export interface ConfirmOtpRequest {
  phone: string;
  sms_code: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  channel?: string;
}

export interface ConfirmOtpResponse {
  success: boolean;
  message?: string;
  token?: string;
  password?: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  loginRequest: LoginRequest;
  otpInputs: string[];
  countdown: number;
}
