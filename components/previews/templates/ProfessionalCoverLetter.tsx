
import React from 'react';
// FIX: Added .js extension to satisfy module resolution
import type { CoverLetterData } from '../../../types.js';

const ProfessionalCoverLetter: React.FC<{ data: CoverLetterData }> = ({ data }) => {
  const { personalDetails, recipientName, recipientCompany, date, body } = data;
  return (
    <div className="bg-white p-12 font-serif text-base text-gray-900 leading-normal shadow-lg">
        <header className="border-b-4 border-blue-800 pb-4 mb-12">
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight">{personalDetails.fullName || "Your Name"}</h1>
            <p className="text-xl text-gray-700 mt-1">{personalDetails.jobTitle || "Your Title"}</p>
            <div className="flex justify-end space-x-6 text-sm mt-2 text-gray-600">
                <span>{personalDetails.email}</span>
                <span>{personalDetails.phone}</span>
                <span>{personalDetails.linkedin}</span>
            </div>
        </header>

        <div className="mb-10 text-sm">
            <p className="font-bold">{recipientName || "Hiring Manager"}</p>
            <p>{recipientCompany || "Company Name"}</p>
            <p className="mt-4">{date}</p>
        </div>

        <div className="whitespace-pre-wrap text-justify">
            {body || "Dear [Hiring Manager Name],\n\nI am writing to express my interest in the [Job Title] position advertised on [Platform].\n\n..."}
        </div>

        <div className="mt-10">
            <p>Best regards,</p>
            <p className="mt-6 font-bold">{personalDetails.fullName || "Your Name"}</p>
        </div>
    </div>
  );
};

export default ProfessionalCoverLetter;