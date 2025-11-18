import AsyncStorage from '@react-native-async-storage/async-storage';
import { LessonResponse, MaterialsResponse, CompleteLessonResponse } from '../types/lesson';

const API_URL = 'https://qogamfin.kz/api';
const STORAGE_KEY = '@auth_token';

const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(STORAGE_KEY);
};

export const lessonApi = {
  checkAvailability: async (lessonId: number, courseId: number): Promise<{ status: boolean }> => {
    const token = await getAuthToken();
    
    console.log('🔵 [API] checkAvailability - Request:', { 
      url: `${API_URL}/client/check-available/lesson/${lessonId}/${courseId}` 
    });
    
    const response = await fetch(`${API_URL}/client/check-available/lesson/${lessonId}/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('🔵 [API] checkAvailability - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] checkAvailability - Error:', result);
      throw new Error(result.message || 'Failed to check availability');
    }

    return result;
  },

  getLesson: async (id: number): Promise<any> => {
    const token = await getAuthToken();
    
    console.log('🔵 [API] getLesson - Request:', { url: `${API_URL}/client/lesson/${id}` });
    
    const response = await fetch(`${API_URL}/client/lesson/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('🔵 [API] getLesson - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] getLesson - Error:', result);
      throw new Error(result.message || 'Failed to fetch lesson');
    }

    return result;
  },

  getMaterials: async (lessonId: number): Promise<MaterialsResponse> => {
    const token = await getAuthToken();
    
    console.log('🔵 [API] getMaterials - Request:', { url: `${API_URL}/materials/${lessonId}` });
    
    const response = await fetch(`${API_URL}/materials/${lessonId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('🔵 [API] getMaterials - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] getMaterials - Error:', result);
      throw new Error(result.message || 'Failed to fetch materials');
    }

    return result;
  },

  completeLesson: async (lessonId: number): Promise<CompleteLessonResponse> => {
    const token = await getAuthToken();
    
    console.log('🟢 [API] completeLesson - Request:', { url: `${API_URL}/lessons/${lessonId}/complete` });
    
    const response = await fetch(`${API_URL}/lessons/${lessonId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('🟢 [API] completeLesson - Response:', { status: response.status, result });
    
    if (!response.ok) {
      console.error('🔴 [API] completeLesson - Error:', result);
      throw new Error(result.message || 'Failed to complete lesson');
    }

    return result;
  },
};
