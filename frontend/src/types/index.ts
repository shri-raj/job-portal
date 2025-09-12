export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  tags: string[];
  createdAt: string;
  postedBy: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  appliedAt: string;
  job?: {
    title: string;
    company: string;
    location: string;
  };
  user?: {
    name: string;
    email: string;
  };
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
