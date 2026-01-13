import { apiService } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/register', credentials);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  },

  async getCurrentUser() {
    return apiService.get('/auth/me');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },
};
