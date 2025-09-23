import axios, { AxiosResponse } from 'axios';
import { handleApiError, ApiError } from '@/utils/errorHandler';

// Base axios instance configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Check if we're not already on the login page
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/signin') && 
          !window.location.pathname.includes('/signup')) {
        
        // Clear token
        localStorage.removeItem('access_token');
        
        // Redirect to login page
        window.location.href = '/signin';
        
        return Promise.reject({
          ...error,
          message: 'Your session has expired. Please log in again.'
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// ==================== TYPE DEFINITIONS ====================

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  company_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  type: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  type: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  type?: string;
}

// Student types
export interface Student {
  id: number;
  name: string;
  parallel: string;
  class_name: string;
  average_grade?: number;
  danger_level?: number;
}

export interface CreateStudentRequest {
  name: string;
  parallel: string;
  class_name: string;
}

export interface UpdateStudentRequest {
  name?: string;
  parallel?: string;
  class_name?: string;
}

// Grade types
export interface Grade {
  id: number;
  student_id: number;
  subject: string;
  grade: number;
  date: string;
  semester: number;
  parallel: string;
  class_name: string;
  actualStudentCount?: number;
}

export interface CreateGradeRequest {
  student_id: number;
  subject: string;
  grade: number;
  date: string;
  semester: number;
  parallel: string;
  class_name: string;
}

export interface UpdateGradeRequest {
  subject?: string;
  grade?: number;
  date?: string;
  semester?: number;
  parallel?: string;
  class_name?: string;
}

// Dashboard types
export interface DangerLevelStats {
  [key: number]: {
    student_count: number;
  };
}

export interface DashboardResponse {
  danger_level_stats: DangerLevelStats;
  all_dangerous_classes: any[];
}

export interface PieChartResponse {
  class_danger_percentages: Array<{
    class_name: string;
    danger_percentage: number;
  }>;
}

export interface DangerStudentsResponse {
  filtered_class_data: Array<{
    class: Student[];
    class_name: string;
    parallel: string;
  }>;
}

// Analytics types
export interface AnalyticsData {
  level: number;
  count: number;
  students: any[];
}

// Class types
export interface ClassData {
  class_name: string;
  parallel: string;
  students: Student[];
}

// System Settings types
export interface SystemSettings {
  id: number;
  min_grade: number;
  max_grade: number;
  class_letters: string[];
  school_name?: string;
  academic_year: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSystemSettingsRequest {
  min_grade?: number;
  max_grade?: number;
  class_letters?: string[];
  school_name?: string;
  academic_year?: string;
}

export interface UpdateSystemSettingsRequest {
  min_grade?: number;
  max_grade?: number;
  class_letters?: string[];
  school_name?: string;
  academic_year?: string;
}

export interface AvailableClassesResponse {
  classes: string[];
  grades: number[];
}

// ==================== API SERVICE CLASS ====================

class ApiService {
  // ==================== AUTH ENDPOINTS ====================
  
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await apiClient.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', { email });
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.get('/auth/users/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ==================== USER MANAGEMENT ====================
  
  async getUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<User[]> = await apiClient.get('/users/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.post('/users/', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateUser(userId: number, userData: UpdateUserRequest): Promise<User> {
    try {
      const response: AxiosResponse<User> = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await apiClient.delete(`/users/${userId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ==================== DASHBOARD ====================
  
  async getDangerLevels(): Promise<DashboardResponse> {
    try {
      const response: AxiosResponse<DashboardResponse> = await apiClient.get('/dashboard/danger-levels');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getDangerLevelsPieChart(): Promise<PieChartResponse> {
    try {
      const response: AxiosResponse<PieChartResponse> = await apiClient.get('/dashboard/danger-levels-piechart');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ==================== GRADES & CLASSES ====================
  
  async getGrades(): Promise<Grade[]> {
    try {
      const response: AxiosResponse<Grade[]> = await apiClient.get('/grades/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAllGrades(): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await apiClient.get('/grades/all/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createGrade(gradeData: CreateGradeRequest): Promise<Grade> {
    try {
      const response: AxiosResponse<Grade> = await apiClient.post('/grades/', gradeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateGrade(gradeId: number, gradeData: UpdateGradeRequest): Promise<Grade> {
    try {
      const response: AxiosResponse<Grade> = await apiClient.put(`/grades/${gradeId}`, gradeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteGrade(gradeId: number): Promise<void> {
    try {
      await apiClient.delete(`/grades/${gradeId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getSubjects(): Promise<string[]> {
    try {
      const response: AxiosResponse<string[]> = await apiClient.get('/grades/subjects');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getParallels(): Promise<string[]> {
    try {
      const response: AxiosResponse<string[]> = await apiClient.get('/grades/parallels');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getStudentsByDangerLevel(level: number): Promise<DangerStudentsResponse> {
    try {
      const response: AxiosResponse<DangerStudentsResponse> = await apiClient.get(`/grades/get_students_danger?level=${level}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getClassData(parallel: string, className: string): Promise<ClassData> {
    try {
      const response: AxiosResponse<ClassData> = await apiClient.get(`/grades/class`, {
        params: { parallel, class_name: className }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getStudentGrades(studentId: number): Promise<Grade[]> {
    try {
      const response: AxiosResponse<Grade[]> = await apiClient.get(`/grades/student/${studentId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ==================== STUDENTS ====================
  
  async getStudents(): Promise<Student[]> {
    try {
      const response: AxiosResponse<Student[]> = await apiClient.get('/students/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createStudent(studentData: CreateStudentRequest): Promise<Student> {
    try {
      const response: AxiosResponse<Student> = await apiClient.post('/students/', studentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateStudent(studentId: number, studentData: UpdateStudentRequest): Promise<Student> {
    try {
      const response: AxiosResponse<Student> = await apiClient.put(`/students/${studentId}`, studentData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteStudent(studentId: number): Promise<void> {
    try {
      await apiClient.delete(`/students/${studentId}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ==================== FILE UPLOAD ====================
  
  async uploadFile(file: File, endpoint: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ==================== ANALYTICS ====================
  
  async getAnalytics(): Promise<AnalyticsData[]> {
    try {
      const dangerLevels = [1, 2, 3];
      const promises = dangerLevels.map(async (level) => {
        try {
          const response = await this.getStudentsByDangerLevel(level);
          const studentCount = response.filtered_class_data.reduce(
            (total: number, classData: any) => total + classData.class.length, 0
          );
          return {
            level,
            count: studentCount,
            students: response.filtered_class_data
          };
        } catch (error) {
          return { level, count: 0, students: [] };
        }
      });

      return await Promise.all(promises);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // ==================== SYSTEM SETTINGS ====================
  
  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const response: AxiosResponse<SystemSettings> = await apiClient.get('/settings/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateSystemSettings(settingsData: UpdateSystemSettingsRequest): Promise<SystemSettings> {
    try {
      const response: AxiosResponse<SystemSettings> = await apiClient.put('/settings/', settingsData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createSystemSettings(settingsData: CreateSystemSettingsRequest): Promise<any> {
    try {
      const response = await apiClient.post('/settings/', settingsData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAvailableClasses(): Promise<AvailableClassesResponse> {
    try {
      const response: AxiosResponse<AvailableClassesResponse> = await apiClient.get('/settings/available-classes');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Create and export a singleton instance
const api = new ApiService();
export default api;

// Also export the axios instance for direct use if needed
export { apiClient };
