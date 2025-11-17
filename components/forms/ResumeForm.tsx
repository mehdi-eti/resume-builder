import React, { useState, useRef, DragEvent, FC } from 'react';
import type { ResumeData, Experience, Education, Project, Skill, LanguageProficiency, Course, Award, AcademicExperience, Reference } from '../../types.js';
import { rephraseText, generateResponsibilities } from '../../services/geminiService.js';
import { defaultResumeData } from '../../utils/defaultData.js';

// A curated list of common skills for auto-completion
const commonSkills = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C#', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL',
  'HTML5', 'CSS3', 'Sass', 'Tailwind CSS', 'GraphQL', 'REST APIs', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud',
  'CI/CD', 'Git', 'Agile Methodologies', 'Scrum', 'JIRA', 'Project Management', 'Product Management', 'UI/UX Design',
  'Figma', 'Adobe XD', 'Data Analysis', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Communication', 'Teamwork',
  'Leadership', 'Problem Solving', 'Critical Thinking', 'Adaptability', 'Creativity'
];

// A curated list of common technologies for auto-completion
const commonTechnologies = [
    ...commonSkills, 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'NestJS', 'Express.js', 'Django', 'Flask', 'Ruby on Rails',
    'PHP', 'Laravel', 'Go', 'Rust', 'Swift', 'Kotlin', 'MySQL', 'Oracle', 'Redis', 'Webpack', 'Vite', 'Jest',
    'Cypress', 'Storybook', 'Jenkins', 'GitHub Actions', 'Terraform', 'Ansible'
];


interface ResumeFormProps {
  data: ResumeData;
  onChange: (updatedData: Partial<ResumeData>) => void;
  customTemplates: any[];
  onAiRephrase: (field: keyof ResumeData, text: string, tone: string) => Promise<void>;
  onAiGenerateResponsibilities: (experienceId: string, jobTitle: string, company: string, keywords: string) => Promise<void>;
  isGenerating: boolean;
}

// --- Reusable UI Components ---

const Input: FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);

const Textarea: FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);

const Section: FC<{ title: string; icon: React.ReactNode; isOpen: boolean; onToggle: () => void; children: React.ReactNode }> = ({ title, icon, isOpen, onToggle, children }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center">
                <div className="text-indigo-600 mr-3">{icon}</div>
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
            </div>
            <svg className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </button>
        {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
    </div>
);

const AiButton: FC<{ onClick: () => void, isGenerating: boolean, className?: string }> = ({ onClick, isGenerating, className }) => (
    <button type="button" onClick={onClick} disabled={isGenerating} className={`text-xs inline-flex items-center px-2.5 py-1.5 border border-transparent font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
        {isGenerating ? 'Generating...' : <>✨ Smart Rewrite</>}
    </button>
);

// --- Main Form Component ---

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange, customTemplates, onAiRephrase, onAiGenerateResponsibilities, isGenerating }) => {
    const [openSection, setOpenSection] = useState<string | null>('personalDetails');
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleToggleSection = (section: string) => {
        setOpenSection(prev => (prev === section ? null : section));
    };

    const handleFieldChange = <T extends keyof ResumeData>(field: T, value: ResumeData[T]) => {
        onChange({ [field]: value });
    };

    const handleNestedFieldChange = <K extends keyof ResumeData, F extends keyof ResumeData[K]>(
        parent: K,
        field: F,
        value: ResumeData[K][F]
    ) => {
        onChange({ [parent]: { ...(data[parent] as object), [field]: value } });
    };

    const handleDynamicListChange = <K extends keyof ResumeData, F extends keyof (ResumeData[K] & {} extends (infer U)[] ? U : never)>(
        listName: K,
        index: number,
        field: F,
        value: any
    ) => {
        const list = (data[listName] as any[]).map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        onChange({ [listName]: list } as Partial<ResumeData>);
    };

    const addDynamicListItem = <K extends keyof ResumeData>(listName: K, newItem: any) => {
        const list = [...(data[listName] as any[]), { ...newItem, id: crypto.randomUUID() }];
        onChange({ [listName]: list } as Partial<ResumeData>);
    };

    const removeDynamicListItem = <K extends keyof ResumeData>(listName: K, index: number) => {
        const list = (data[listName] as any[]).filter((_, i) => i !== index);
        onChange({ [listName]: list } as Partial<ResumeData>);
    };
    
    const handleDragSort = <K extends keyof ResumeData>(listName: K) => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const list = [...(data[listName] as any[])];
        const draggedItemContent = list.splice(dragItem.current, 1)[0];
        list.splice(dragOverItem.current, 0, draggedItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        onChange({ [listName]: list } as Partial<ResumeData>);
    };

    return (
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            {/* --- STYLING --- */}
            <Section title="Styling" icon={<IconPalette />} isOpen={openSection === 'styling'} onToggle={() => handleToggleSection('styling')}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input label="Resume Name" value={data.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Template</label>
                    <select value={data.template} onChange={(e) => handleFieldChange('template', e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <optgroup label="Standard Templates">
                            <option value="modern">Modern</option>
                            <option value="soho">Soho</option>
                            <option value="tehran">Tehran</option>
                            <option value="classic">Classic</option>
                        </optgroup>
                        {customTemplates.length > 0 && (
                            <optgroup label="Your Templates">
                                {customTemplates.map(template => (
                                    <option key={template.id} value={template.id}>{template.name}</option>
                                ))}
                            </optgroup>
                        )}
                    </select>
                </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Accent Color</label>
                        <input type="color" value={data.accentColor} onChange={e => handleFieldChange('accentColor', e.target.value)} className="mt-1 block w-full h-10 px-1 py-1 border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Font Family</label>
                        <select value={data.fontFamily} onChange={e => handleFieldChange('fontFamily', e.target.value as ResumeData['fontFamily'])} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                             <option value="Inter">Inter</option>
                            <option value="Lato">Lato</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Garamond">Garamond</option>
                        </select>
                    </div>
                 </div>
            </Section>

            {/* --- PERSONAL DETAILS --- */}
            <Section title="Personal Details" icon={<IconUser />} isOpen={openSection === 'personalDetails'} onToggle={() => handleToggleSection('personalDetails')}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" value={data.personalDetails.fullName} onChange={e => handleNestedFieldChange('personalDetails', 'fullName', e.target.value)} />
                    <Input label="Job Title" value={data.personalDetails.jobTitle} onChange={e => handleNestedFieldChange('personalDetails', 'jobTitle', e.target.value)} />
                    <Input label="Email" type="email" value={data.personalDetails.email} onChange={e => handleNestedFieldChange('personalDetails', 'email', e.target.value)} />
                    <Input label="Phone" type="tel" value={data.personalDetails.phone} onChange={e => handleNestedFieldChange('personalDetails', 'phone', e.target.value)} />
                    <Input label="Address" value={data.personalDetails.address} onChange={e => handleNestedFieldChange('personalDetails', 'address', e.target.value)} />
                    <Input label="LinkedIn" value={data.personalDetails.linkedin} onChange={e => handleNestedFieldChange('personalDetails', 'linkedin', e.target.value)} />
                    <Input label="Website" value={data.personalDetails.website} onChange={e => handleNestedFieldChange('personalDetails', 'website', e.target.value)} />
                </div>
            </Section>

            {/* --- SUMMARY --- */}
            <Section title="Summary" icon={<IconDocumentText />} isOpen={openSection === 'summary'} onToggle={() => handleToggleSection('summary')}>
                <Textarea label="Professional Summary" rows={5} value={data.summary} onChange={e => handleFieldChange('summary', e.target.value)} />
                 <div className="mt-2 text-right">
                    <AiButton isGenerating={isGenerating} onClick={() => onAiRephrase('summary', data.summary, 'more professional and impactful')} />
                </div>
            </Section>

            {/* --- EXPERIENCE --- */}
            <Section title="Experience" icon={<IconBriefcase />} isOpen={openSection === 'experience'} onToggle={() => handleToggleSection('experience')}>
                <div className="space-y-4">
                    {data.experience.map((exp, index) => (
                        <ListItemCard
                            key={exp.id}
                            title={exp.jobTitle || 'New Position'}
                            subtitle={exp.company}
                            onDelete={() => removeDynamicListItem('experience', index)}
                            draggableProps={{
                                draggable: true,
                                onDragStart: () => dragItem.current = index,
                                onDragEnter: () => dragOverItem.current = index,
                                onDragEnd: () => handleDragSort('experience'),
                                onDragOver: (e) => e.preventDefault(),
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Job Title" value={exp.jobTitle} onChange={e => handleDynamicListChange('experience', index, 'jobTitle', e.target.value)} />
                                <Input label="Company" value={exp.company} onChange={e => handleDynamicListChange('experience', index, 'company', e.target.value)} />
                                <Input label="Location" value={exp.location} onChange={e => handleDynamicListChange('experience', index, 'location', e.target.value)} />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input label="Start Date" type="date" value={exp.startDate} onChange={e => handleDynamicListChange('experience', index, 'startDate', e.target.value)} />
                                    <Input label="End Date" type="date" value={exp.endDate} onChange={e => handleDynamicListChange('experience', index, 'endDate', e.target.value)} />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                                {exp.responsibilities.map((resp, respIndex) => (
                                    <div key={respIndex} className="flex items-center mt-1">
                                        <input value={resp} onChange={e => {
                                            const newResps = [...exp.responsibilities];
                                            newResps[respIndex] = e.target.value;
                                            handleDynamicListChange('experience', index, 'responsibilities', newResps);
                                        }} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                                        <button onClick={() => {
                                            const newResps = exp.responsibilities.filter((_, i) => i !== respIndex);
                                            handleDynamicListChange('experience', index, 'responsibilities', newResps);
                                        }} className="ml-2 text-gray-400 hover:text-red-600"><IconTrash size={16}/></button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => handleDynamicListChange('experience', index, 'responsibilities', [...exp.responsibilities, ''])} className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">+ Add Responsibility</button>
                                <div className="mt-2 text-right">
                                    <button type="button" onClick={() => onAiGenerateResponsibilities(exp.id, exp.jobTitle, exp.company, '')} disabled={isGenerating} className="text-xs inline-flex items-center px-2.5 py-1.5 border border-transparent font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 disabled:opacity-50">
                                        {isGenerating ? 'Generating...' : <>✨ Generate with AI</>}
                                    </button>
                                </div>
                            </div>
                        </ListItemCard>
                    ))}
                    <button type="button" onClick={() => addDynamicListItem('experience', defaultResumeData.experience[0])} className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <IconPlus /> Add Experience
                    </button>
                </div>
            </Section>
            
            {/* --- EDUCATION --- */}
            <Section title="Education" icon={<IconAcademicCap />} isOpen={openSection === 'education'} onToggle={() => handleToggleSection('education')}>
                 <div className="space-y-4">
                    {data.education.map((edu, index) => (
                        <ListItemCard
                            key={edu.id}
                            title={edu.institution || 'New Institution'}
                            subtitle={edu.degree}
                            onDelete={() => removeDynamicListItem('education', index)}
                             draggableProps={{
                                draggable: true,
                                onDragStart: () => dragItem.current = index,
                                onDragEnter: () => dragOverItem.current = index,
                                onDragEnd: () => handleDragSort('education'),
                                onDragOver: (e) => e.preventDefault(),
                            }}
                        >
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <Input label="Institution" value={edu.institution} onChange={e => handleDynamicListChange('education', index, 'institution', e.target.value)} />
                               <Input label="Degree" value={edu.degree} onChange={e => handleDynamicListChange('education', index, 'degree', e.target.value)} />
                               <Input label="Field of Study" value={edu.fieldOfStudy} onChange={e => handleDynamicListChange('education', index, 'fieldOfStudy', e.target.value)} />
                               <div className="grid grid-cols-2 gap-2">
                                   <Input label="Start Date" type="date" value={edu.startDate} onChange={e => handleDynamicListChange('education', index, 'startDate', e.target.value)} />
                                   <Input label="End Date" type="date" value={edu.endDate} onChange={e => handleDynamicListChange('education', index, 'endDate', e.target.value)} />
                               </div>
                           </div>
                        </ListItemCard>
                    ))}
                    <button type="button" onClick={() => addDynamicListItem('education', defaultResumeData.education[0])} className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <IconPlus /> Add Education
                    </button>
                </div>
            </Section>

            {/* --- PROJECTS --- */}
            <Section title="Projects" icon={<IconCode />} isOpen={openSection === 'projects'} onToggle={() => handleToggleSection('projects')}>
                 <div className="space-y-4">
                    {data.projects.map((proj, index) => (
                        <ListItemCard
                            key={proj.id}
                            title={proj.name || 'New Project'}
                            onDelete={() => removeDynamicListItem('projects', index)}
                            draggableProps={{
                                draggable: true,
                                onDragStart: () => dragItem.current = index,
                                onDragEnter: () => dragOverItem.current = index,
                                onDragEnd: () => handleDragSort('projects'),
                                onDragOver: (e) => e.preventDefault(),
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Project Name" value={proj.name} onChange={e => handleDynamicListChange('projects', index, 'name', e.target.value)} />
                                <Input label="Link" value={proj.link} onChange={e => handleDynamicListChange('projects', index, 'link', e.target.value)} />
                            </div>
                            <div className="mt-4">
                                <Textarea label="Description" rows={3} value={proj.description} onChange={e => handleDynamicListChange('projects', index, 'description', e.target.value)} />
                            </div>
                            <div className="mt-4">
                                <TagInput
                                    label="Technologies Used"
                                    tags={proj.technologies}
                                    suggestions={commonTechnologies}
                                    onTagsChange={newTags => handleDynamicListChange('projects', index, 'technologies', newTags)}
                                />
                            </div>
                        </ListItemCard>
                    ))}
                    <button type="button" onClick={() => addDynamicListItem('projects', { name: '', description: '', link: '', technologies: [] })} className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <IconPlus /> Add Project
                    </button>
                </div>
            </Section>

            {/* --- SKILLS --- */}
            <Section title="Skills" icon={<IconSparkles />} isOpen={openSection === 'skills'} onToggle={() => handleToggleSection('skills')}>
                <TagInput
                    label="Primary Skills"
                    tags={data.skills.map(s => s.name)}
                    suggestions={commonSkills}
                    onTagsChange={newTags => handleFieldChange('skills', newTags.map(name => ({ id: crypto.randomUUID(), name })))}
                />
                 <div className="mt-4">
                    <TagInput
                        label="Supplementary Skills"
                        tags={data.supplementarySkills.map(s => s.name)}
                        suggestions={commonSkills}
                        onTagsChange={newTags => handleFieldChange('supplementarySkills', newTags.map(name => ({ id: crypto.randomUUID(), name })))}
                    />
                </div>
            </Section>
            
             {/* --- LANGUAGES --- */}
            <Section title="Languages" icon={<IconTranslate />} isOpen={openSection === 'languages'} onToggle={() => handleToggleSection('languages')}>
                <div className="space-y-4">
                    {data.languages.map((lang, index) => (
                         <ListItemCard
                            key={lang.id}
                            title={lang.language || 'New Language'}
                            onDelete={() => removeDynamicListItem('languages', index)}
                            draggableProps={{
                                draggable: true,
                                onDragStart: () => dragItem.current = index,
                                onDragEnter: () => dragOverItem.current = index,
                                onDragEnd: () => handleDragSort('languages'),
                                onDragOver: (e) => e.preventDefault(),
                            }}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Language" value={lang.language} onChange={e => handleDynamicListChange('languages', index, 'language', e.target.value)} />
                                <Input label="Proficiency" value={lang.proficiency} onChange={e => handleDynamicListChange('languages', index, 'proficiency', e.target.value)} placeholder="e.g., Native, Fluent" />
                            </div>
                        </ListItemCard>
                    ))}
                    <button type="button" onClick={() => addDynamicListItem('languages', { language: '', proficiency: '' })} className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50">
                        <IconPlus /> Add Language
                    </button>
                </div>
            </Section>

        </form>
    );
};

// --- Helper Components for ResumeForm ---

const ListItemCard: FC<{title: string; subtitle?: string; onDelete: () => void; children: React.ReactNode; draggableProps: any}> = ({ title, subtitle, onDelete, children, draggableProps }) => (
    <div className="border border-gray-200 rounded-lg bg-slate-50 cursor-grab" {...draggableProps}>
        <div className="flex items-center justify-between p-3 bg-slate-100 border-b">
            <div>
                <h4 className="font-semibold text-gray-800">{title}</h4>
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
            </div>
            <button onClick={onDelete} className="text-gray-400 hover:text-red-600"><IconTrash size={18} /></button>
        </div>
        <div className="p-4">{children}</div>
    </div>
);

const TagInput: FC<{ label: string, tags: string[], onTagsChange: (newTags: string[]) => void, suggestions: string[] }> = ({ label, tags, onTagsChange, suggestions }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (value) {
            setFilteredSuggestions(
                suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()) && !tags.includes(s)).slice(0, 5)
            );
        } else {
            setFilteredSuggestions([]);
        }
    };

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            onTagsChange([...tags, trimmedTag]);
        }
        setInputValue('');
        setFilteredSuggestions([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md">
                {tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-700">
                            &times;
                        </button>
                    </span>
                ))}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="w-full focus:outline-none sm:text-sm bg-transparent"
                        placeholder="Add a skill..."
                    />
                    {filteredSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            {filteredSuggestions.map(suggestion => (
                                <div
                                    key={suggestion}
                                    onClick={() => addTag(suggestion)}
                                    className="px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- SVG Icons ---
const IconUser: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconDocumentText: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconBriefcase: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconAcademicCap: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v-5.5a2 2 0 012-2h.5a2 2 0 012 2v5.5M12 14l-9-5 9 5 9-5-9 5zm0 0v5.5a2 2 0 002 2h.5a2 2 0 002-2V14" /></svg>;
const IconCode: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const IconSparkles: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const IconTranslate: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13l4-8-4-8M1 15h16M17 13l4 8 4-8M5 21v-2m4 2v-2m4 2v-2M1 7h12M1 11h12M1 15h12" transform="translate(1, -1)"/></svg>;
const IconPalette: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
const IconTrash: FC<{size?: number}> = ({size = 24}) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-${size/4} w-${size/4}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconPlus: FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;

export default ResumeForm;