import { Course } from "../types/course";

const API_BASE_URL = "https://qogamfin.kz/api/public";

export const coursesService = {
    async getCourses(): Promise<Course[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/courses`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },
};
