import React, { useState, useEffect } from 'react';
import Header from './Header.js';
import { getCustomTemplateById, saveCustomTemplate } from '../services/db.js';
import type { CustomTemplate, ResumeData } from '../types.js';
import CustomTemplatePreview from './previews/CustomTemplatePreview.js';
import { defaultCoverLetterData } from '../utils/defaultData.js';

// A richer data object specifically for providing a good preview in the template editor
const sampleResumeForPreview: ResumeData = {
  id: 'preview-resume',
  name: 'Sample Resume',
  template: 'custom',
  // FIX: Added missing properties to satisfy the ResumeData type.
  accentColor: '#4f46e5', // A nice indigo for preview
  fontFamily: 'Inter',
  personalDetails: {
    fullName: 'Jane Doe',
    jobTitle: 'Lead Developer',
    email: 'jane.doe@email.com',
    phone: '555-123-4567',
    address: '456 Tech Ave, Webville',
    linkedin: 'linkedin.com/in/janedoe',
    website: 'janedoe.dev',
  },
  summary: 'Innovative and detail-oriented Lead Developer with over 10 years of experience in building and maintaining scalable web applications. Proficient in modern frontend and backend technologies.',
  experience: [{id: crypto.randomUUID(), jobTitle: 'Lead Developer', company: 'Innovate LLC', location: 'Tech City', startDate: '2018', endDate: 'Present', responsibilities: ['Led a team of 5 developers.', 'Architected new microservices architecture.']}],
  education: [{id: crypto.randomUUID(), institution: 'Major University', degree: 'M.S.', fieldOfStudy: 'Software Engineering', startDate: '2012', endDate: '2014'}],
  skills: [{id: crypto.randomUUID(), name: 'React'}, {id: crypto.randomUUID(), name: 'TypeScript'}, {id: crypto.randomUUID(), name: 'GraphQL'}],
  projects: [{id: crypto.randomUUID(), name: 'Project Titan', description: 'A large-scale data visualization tool.', link: 'project-titan.com', technologies: ['D3.js', 'React', 'Python']}],
  languages: [{id: crypto.randomUUID(), language: 'English', proficiency: 'Native'}, {id: crypto.randomUUID(), language: 'German', proficiency: 'Professional'}],
  supplementarySkills: [{id: crypto.randomUUID(), name: 'Agile Leadership'}, {id: crypto.randomUUID(), name: 'Public Speaking'}],
  courses: [{id: crypto.randomUUID(), name: 'Advanced Machine Learning', institution: 'Online Academy', date: '2021'}],
  awards: [{id: crypto.randomUUID(), name: 'Innovator of the Year', issuer: 'TechCon', date: '2022'}],
  academicExperience: [{id: crypto.randomUUID(), title: 'Research Assistant', institution: 'Major University', date: '2013', description: 'Assisted in research on distributed systems.'}],
  references: [{id: crypto.randomUUID(), name: 'Dr. Alan Grant', title: 'Professor', company: 'Major University', contactInfo: 'agrant@majoru.edu'}],
};

interface TemplateEditorProps {
  templateId: string | null;
  onBack: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ templateId, onBack }) => {
  const [template, setTemplate] = useState<CustomTemplate>({
    id: '',
    name: 'New Template',
    type: 'resume',
    html: '<div>Hello, {{ personalDetails.fullName }}</div>',
    css: 'div { color: blue; }',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDocs, setShowDocs] = useState(false);

  useEffect(() => {
    if (templateId) {
      getCustomTemplateById(templateId).then(data => {
        if (data) setTemplate(data);
      });
    } else {
      setTemplate(prev => ({ ...prev, id: crypto.randomUUID() }));
    }
  }, [templateId]);

  const handleSave = async () => {
    setIsSaving(true);
    await saveCustomTemplate(template);
    setTimeout(() => setIsSaving(false), 1000);
  };
  
  const handleChange = (field: keyof Omit<CustomTemplate, 'id'>, value: string) => {
    setTemplate(prev => ({...prev, [field]: value}));
  };

  const previewData = template.type === 'resume' ? sampleResumeForPreview : defaultCoverLetterData;

  const placeholders = template.type === 'resume'
    ? [
        { section: 'Personal Details', fields: ['fullName', 'jobTitle', 'email', 'phone', 'address', 'linkedin', 'website'].map(f => `personalDetails.${f}`) },
        { section: 'Summary', fields: ['summary'] },
        { section: 'Experience', loop: 'experience', fields: ['jobTitle', 'company', 'location', 'startDate', 'endDate', 'responsibilities'] },
        { section: 'Education', loop: 'education', fields: ['institution', 'degree', 'fieldOfStudy', 'startDate', 'endDate'] },
        { section: 'Skills', loop: 'skills', fields: ['name'] },
        { section: 'Projects', loop: 'projects', fields: ['name', 'description', 'link', 'technologies'] },
        { section: 'Languages', loop: 'languages', fields: ['language', 'proficiency'] },
        { section: 'Supplementary Skills', loop: 'supplementarySkills', fields: ['name'] },
        { section: 'Courses', loop: 'courses', fields: ['name', 'institution', 'date'] },
        { section: 'Awards', loop: 'awards', fields: ['name', 'issuer', 'date'] },
        { section: 'Academic Experience', loop: 'academicExperience', fields: ['title', 'institution', 'date', 'description'] },
        { section: 'References', loop: 'references', fields: ['name', 'title', 'company', 'contactInfo'] },
      ]
    : [
        { section: 'Personal Details', fields: ['fullName', 'jobTitle', 'email', 'phone', 'address', 'linkedin', 'website'].map(f => `personalDetails.${f}`) },
        { section: 'Recipient', fields: ['recipientName', 'recipientCompany', 'date'] },
        { section: 'Body', fields: ['body'] },
      ];

  return (
    <div className="flex flex-col h-screen">
      <Header>
        <button onClick={handleSave} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          {isSaving ? 'Saved!' : 'Save Template'}
        </button>
        <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
          Back to Dashboard
        </button>
      </Header>
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <div className="flex flex-col p-4 space-y-4 bg-white overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Template Name</label>
                    <input value={template.name} onChange={e => handleChange('name', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Template Type</label>
                    <select value={template.type} onChange={e => handleChange('type', e.target.value as 'resume' | 'coverLetter')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="resume">Resume</option>
                        <option value="coverLetter">Cover Letter</option>
                    </select>
                </div>
            </div>

            <div className="border rounded-md">
                <button onClick={() => setShowDocs(!showDocs)} className="w-full text-left p-2 bg-slate-100 hover:bg-slate-200 font-medium text-sm">
                    {showDocs ? 'Hide' : 'Show'} Available Placeholders
                </button>
                {showDocs && (
                    <div className="p-4 text-xs bg-slate-50 max-h-60 overflow-y-auto">
                        {placeholders.map(p => (
                            <div key={p.section} className="mb-2">
                                <h4 className="font-bold">{p.section}</h4>
                                {p.loop && <p className="font-mono text-indigo-700">{'{{#each '}{p.loop}{'}}...{{/each}}'}</p>}
                                <ul className="list-disc list-inside ml-4">
                                    {p.fields.map(field => <li key={field} className="font-mono text-indigo-700">{'{{'}{field}{'}}'}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex-grow flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">HTML</label>
                <textarea 
                    value={template.html} 
                    onChange={e => handleChange('html', e.target.value)} 
                    className="flex-grow font-mono text-sm p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Use {{...}} for placeholders, e.g. {{ personalDetails.fullName }}"
                    style={{ minHeight: '200px' }}
                />
            </div>
            <div className="flex-grow flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">CSS</label>
                <textarea 
                    value={template.css} 
                    onChange={e => handleChange('css', e.target.value)}
                    className="flex-grow font-mono text-sm p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="div { font-size: 16px; }"
                    style={{ minHeight: '200px' }}
                />
            </div>
        </div>
        <div className="bg-slate-100 overflow-y-auto p-8">
            <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg">
                <CustomTemplatePreview template={template} data={previewData} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
