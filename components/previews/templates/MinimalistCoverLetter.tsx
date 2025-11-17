
import React from 'react';
// FIX: Added .js extension to satisfy module resolution
import type { CoverLetterData } from '../../../types.js';

const MinimalistCoverLetter: React.FC<{ data: CoverLetterData }> = ({ data }) => {
  const { personalDetails, recipientName, recipientCompany, date, body } = data;
  return (
    <div className="bg-white p-12 font-sans text-sm text-gray-800 leading-relaxed shadow-lg">
      <div className="text-right mb-12">
        <h1 className="text-3xl font-bold">{personalDetails.fullName || "Your Name"}</h1>
        <p>{personalDetails.address}</p>
        <p>{personalDetails.phone} | {personalDetails.email}</p>
      </div>
      
      <div className="mb-8">
        <p>{date}</p>
        <br />
        <p>{recipientName || "Recipient Name"}</p>
        <p>{recipientCompany || "Recipient Company"}</p>
      </div>
      
      <div className="whitespace-pre-wrap">
        {body || "Your letter body here..."}
      </div>
      
      <div className="mt-8">
        <p>Sincerely,</p>
        <p className="mt-4">{personalDetails.fullName || "Your Name"}</p>
      </div>
    </div>
  );
};

export default MinimalistCoverLetter;