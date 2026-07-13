import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { cn } from '../ui/Button';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Input';

import { resumeService } from '../../services/resumeService';
import { useResumeStore } from '../../store/resumeStore';

export const DragAndDropZone = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filteredRoles, setFilteredRoles] = useState<string[]>([]);

  const jobRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'AI Engineer',
    'DevOps Engineer',
    'Cloud Engineer',
    'Cybersecurity Analyst',
    'Data Analyst',
    'Business Analyst',
    'Python Developer',
    'React Developer',
    'Java Developer'
  ];

  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const setCurrentResume = useResumeStore((state) => state.setCurrentResume);

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setJobRole(value);

    if (value.trim() === '') {
      setFilteredRoles([]);
      return;
    }

    const filtered = jobRoles.filter((role) =>
      role.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredRoles(filtered);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const validateFile = (selectedFile: File) => {
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid format. Please upload PDF or DOCX.');
      setFile(null);
      return false;
    }

    setError(null);
    setFile(selectedFile);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (!jobRole.trim()) {
      setError('Target Job Role is required.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const result = await resumeService.uploadResume(file, jobRole);
      setCurrentResume(result);
      navigate('/analysis');
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        'Failed to upload and analyze the document.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="mb-6 space-y-2 relative">
        <Label htmlFor="jobRole" className="text-white">
          Target Job Role Vector
        </Label>

        <Input
          id="jobRole"
          placeholder="e.g. AI/ML Engineer"
          value={jobRole}
          onChange={handleRoleChange}
          className="bg-surface/50 border-white/20"
        />

        {filteredRoles.length > 0 && (
          <div
            className="
              absolute top-full left-0 w-full bg-black border
              border-gray-700 rounded-md mt-1 z-50 overflow-hidden shadow-lg
            "
          >
            {filteredRoles.map((role, index) => (
              <div
                key={index}
                onClick={() => {
                  setJobRole(role);
                  setFilteredRoles([]);
                }}
                className="p-3 cursor-pointer hover:bg-gray-800 text-white transition-colors"
              >
                {role}
              </div>
            ))}
          </div>
        )}
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200 ease-in-out cursor-pointer overflow-hidden group mb-6',
          isDragActive
            ? 'border-primary bg-primary/10 neon-glow'
            : 'border-white/20 bg-surface/50 hover:border-primary/50 hover:bg-surface/80'
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />

        <div
          className="
            absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
          "
        />

        {!file ? (
          <div className="flex flex-col items-center space-y-4">
            <div
              className="
                p-4 bg-background rounded-full border border-white/10
                group-hover:border-primary/30 group-hover:neon-glow transition-all
              "
            >
              <Upload className="w-8 h-8 text-primary" />
            </div>

            <div>
              <p className="text-lg font-medium text-white mb-1">
                Drop your resume vector here
              </p>
              <p className="text-sm text-textMuted font-mono">
                Supported formats: .pdf, .docx
              </p>
            </div>

            <span className="text-primary text-sm font-mono hover:underline mt-2">
              &gt; Browse Files
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary/20 rounded-full border border-primary/50 neon-glow">
              <FileText className="w-8 h-8 text-white" />
            </div>

            <div>
              <p className="text-lg font-medium text-white mb-1 flex items-center justify-center gap-2">
                {file.name}
                <CheckCircle className="w-4 h-4 text-secondary" />
              </p>
              <p className="text-sm text-textMuted font-mono">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {!isUploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="text-danger text-sm font-mono hover:underline mt-2"
              >
                [ Remove ]
              </button>
            )}
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            mb-6 flex items-center gap-2 text-danger text-sm
            bg-danger/10 border border-danger/20 p-3 rounded-md font-mono
          "
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {file && (
        <Button
          className="w-full"
          size="lg"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Vector Analysis...
            </>
          ) : (
            'Execute Analysis Sequence'
          )}
        </Button>
      )}
    </div>
  );
};