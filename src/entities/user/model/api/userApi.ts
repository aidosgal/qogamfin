import { UserInfoResponse, UpdateUserRequest, UpdateUserResponse } from '../types/user';

const API_URL = 'https://qogamfin.kz/api';

export const userApi = {
  getUserInfo: async (token: string): Promise<UserInfoResponse> => {
    console.log('👤 [API] getUserInfo - Request:', { url: `${API_URL}/user-info` });
    
    const response = await fetch(`${API_URL}/user-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('👤 [API] getUserInfo - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] getUserInfo - Error:', result);
      throw new Error(result.message || 'Failed to fetch user info');
    }

    return result;
  },

  updateUserInfo: async (token: string, userId: number, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    console.log('👤 [API] updateUserInfo - Request:', { url: `${API_URL}/personal/account/update/${userId}`, data });
    
    const response = await fetch(`${API_URL}/personal/account/update/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log('👤 [API] updateUserInfo - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] updateUserInfo - Error:', result);
      throw new Error(result.message || 'Failed to update user info');
    }

    return result;
  },
};
