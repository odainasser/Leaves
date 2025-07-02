export interface User {
  id: string;
  fullName: string;
  email: string;
  role: number;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
}
