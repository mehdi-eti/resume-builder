
import React from 'react';
import type { ResumeData } from '../../../types.js';

const TehranTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const {
    personalDetails,
    summary,
    experience,
    education,
    skills,
    languages,
  } = data;

  const fontClass = {
    Inter: 'font-sans',
    Lato: 'font-sans',
    Roboto: 'font-sans',
    Garamond: 'font-serif',
  }[data.fontFamily || 'Inter'];

  return (
    <div className={`bg-white text-gray-800 p-8 ${fontClass}`} style={{'--accent-color': data.accentColor} as React.CSSProperties}>
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extralight tracking-wider uppercase">{personalDetails.fullName}</h1>
        <p className="text-xl font-light" style={{color: 'var(--accent-color)'}}>{personalDetails.jobTitle}</p>
      </header>
      
      <div className="border-t-2" style={{borderColor: 'var(--accent-color)'}}></div>

      <div className="grid grid-cols-12 gap-x-8 mt-6">
        <aside className="col-span-4">
          <Section title="Contact">
            <p>{personalDetails.phone}</p>
            <p>{personalDetails.email}</p>
            <p>{personalDetails.address}</p>
            <p>{personalDetails.website}</p>
            <p>{personalDetails.linkedin}</p>
          </Section>

          <Section title="Education">
            {education.map(edu => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-semibold">{edu.institution}</h3>
                <p className="text-sm">{edu.degree}, {edu.fieldOfStudy}</p>
                <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </Section>

          <Section title="Skills">
            <ul className="list-disc list-inside text-sm">
              {skills.map(skill => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </Section>
          
          <Section title="Languages">
             {languages.map(lang => (
              <p key={lang.id} className="text-sm">
                <span className="font-semibold">{lang.language}:</span> {lang.proficiency}
              </p>
            ))}
          </Section>
        </aside>

        <main className="col-span-8">
          <Section title="Profile">
            <p className="text-sm leading-relaxed">{summary}</p>
          </Section>
          
          <Section title="Experience">
            {experience.map(exp => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-semibold">{exp.jobTitle}</h3>
                  <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                </div>
                <p className="text-md italic text-gray-700">{exp.company}, {exp.location}</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        </main>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6 text-sm">
    <h2 className="text-lg font-bold uppercase tracking-widest mb-3 pb-1 border-b" style={{borderColor: 'var(--accent-color)'}}>{title}</h2>
    <div className="space-y-1">{children}</div>
  </div>
);

export default TehranTemplate;
