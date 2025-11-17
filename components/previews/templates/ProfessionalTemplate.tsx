
import React from 'react';
import type { ResumeData } from '../../../types.js';

const SohoTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const {
    personalDetails,
    summary,
    experience,
    education,
    skills,
    projects,
  } = data;

  const fontClass = {
    Inter: 'font-sans',
    Lato: 'font-sans',
    Roboto: 'font-sans',
    Garamond: 'font-serif',
  }[data.fontFamily || 'Inter'];

  return (
    <div className={`bg-white text-gray-900 p-10 ${fontClass}`} style={{'--accent-color': data.accentColor} as React.CSSProperties}>
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-widest">{personalDetails.fullName}</h1>
        <div className="flex justify-center flex-wrap gap-x-3 text-xs mt-2 border-t border-b py-1 border-gray-300">
          <span>{personalDetails.address}</span>
          <span>&bull;</span>
          <span>{personalDetails.phone}</span>
          <span>&bull;</span>
          <span>{personalDetails.email}</span>
        </div>
      </header>

      <main>
        <Section title="Professional Profile">
          <p className="text-sm leading-relaxed">{summary}</p>
        </Section>
        
        <Section title="Work Experience">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-bold">{exp.jobTitle}, <span className="font-normal italic">{exp.company}</span></h3>
                <span className="text-sm font-light">{exp.startDate} - {exp.endDate}</span>
              </div>
              <ul className="list-disc list-inside text-sm mt-1 pl-4">
                {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-md font-bold">{edu.institution}</h3>
                <span className="text-sm font-light">{edu.startDate} - {edu.endDate}</span>
              </div>
              <p className="text-sm italic">{edu.degree}, {edu.fieldOfStudy}</p>
            </div>
          ))}
        </Section>

        <div className="grid grid-cols-2 gap-x-8">
            <Section title="Skills">
                <p className="text-sm">{skills.map(s => s.name).join(' • ')}</p>
            </Section>
             <Section title="Projects">
              {projects.map((proj) => (
                <div key={proj.id} className="mb-2">
                    <h3 className="text-md font-bold">{proj.name}</h3>
                    <p className="text-sm">{proj.description}</p>
                </div>
              ))}
            </Section>
        </div>

      </main>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-lg font-bold uppercase tracking-wider border-b-2 border-gray-300 pb-1 mb-2">{title}</h2>
    {children}
  </div>
);

export default SohoTemplate;
