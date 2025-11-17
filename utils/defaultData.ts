import type { ResumeData, CoverLetterData } from '../types.js';

export const defaultResumeData: ResumeData = {
  id: 'default-resume',
  name: 'Sample Resume',
  template: 'classic',
  accentColor: '#3b82f6', // A nice default blue
  fontFamily: 'Inter',
  personalDetails: {
    fullName: 'John Doe',
    jobTitle: 'Software Engineer',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Anytown, USA',
    linkedin: 'linkedin.com/in/johndoe',
    website: 'johndoe.com',
  },
  summary: 'A passionate software engineer with experience in building web applications.',
  experience: [
    {
      id: crypto.randomUUID(),
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      startDate: '2020-01-01',
      endDate: 'Present',
      responsibilities: [
        'Developed and maintained web applications.',
        'Collaborated with cross-functional teams.',
      ],
    },
  ],
  education: [
    {
      id: crypto.randomUUID(),
      institution: 'State University',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: '2016-09-01',
      endDate: '2020-05-01',
    },
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'JavaScript' },
    { id: crypto.randomUUID(), name: 'React' },
    { id: crypto.randomUUID(), name: 'Node.js' },
  ],
  projects: [],
  languages: [],
  supplementarySkills: [],
  courses: [],
  awards: [],
  academicExperience: [],
  references: [],
};

export const defaultCoverLetterData: CoverLetterData = {
  id: 'default-cover-letter',
  name: 'Sample Cover Letter',
  template: 'minimalist',
  personalDetails: {
    fullName: 'Jane Smith',
    jobTitle: 'Product Manager',
    email: 'jane.smith@example.com',
    phone: '098-765-4321',
    address: '456 Oak Ave, Anytown, USA',
    linkedin: 'linkedin.com/in/janesmith',
    website: 'janesmith.com',
  },
  recipientName: 'Hiring Manager',
  recipientCompany: 'Innovate Inc.',
  date: new Date().toISOString().split('T')[0],
  body: `Dear Hiring Manager,

I am writing to express my interest in the Product Manager position at Innovate Inc. I am confident that my skills and experience are a great match for this role.

Thank you for your time and consideration.

Sincerely,
Jane Smith`,
};