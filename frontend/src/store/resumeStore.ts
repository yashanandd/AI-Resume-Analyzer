import { create } from 'zustand';
import { Resume } from '../services/resumeService';

interface ResumeState {
  currentResume: Resume | null;
  setCurrentResume: (resume: Resume | null) => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  currentResume: null,
  setCurrentResume: (resume) => set({ currentResume: resume }),
}));
