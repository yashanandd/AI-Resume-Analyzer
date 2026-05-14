import { api } from './api';

export interface Resume {
  id: number;
  filename: string;
  parsed_text: string;
  ats_score: number;
  ai_feedback: string; // JSON string
  owner_id: number;
}

export const resumeService = {
  async uploadResume(file: File, jobRole: string): Promise<Resume> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_role', jobRole);

    const response = await api.post<Resume>('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getResumes(): Promise<Resume[]> {
    const response = await api.get<Resume[]>('/resumes/');
    return response.data;
  }
};
