
import React from 'react';
import type { ResumeData } from '../../../types.js';

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const {
    personalDetails,
    summary,
    experience,
    education,
    skills,
    projects,
    languages,
  } = data;

  const fontClass = {
    Inter: 'font-sans', // Assuming Inter maps to a generic sans-serif
    Lato: 'font-sans', // Assuming Lato maps to a generic sans-serif
    Roboto: 'font-sans', // Assuming Roboto maps to a generic sans-serif
    Garamond: 'font-serif', // Assuming Garamond maps to a generic serif
  }[data.fontFamily || 'Inter'];

  return (
    <div className={`bg-white text-gray-800 p-8 ${fontClass}`} style={{'--accent-color': data.accentColor} as React.CSSProperties}>
      <header className="text-center mb-8 border-b-2 pb-4" style={{borderColor: data.accentColor}}>
        <h1 className="text-4xl font-bold tracking-tight">{personalDetails.fullName}</h1>
        <p className="text-lg font-medium" style={{color: data.accentColor}}>{personalDetails.jobTitle}</p>
        <div className="flex justify-center flex-wrap gap-x-4 text-xs mt-2">
          <span>{personalDetails.email}</span>
          <span>{personalDetails.phone}</span>
          <span>{personalDetails.website}</span>
          <span>{personalDetails.linkedin}</span>
        </div>
      </header>

      <main className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <Section title="Summary">
            <p className="text-sm">{summary}</p>
          </Section>

          <Section title="Experience">
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <h3 className="font-bold text-md">{exp.jobTitle}</h3>
                <div className="flex justify-between text-sm italic">
                  <span>{exp.company}, {exp.location}</span>
                  <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-sm mt-1">
                  {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                </ul>
              </div>
            ))}
          </Section>

          <Section title="Projects">
            {projects.map((proj) => (
              <div key={proj.id} className="mb-4">
                <h3 className="font-bold text-md">{proj.name}</h3>
                <p className="text-sm">{proj.description}</p>
                <p className="text-xs italic">{proj.technologies.join(', ')}</p>
              </div>
            ))}
          </Section>
        </div>

        <div className="col-span-1">
          <Section title="Education">
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold text-md">{edu.institution}</h3>
                <p className="text-sm">{edu.degree}, {edu.fieldOfStudy}</p>
                <p className="text-xs italic">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </Section>

          <Section title="Skills">
            <ul className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <li key={skill.id} className="bg-gray-200 text-sm px-2 py-1 rounded">
                  {skill.name}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Languages">
            {languages.map((lang) => (
              <p key={lang.id} className="text-sm">
                <span className="font-semibold">{lang.language}:</span> {lang.proficiency}
              </p>
            ))}
          </Section>
        </div>
      </main>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold border-b-2 mb-2" style={{borderColor: 'var(--accent-color)'}}>{title}</h2>
    {children}
  </div>
);

export default ModernTemplate;
