import { SendOtpRequest, SendOtpResponse, ConfirmOtpRequest, ConfirmOtpResponse } from '../types/auth';

const API_URL = 'https://qogamfin.kz/api';

export const authApi = {
  sendLoginCode: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
    console.log('🔵 [API] sendLoginCode - Request:', { url: `${API_URL}/send-login-code`, data });
    
    const response = await fetch(`${API_URL}/send-login-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('🔵 [API] sendLoginCode - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] sendLoginCode - Error:', result);
      throw new Error(result.message || 'Failed to send OTP');
    }

    return result;
  },

  confirmLoginCode: async (data: ConfirmOtpRequest): Promise<ConfirmOtpResponse> => {
    console.log('🔵 [API] confirmLoginCode - Request:', { url: `${API_URL}/login-confirm`, data });
    
    const response = await fetch(`${API_URL}/login-confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('🔵 [API] confirmLoginCode - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] confirmLoginCode - Error:', result);
      throw new Error(result.message || 'Failed to verify OTP');
    }

    return result;
  },

  sendAppCode: async (data: SendOtpRequest): Promise<SendOtpResponse> => {
    console.log('🟢 [API] sendAppCode - Request:', { url: `${API_URL}/send-app-code`, data });
    
    const response = await fetch(`${API_URL}/send-app-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('🟢 [API] sendAppCode - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] sendAppCode - Error:', result);
      throw new Error(result.message || 'Failed to send OTP');
    }

    return result;
  },

  confirmAppCode: async (data: ConfirmOtpRequest): Promise<ConfirmOtpResponse> => {
    console.log('🟢 [API] confirmAppCode - Request:', { url: `${API_URL}/confirm-app-code`, data });
    
    const response = await fetch(`${API_URL}/confirm-app-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('🟢 [API] confirmAppCode - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] confirmAppCode - Error:', result);
      throw new Error(result.message || 'Failed to verify OTP');
    }

    return result;
  },
};
