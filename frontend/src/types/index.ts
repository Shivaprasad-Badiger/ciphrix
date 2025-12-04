export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
    pagination: Pagination;
  };
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  data: {
    task: Task;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  errors?: { field: string; message: string }[];
}

export interface TaskFormData {
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
