export type ItemType = 'resume' | 'coverLetter';

export type Language = 'English' | 'German' | 'Persian';

export type FontFamily = 'Inter' | 'Lato' | 'Roboto' | 'Garamond';

export interface PersonalDetails {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Education {
  id:string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface Skill {
    id: string;
    name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  technologies: string[];
}

export interface LanguageProficiency {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Conversational' | 'Basic' | string;
}

export interface Course {
  id: string;
  name: string;
  institution: string;
  date: string;
}

export interface Award {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface AcademicExperience {
  id: string;
  title: string;
  institution: string;
  date: string;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  contactInfo: string;
}

export interface ResumeData {
  id: string;
  name: string;
  template: string; // 'modern', 'soho', or custom template id
  accentColor: string;
  fontFamily: FontFamily;
  personalDetails: PersonalDetails;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: LanguageProficiency[];
  supplementarySkills: Skill[];
  courses: Course[];
  awards: Award[];
  academicExperience: AcademicExperience[];
  references: Reference[];
}

export interface CoverLetterData {
  id: string;
  name: string;
  template: string; // 'minimalist', 'professional', or custom template id
  personalDetails: PersonalDetails;
  recipientName: string;
  recipientCompany: string;
  date: string;
  body: string;
}

export interface CustomTemplate {
    id: string;
    name: string;
    type: ItemType;
    html: string;
    css: string;
}