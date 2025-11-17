
import React from 'react';
import type { ResumeData } from '../../../types.js';

const PhoneIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-500' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-500' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-500' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ProfileIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-700' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EducationIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-700' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v-5.5a2 2 0 012-2h.5a2 2 0 012 2v5.5M12 14l-9-5 9 5 9-5-9 5zm0 0v5.5a2 2 0 002 2h.5a2 2 0 002-2V14" />
  </svg>
);

const ExperienceIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-700' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ProjectsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-700' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const PortfolioIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-700' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const SkillsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-700' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const LanguagesIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-700' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9h18" />
  </svg>
);

const AwardsIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-gray-700' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l3-3 3 3v13m-6 0h6m-6 0l-1-4h8l-1 4m-6 0l-1.5-6h9L15 15" />
  </svg>
);


const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalDetails, summary, experience, education, skills, awards, languages, projects, supplementarySkills } = data;

  const fontClass = {
    Inter: 'font-[Inter]',
    Lato: 'font-[Lato]',
    Roboto: 'font-[Roboto]',
    Garamond: 'font-[Garamond]',
  }[data.fontFamily || 'Inter'];

  const safeSplitYear = (dateString: string) => (dateString ? dateString.split('-')[0] : '');

  return (
    <div className={`bg-white text-gray-800 p-10 text-sm ${fontClass}`}>
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-wider uppercase">{personalDetails.fullName}</h1>
        <p className="text-md tracking-widest text-gray-600 mt-1">{personalDetails.jobTitle}</p>
      </header>

      <div className="grid grid-cols-12 gap-x-10">
        <main className="col-span-8 pr-6">
          <Section title="Profile" icon={<ProfileIcon />}>
            <p className="text-gray-700 leading-normal">{summary}</p>
          </Section>

          <Section title="Education" icon={<EducationIcon />}>
            {education.map(edu => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                    <p className="text-gray-600">{edu.fieldOfStudy}</p>
                  </div>
                  <div className="text-right text-gray-500 text-xs font-medium whitespace-nowrap">
                    <p>{safeSplitYear(edu.startDate)}</p>
                    <p>{safeSplitYear(edu.endDate)}</p>
                  </div>
                </div>
              </div>
            ))}
          </Section>

          <Section title="Experience" icon={<ExperienceIcon />}>
            {experience.map(exp => (
              <div key={exp.id} className="mb-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{exp.jobTitle}</h3>
                    <p className="text-gray-600">{exp.company}, {exp.location}</p>
                  </div>
                  <div className="text-right text-gray-500 text-xs font-medium whitespace-nowrap">
                    <p>{safeSplitYear(exp.startDate)}</p>
                    <p>{safeSplitYear(exp.endDate)}</p>
                  </div>
                </div>
                <ul>
                  {exp.responsibilities.map((r, index) => (
                    <li key={r + "-" + index} className="mt-2 text-gray-700 leading-normal">{r}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          {projects && projects.length > 0 && (
            <Section title="Projects" icon={<ProjectsIcon />}>
              {projects.map(proj => (
                <div key={proj.id} className="mb-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base">{proj.name}</h3>
                      {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline break-all text-xs">{proj.link}</a>}
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700 leading-normal">{proj.description}</p>
                  <div className="flex gap-2 pt-2">
                    {proj.technologies.map((pt, index) => (
                      <span key={pt + "-" + index} className="inline-flex items-center rounded-md bg-gray-200 px-2 py-1 text-xs font-medium text-gray-600 inset-ring inset-ring-gray-500/10">
                        {pt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}

        </main>

        <aside className="col-span-4 border-l pl-6">
          <div className="mb-6 space-y-2">
            <div className="flex items-center">
              <PhoneIcon className="w-3.5 h-3.5 text-gray-600" />
              <span className="ml-2 text-gray-700">{personalDetails.phone}</span>
            </div>
            <div className="flex items-center">
              <MailIcon className="w-3.5 h-3.5 text-gray-600" />
              <span className="ml-2 text-gray-700">{personalDetails.email}</span>
            </div>
            <div className="flex items-start">
              <LocationIcon className="w-3.5 h-3.5 text-gray-600 mt-0.5" />
              <span className="ml-2 text-gray-700">{personalDetails.address}</span>
            </div>
          </div>

          <Section title="Portfolio" icon={<PortfolioIcon />}>
            <a href={personalDetails.website} className="text-gray-700 block hover:underline break-all">{personalDetails.website}</a>
            <a href={`https://${personalDetails.linkedin}`} className="text-gray-700 block hover:underline break-all">{personalDetails.linkedin}</a>
          </Section>

          <Section title="Skills" icon={<SkillsIcon />}>
            <div className="space-y-1">
              {skills.map(skill => (
                <p key={skill.id} className="text-gray-700">{skill.name}</p>
              ))}
            </div>
          </Section>

          <Section title="Supplementary Skills" icon={<SkillsIcon />}>
            <div className="space-y-1">
              {supplementarySkills.map(supplementarySkill => (
                <p key={supplementarySkill.id} className="text-gray-700">{supplementarySkill.name}</p>
              ))}
            </div>
          </Section>

          <Section title="Languages" icon={<LanguagesIcon />}>
            {languages.map(lang => (
              <p key={lang.id} className="text-gray-700">
                <span className="font-semibold">{lang.language}:</span> {lang.proficiency}
              </p>
            ))}
          </Section>

          {awards && awards.length > 0 && (
            <Section title="Awards" icon={<AwardsIcon />}>
              <div className="space-y-1">
                {awards.map(award => (
                  <div key={award.id} className="flex justify-between items-baseline">
                    <p className="text-gray-700">{award.name}</p>
                    <p className="text-gray-500 text-xs">{safeSplitYear(award.date)}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </aside>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="mb-6">
    <h2 className="text-xs flex items-center font-extrabold uppercase tracking-widest text-gray-800 pb-1">
      {icon && <span className="mr-2.5">{icon}</span>}
      {title}
    </h2>
    <div className="space-y-1">{children}</div>
  </div>
);

export default ClassicTemplate;
