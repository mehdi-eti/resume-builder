import React, { useState, useEffect, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Header, { type SaveStatus } from './Header.js';
import ResumeForm from './forms/ResumeForm.js';
import CoverLetterForm from './forms/CoverLetterForm.js';
import ResumePreview from './previews/ResumePreview.js';
import { getItemById, saveItem, getAllCustomTemplates } from '../services/db.js';
import { exportToPdf } from '../utils/pdfGenerator.js';
import type { ItemType, ResumeData, CoverLetterData, CustomTemplate } from '../types.js';
import { rephraseText, generateResponsibilities } from '../services/geminiService.js';


interface EditorProps {
    itemId: string;
    itemType: ItemType;
    onBack: () => void;
}

const Editor: React.FC<EditorProps> = ({ itemId, itemType, onBack }) => {
    const [data, setData] = useState<ResumeData | CoverLetterData | null>(null);
    const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const [itemData, templatesData] = await Promise.all([
                getItemById(itemId, itemType),
                getAllCustomTemplates(),
            ]);
            if (itemData) setData(itemData as ResumeData | CoverLetterData);
            setCustomTemplates(templatesData.filter(t => t.type === itemType));
        };
        loadData();
    }, [itemId, itemType]);

    const debouncedSave = useDebouncedCallback(async (updatedData: ResumeData | CoverLetterData) => {
        setSaveStatus('saving');
        await saveItem(updatedData, itemType);
        setSaveStatus('saved');
    }, 1000);

    const handleDataChange = (updatedData: Partial<ResumeData | CoverLetterData>) => {
        if (!data) return;
        const newData = { ...data, ...updatedData };
        setData(newData);
        setSaveStatus('unsaved');
        debouncedSave(newData);
    };
    
    const handleExportPdf = () => {
        if (data) {
            exportToPdf('preview-content', data.name || 'document');
        }
    };

    const handleAiRephrase = async (field: keyof ResumeData | keyof CoverLetterData, text: string, tone: string) => {
        if (!text) return;
        setIsGenerating(true);
        const rephrased = await rephraseText(text, tone);
        handleDataChange({ [field]: rephrased } as any);
        setIsGenerating(false);
    };

    const handleAiGenerateResponsibilities = async (experienceId: string, jobTitle: string, company: string, keywords: string) => {
        if (!data || itemType !== 'resume' || !jobTitle) return;
        setIsGenerating(true);
        const newResponsibilities = await generateResponsibilities(jobTitle, company, keywords);
        const resumeData = data as ResumeData;
        const updatedExperience = resumeData.experience.map(exp => {
            if (exp.id === experienceId) {
                // Filter out empty strings before adding new responsibilities
                const existingResponsibilities = exp.responsibilities.filter(r => r.trim() !== '');
                return { ...exp, responsibilities: [...existingResponsibilities, ...newResponsibilities] };
            }
            return exp;
        });
        handleDataChange({ experience: updatedExperience });
        setIsGenerating(false);
    };


    const formProps = useMemo(() => ({
        // FIX: Added type assertion to satisfy TypeScript.
        data: data as any,
        onChange: handleDataChange,
        customTemplates: customTemplates,
        onAiRephrase: handleAiRephrase,
        onAiGenerateResponsibilities: handleAiGenerateResponsibilities,
        isGenerating: isGenerating,
    }), [data, customTemplates, isGenerating, handleDataChange]);


    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold text-slate-700">Loading Editor...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <Header saveStatus={saveStatus}>
                <button
                    onClick={handleExportPdf}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Export as PDF
                </button>
                <button onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Back to Dashboard
                </button>
            </Header>
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                <div className="bg-white p-6 overflow-y-auto">
                    {itemType === 'resume' ? <ResumeForm {...formProps} /> : <CoverLetterForm {...formProps} />}
                </div>
                <div className="bg-slate-100 overflow-y-auto p-8">
                    <div id="preview-content" className="w-[210mm] min-h-[297mm] mx-auto bg-white">
                         <ResumePreview data={data} type={itemType} customTemplates={customTemplates} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
