import type { ResumeData, CoverLetterData } from '../types.js';

/**
 * Triggers a browser download for the given content.
 * @param content The string content to download.
 * @param fileName The name of the file to be saved.
 * @param contentType The MIME type of the content.
 */
const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
};

/**
 * Exports resume or cover letter data to a JSON file.
 * @param data The data to export.
 */
export const exportToJson = (data: ResumeData | CoverLetterData): void => {
    const jsonString = JSON.stringify(data, null, 2);
    const fileName = `${data.name.replace(/\s/g, '_') || 'export'}.json`;
    downloadFile(jsonString, fileName, 'application/json');
};


/**
 * A simple converter to generate a plain text representation of a resume.
 * @param data The resume data.
 * @returns A string in plain text format.
 */
const resumeToText = (data: ResumeData): string => {
    let text = `${data.personalDetails.fullName}\n`;
    text += `${data.personalDetails.jobTitle}\n`;
    text += `Contact: ${data.personalDetails.email} | ${data.personalDetails.phone} | ${data.personalDetails.linkedin} | ${data.personalDetails.website}\n\n`;
    
    text += `SUMMARY\n${data.summary}\n\n`;

    if (data.experience?.length > 0) {
        text += `EXPERIENCE\n\n`;
        data.experience.forEach(exp => {
            text += `${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n`;
            exp.responsibilities.forEach(resp => text += `  - ${resp}\n`);
            text += '\n';
        });
    }

    if (data.education?.length > 0) {
        text += `EDUCATION\n\n`;
        data.education.forEach(edu => {
            text += `${edu.degree} in ${edu.fieldOfStudy}, ${edu.institution} (${edu.startDate} - ${edu.endDate})\n`;
        });
        text += '\n';
    }

    if (data.skills?.length > 0) {
        text += `SKILLS\n${data.skills.map(s => s.name).join(', ')}\n`;
    }

    return text;
};

/**
 * A simple converter to generate a plain text representation of a cover letter.
 * @param data The cover letter data.
 * @returns A string in plain text format.
 */
const coverLetterToText = (data: CoverLetterData): string => {
    let text = `${data.personalDetails.fullName}\n\n`;
    text += `${data.date}\n\n`;
    text += `${data.recipientName}\n`;
    text += `${data.recipientCompany}\n\n`;
    text += `${data.body}\n`;
    return text;
};


/**
 * Exports resume or cover letter data to a plain text file.
 * @param data The data to export.
 * @param type The type of item ('resume' or 'coverLetter').
 */
export const exportToTxt = (data: ResumeData | CoverLetterData, type: 'resume' | 'coverLetter'): void => {
    const textContent = type === 'resume' ? resumeToText(data as ResumeData) : coverLetterToText(data as CoverLetterData);
    const fileName = `${data.name.replace(/\s/g, '_') || 'export'}.txt`;
    downloadFile(textContent, fileName, 'text/plain');
};
