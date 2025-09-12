export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
}

export interface Profile {
  id: string;
  resumeUrl?: string;
  summary?: string;
  skills: string[];
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website?: string;
  location: string;
  jobs?: Job[];
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: Company;
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
    company: Company;
    location: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}
