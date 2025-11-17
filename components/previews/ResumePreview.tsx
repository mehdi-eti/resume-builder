
import React from 'react';
import type { ResumeData, CoverLetterData, ItemType, CustomTemplate } from '../../types.js';
import ModernTemplate from './templates/MinimalistTemplate.js';
import SohoTemplate from './templates/ProfessionalTemplate.js';
import TehranTemplate from './templates/TehranTemplate.js';
import ClassicTemplate from './templates/ClassicTemplate.js';
import MinimalistCoverLetter from './templates/MinimalistCoverLetter.js';
import ProfessionalCoverLetter from './templates/ProfessionalCoverLetter.js';
import CustomTemplatePreview from './CustomTemplatePreview.js';

interface ResumePreviewProps {
    data: ResumeData | CoverLetterData;
    type: ItemType;
    customTemplates: CustomTemplate[];
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, type, customTemplates }) => {
    if (type === 'resume') {
        const resumeData = data as ResumeData;
        switch (resumeData.template) {
            case 'modern':
                return <ModernTemplate data={resumeData} />;
            case 'soho':
                return <SohoTemplate data={resumeData} />;
            case 'tehran':
                return <TehranTemplate data={resumeData} />;
            case 'classic':
                return <ClassicTemplate data={resumeData} />;
            default:
                const customTemplate = customTemplates.find(t => t.id === resumeData.template);
                if (customTemplate) {
                    return <CustomTemplatePreview template={customTemplate} data={resumeData} />;
                }
                return <div>Template not found</div>;
        }
    }

    if (type === 'coverLetter') {
        const coverLetterData = data as CoverLetterData;
        switch (coverLetterData.template) {
            case 'minimalist':
                return <MinimalistCoverLetter data={coverLetterData} />;
            case 'professional':
                return <ProfessionalCoverLetter data={coverLetterData} />;
            default:
                const customTemplate = customTemplates.find(t => t.id === coverLetterData.template);
                if (customTemplate) {
                    return <CustomTemplatePreview template={customTemplate} data={coverLetterData} />;
                }
                return <div>Template not found</div>;
        }
    }

    return null;
};

export default ResumePreview;