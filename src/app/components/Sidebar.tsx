'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ProjectFile {
  id: string;
  name: string;
  content: string;
  type: 'html' | 'css' | 'js';
  createdAt: Date;
}

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  lastGeneratedCode?: { html: string; css: string; js: string };
  files: ProjectFile[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentProject: Project | null;
  onProjectSelect: (project: Project) => void;
  onNewProject: () => void;
  onDeleteProject: (projectId: string) => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
  currentProject,
  onProjectSelect,
  onNewProject,
}: SidebarProps) {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('pagecrafter_projects');
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects).map((p: Omit<Project, 'createdAt'> & { createdAt: string }) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
      setProjects(parsed);
    }
  }, []);

  // Save projects to localStorage
  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem('pagecrafter_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName.trim(),
      createdAt: new Date(),
      messages: [],
      lastGeneratedCode: undefined,
      files: []
    };

    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    onProjectSelect(newProject);
    setNewProjectName('');
    setIsCreating(false);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    saveProjects(updatedProjects);
    if (currentProject?.id === projectId) {
      onNewProject();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 transform transition-all duration-300 ease-out z-50 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } ${theme === 'dark' ? 'bg-gray-900/95 backdrop-blur-xl border-gray-800/50' : 'bg-white/95 backdrop-blur-xl border-gray-200/50'} border-r`}>

        {/* Header */}
        <div className={`p-5 border-b ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Projects
              </h2>
            </div>
            <button
              onClick={onToggle}
              className={`p-2 rounded-xl transition-all duration-200 ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* New Project Button */}
        <div className="p-4">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className={`w-full px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group ${theme === 'dark'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                }`}
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus-glow ${theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                  }`}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateProject}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 font-medium transition-all duration-300"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewProjectName('');
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {projects.length === 0 ? (
            <div className="p-6 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <svg className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No projects yet
              </p>
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                Create your first project to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 animate-fade-in ${currentProject?.id === project.id
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/50'
                      : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300'
                    : theme === 'dark'
                      ? 'hover:bg-gray-800/70 border-transparent hover:border-gray-700/50'
                      : 'hover:bg-gray-50 border-transparent hover:border-gray-200'
                    } border`}
                  onClick={() => onProjectSelect(project)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold truncate transition-colors ${currentProject?.id === project.id
                        ? theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
                        : theme === 'dark' ? 'text-white group-hover:text-indigo-300' : 'text-gray-900 group-hover:text-indigo-600'
                        }`}>
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs flex items-center gap-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {project.messages.length}
                        </span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}>•</span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {project.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-2 rounded-lg transition-all duration-200 ${theme === 'dark' ? 'hover:bg-red-500/20 text-gray-500 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
