
import React from 'react';
// FIX: Added .js extension to satisfy module resolution
import type { CoverLetterData, CustomTemplate } from '../../types.js';

interface CoverLetterFormProps {
  data: CoverLetterData;
  onChange: (updatedData: Partial<CoverLetterData>) => void;
  customTemplates: CustomTemplate[];
}

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea {...props} rows={15} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6">
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const CoverLetterForm: React.FC<CoverLetterFormProps> = ({ data, onChange, customTemplates }) => {
  const handleFieldChange = <T extends keyof CoverLetterData,>(field: T, value: CoverLetterData[T]) => {
    onChange({ [field]: value });
  };
  
  const handleNestedFieldChange = <K extends 'personalDetails'>(
    parent: K,
    field: keyof CoverLetterData[K],
    value: any
  ) => {
    onChange({ [parent]: { ...(data[parent] as object), [field]: value } });
  };

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Cover Letter Name" value={data.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
            <div>
                <label className="block text-sm font-medium text-gray-700">Template</label>
                <select value={data.template} onChange={(e) => handleFieldChange('template', e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                     <optgroup label="Standard Templates">
                        <option value="minimalist">Minimalist</option>
                        <option value="professional">Professional</option>
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
        </div>

        <Section title="Recipient & Date">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Recipient Name" value={data.recipientName} onChange={(e) => handleFieldChange('recipientName', e.target.value)} />
                <Input label="Recipient Company" value={data.recipientCompany} onChange={(e) => handleFieldChange('recipientCompany', e.target.value)} />
                <Input label="Date" type="date" value={data.date} onChange={(e) => handleFieldChange('date', e.target.value)} />
            </div>
        </Section>
        
        <Section title="Your Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" value={data.personalDetails.fullName} onChange={(e) => handleNestedFieldChange('personalDetails', 'fullName', e.target.value)} />
                <Input label="Job Title" value={data.personalDetails.jobTitle} onChange={(e) => handleNestedFieldChange('personalDetails', 'jobTitle', e.target.value)} />
                <Input label="Email" type="email" value={data.personalDetails.email} onChange={(e) => handleNestedFieldChange('personalDetails', 'email', e.target.value)} />
                <Input label="Phone" type="tel" value={data.personalDetails.phone} onChange={(e) => handleNestedFieldChange('personalDetails', 'phone', e.target.value)} />
                <Input label="Address" value={data.personalDetails.address} onChange={(e) => handleNestedFieldChange('personalDetails', 'address', e.target.value)} />
                <Input label="LinkedIn" value={data.personalDetails.linkedin} onChange={(e) => handleNestedFieldChange('personalDetails', 'linkedin', e.target.value)} />
                <Input label="Website" value={data.personalDetails.website} onChange={(e) => handleNestedFieldChange('personalDetails', 'website', e.target.value)} />
            </div>
        </Section>
        
        <Section title="Letter Body">
            <Textarea label="Body" value={data.body} onChange={(e) => handleFieldChange('body', e.target.value)} placeholder="Dear [Recipient Name],..." />
        </Section>
    </form>
  );
};

export default CoverLetterForm;