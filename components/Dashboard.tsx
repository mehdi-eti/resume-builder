import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header.js';
import {
  getAllResumes,
  getAllCoverLetters,
  getAllCustomTemplates,
  saveResume,
  saveCoverLetter,
  deleteResume,
  deleteCoverLetter,
  deleteCustomTemplate,
} from '../services/db.js';
import type { ResumeData, CoverLetterData, CustomTemplate, ItemType } from '../types.js';
import { defaultResumeData, defaultCoverLetterData } from '../utils/defaultData.js';

interface DashboardProps {
  onEditItem: (id: string, type: ItemType) => void;
  onEditTemplate: (id: string) => void;
  onCreateTemplate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onEditItem, onEditTemplate, onCreateTemplate }) => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);

  const loadData = useCallback(async () => {
    const [resumesData, coverLettersData, templatesData] = await Promise.all([
      getAllResumes(),
      getAllCoverLetters(),
      getAllCustomTemplates(),
    ]);
    setResumes(resumesData);
    setCoverLetters(coverLettersData);
    setCustomTemplates(templatesData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateNew = async (type: ItemType) => {
    const id = crypto.randomUUID();
    if (type === 'resume') {
      const newResume: ResumeData = { ...defaultResumeData, id, name: `New Resume ${resumes.length + 1}` };
      await saveResume(newResume);
    } else {
      const newCoverLetter: CoverLetterData = { ...defaultCoverLetterData, id, name: `New Cover Letter ${coverLetters.length + 1}` };
      await saveCoverLetter(newCoverLetter);
    }
    await loadData();
    onEditItem(id, type);
  };
  
  const handleDelete = async (id: string, type: ItemType | 'template') => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    if (type === 'resume') await deleteResume(id);
    else if (type === 'coverLetter') await deleteCoverLetter(id);
    else if (type === 'template') await deleteCustomTemplate(id);

    await loadData();
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Section title="Resumes" onCreate={() => handleCreateNew('resume')}>
            <ItemList items={resumes} onEdit={(id) => onEditItem(id, 'resume')} onDelete={(id) => handleDelete(id, 'resume')} />
          </Section>

          <Section title="Cover Letters" onCreate={() => handleCreateNew('coverLetter')}>
            <ItemList items={coverLetters} onEdit={(id) => onEditItem(id, 'coverLetter')} onDelete={(id) => handleDelete(id, 'coverLetter')} />
          </Section>

          <Section title="Custom Templates" onCreate={onCreateTemplate}>
            <TemplateList items={customTemplates} onEdit={onEditTemplate} onDelete={(id) => handleDelete(id, 'template')} />
          </Section>
        </div>
      </main>
    </>
  );
};

const Section: React.FC<{ title: string; onCreate: () => void; children: React.ReactNode }> = ({ title, onCreate, children }) => (
  <div className="mb-12">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
      <button onClick={onCreate} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
        Create New
      </button>
    </div>
    <div className="bg-white shadow-md rounded-lg p-6">
      {children}
    </div>
  </div>
);

interface Item { id: string, name: string }

const ItemList: React.FC<{ items: Item[]; onEdit: (id: string) => void; onDelete: (id: string) => void; }> = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) return <p className="text-slate-500">No items yet.</p>;
  return (
    <ul className="divide-y divide-gray-200">
      {items.map(item => (
        <li key={item.id} className="py-4 flex justify-between items-center">
          <span className="text-lg font-medium text-slate-900">{item.name}</span>
          <div className="space-x-4">
            <button onClick={() => onEdit(item.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
            <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

const TemplateList: React.FC<{ items: CustomTemplate[]; onEdit: (id: string) => void; onDelete: (id: string) => void; }> = ({ items, onEdit, onDelete }) => {
  if (items.length === 0) return <p className="text-slate-500">No custom templates yet.</p>;
  return (
    <ul className="divide-y divide-gray-200">
      {items.map(item => (
        <li key={item.id} className="py-4 flex justify-between items-center">
          <div>
            <span className="text-lg font-medium text-slate-900">{item.name}</span>
            <span className="ml-4 text-sm bg-slate-200 text-slate-700 px-2 py-1 rounded-full">{item.type}</span>
          </div>
          <div className="space-x-4">
            <button onClick={() => onEdit(item.id)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
            <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};


export default Dashboard;