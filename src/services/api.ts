/**
 * FitSphere Backend API Service
 * Manages HTTP communication with the Spring Boot REST API
 */

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'TRAINER' | 'STUDENT';
  active: boolean;
  createdAt: string;
}

export interface BackendAuthResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: BackendUser;
}

export interface BackendErrorResponse {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  validationErrors?: Record<string, string>;
}

export interface StudentProfileResponse {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  role: 'STUDENT';
  active: boolean;
  userCreatedAt: string;
  profileId: number;
  studentId: string;
  department?: string;
  course?: string;
  yearOfStudy?: number;
  dateOfBirth?: string;
  gender?: string;
  fitnessGoal?: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfileUpdateRequest {
  name?: string;
  phone?: string;
  department?: string;
  course?: string;
  yearOfStudy?: number;
  dateOfBirth?: string;
  gender?: string;
  fitnessGoal?: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface TrainerProfileResponse {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  role: 'TRAINER';
  active: boolean;
  userCreatedAt: string;
  profileId: number;
  trainerId: string;
  qualification?: string;
  experienceYears?: number;
  specialization?: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerProfileUpdateRequest {
  name?: string;
  phone?: string;
  qualification?: string;
  experienceYears?: number;
  specialization?: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface AdminProfileResponse {
  userId: number;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN';
  active: boolean;
  userCreatedAt: string;
  profileId: number;
  employeeId: string;
  department?: string;
  designation?: string;
  bio?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileUpdateRequest {
  name?: string;
  phone?: string;
  department?: string;
  designation?: string;
  bio?: string;
  profileImageUrl?: string;
}

const TOKEN_KEY = 'fitsphere_jwt_token';

export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // storage unavailable
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // storage unavailable
    }
  }
};

const BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: BackendErrorResponse;
    try {
      errorData = await response.json();
    } catch {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    if (errorData.validationErrors && Object.keys(errorData.validationErrors).length > 0) {
      const firstError = Object.values(errorData.validationErrors)[0];
      throw new Error(firstError);
    }

    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  /**
   * Authenticate user credentials and return JWT with profile
   */
  async login(email: string, password: string): Promise<BackendAuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });

    const data = await handleResponse<BackendAuthResponse>(response);
    if (data.token) {
      tokenStorage.set(data.token);
    }
    return data;
  },

  /**
   * Register a new Student-Athlete in MySQL
   */
  async registerStudent(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<BackendUser> {
    const response = await fetch(`${BASE_URL}/auth/register/student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        phone: data.phone || '+1 (555) 000-0000',
      }),
    });

    return handleResponse<BackendUser>(response);
  },

  /**
   * Register a new Coach/Trainer in MySQL
   */
  async registerTrainer(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<BackendUser> {
    const response = await fetch(`${BASE_URL}/auth/register/trainer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password.trim(),
        phone: data.phone || '+1 (555) 000-0000',
      }),
    });

    return handleResponse<BackendUser>(response);
  },

  /**
   * Inspect currently authenticated profile using JWT Bearer token
   */
  async getMe(): Promise<BackendUser> {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return handleResponse<BackendUser>(response);
  },

  /**
   * Student Profile APIs
   */
  async getStudentProfile(): Promise<StudentProfileResponse> {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/student/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return handleResponse<StudentProfileResponse>(response);
  },

  async updateStudentProfile(data: StudentProfileUpdateRequest): Promise<StudentProfileResponse> {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/student/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse<StudentProfileResponse>(response);
  },

  /**
   * Trainer Profile APIs
   */
  async getTrainerProfile(): Promise<TrainerProfileResponse> {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/trainer/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return handleResponse<TrainerProfileResponse>(response);
  },

  async updateTrainerProfile(data: TrainerProfileUpdateRequest): Promise<TrainerProfileResponse> {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/trainer/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse<TrainerProfileResponse>(response);
  },

  /**
   * Admin Profile APIs
   */
  async getAdminProfile(): Promise<AdminProfileResponse> {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/admin/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return handleResponse<AdminProfileResponse>(response);
  },

  async updateAdminProfile(data: AdminProfileUpdateRequest): Promise<AdminProfileResponse> {
    const token = tokenStorage.get();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await fetch(`${BASE_URL}/admin/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse<AdminProfileResponse>(response);
  }
};
