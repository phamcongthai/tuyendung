import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface HollandQuestion {
  _id: string;
  order: number;
  content: string;
  category: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  options: { label: string; value: number }[];
  deleted?: boolean;
}

export interface HollandProfile {
  _id: string;
  code: string;
  title: string;
  description: string;
  suitableCareers: string[];
  suggestedSkills: string[];
  image?: string;
  deleted?: boolean;
}

export interface HollandResult {
  _id: string;
  accountId: any;
  scores: {
    R: number;
    I: number;
    A: number;
    S: number;
    E: number;
    C: number;
  };
  topCode: string;
  createdAt: string;
}

export const hollandAPI = {
  // Questions
  getQuestions: async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/holland/questions`, {
      withCredentials: true,
    });
    return res.data;
  },
  getQuestion: async (id: string) => {
    const res = await axios.get(`${API_BASE_URL}/admin/holland/questions/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
  createQuestion: async (data: Partial<HollandQuestion>) => {
    const res = await axios.post(`${API_BASE_URL}/admin/holland/questions`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  updateQuestion: async (id: string, data: Partial<HollandQuestion>) => {
    const res = await axios.put(`${API_BASE_URL}/admin/holland/questions/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  deleteQuestion: async (id: string) => {
    const res = await axios.delete(`${API_BASE_URL}/admin/holland/questions/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },

  // Profiles
  getProfiles: async () => {
    const res = await axios.get(`${API_BASE_URL}/admin/holland/profiles`, {
      withCredentials: true,
    });
    return res.data;
  },
  getProfile: async (id: string) => {
    const res = await axios.get(`${API_BASE_URL}/admin/holland/profiles/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
  createProfile: async (data: Partial<HollandProfile>) => {
    const res = await axios.post(`${API_BASE_URL}/admin/holland/profiles`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  updateProfile: async (id: string, data: Partial<HollandProfile>) => {
    const res = await axios.put(`${API_BASE_URL}/admin/holland/profiles/${id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  deleteProfile: async (id: string) => {
    const res = await axios.delete(`${API_BASE_URL}/admin/holland/profiles/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },

  // Results
  getResults: async (page = 1, limit = 20) => {
    const res = await axios.get(`${API_BASE_URL}/admin/holland/results`, { 
      params: { page, limit },
      withCredentials: true,
    });
    return res.data;
  },
};
