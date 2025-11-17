
import React, { useMemo } from 'react';
// FIX: Added .js extension to satisfy module resolution
import type { CustomTemplate, ResumeData, CoverLetterData } from '../../types.js';
import { parseTemplate } from '../../utils/templateParser.js';

interface CustomTemplatePreviewProps {
    template: CustomTemplate;
    data: ResumeData | CoverLetterData;
}

const CustomTemplatePreview: React.FC<CustomTemplatePreviewProps> = ({ template, data }) => {
    const parsedHtml = useMemo(() => {
        return parseTemplate(template.html, data);
    }, [template.html, data]);

    return (
        <>
            <style>{template.css}</style>
            <div dangerouslySetInnerHTML={{ __html: parsedHtml }} />
        </>
    );
};

export default CustomTemplatePreview;