import { api } from './api';

export interface User {
  id: number;
  email: string;
  full_name: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async login(email: string, password: string):Promise<TokenResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 expects username
    formData.append('password', password);

    const response = await api.post<TokenResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  async signup(email: string, password: string, full_name: string):Promise<User> {
    const response = await api.post<User>('/auth/signup', {
      email,
      password,
      full_name,
    });
    return response.data;
  },

  async getMe():Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  }
};
