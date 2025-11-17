
import { openDB, IDBPDatabase } from 'idb';
// FIX: Added .js extension to satisfy module resolution
import type { ResumeData, CoverLetterData, ItemType, CustomTemplate } from '../types.js';

const DB_NAME = 'ResumeArchitectDB';
const DB_VERSION = 2; // Incremented version for schema change
const RESUME_STORE = 'resumes';
const COVER_LETTER_STORE = 'coverLetters';
const CUSTOM_TEMPLATES_STORE = 'customTemplates';

let db: IDBPDatabase;

export async function initDB() {
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains(RESUME_STORE)) {
        db.createObjectStore(RESUME_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(COVER_LETTER_STORE)) {
        db.createObjectStore(COVER_LETTER_STORE, { keyPath: 'id' });
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(CUSTOM_TEMPLATES_STORE)) {
          db.createObjectStore(CUSTOM_TEMPLATES_STORE, { keyPath: 'id' });
        }
      }
    },
  });
}

export const getAllResumes = async (): Promise<ResumeData[]> => {
  return db.getAll(RESUME_STORE);
};

export const getResumeById = async (id: string): Promise<ResumeData | undefined> => {
  return db.get(RESUME_STORE, id);
};

// FIX: Await result and cast from IDBValidKey to string to match return type.
export const saveResume = async (resume: ResumeData): Promise<string> => {
  const key = await db.put(RESUME_STORE, resume);
  return key as string;
};

export const deleteResume = async (id: string): Promise<void> => {
  return db.delete(RESUME_STORE, id);
};

export const getAllCoverLetters = async (): Promise<CoverLetterData[]> => {
  return db.getAll(COVER_LETTER_STORE);
};

export const getCoverLetterById = async (id: string): Promise<CoverLetterData | undefined> => {
  return db.get(COVER_LETTER_STORE, id);
};

// FIX: Await result and cast from IDBValidKey to string to match return type.
export const saveCoverLetter = async (coverLetter: CoverLetterData): Promise<string> => {
  const key = await db.put(COVER_LETTER_STORE, coverLetter);
  return key as string;
};

export const deleteCoverLetter = async (id: string): Promise<void> => {
  return db.delete(COVER_LETTER_STORE, id);
};

export const getItemById = async (id: string, type: ItemType) => {
    if (type === 'resume') return getResumeById(id);
    return getCoverLetterById(id);
}

export const saveItem = async (item: ResumeData | CoverLetterData, type: ItemType) => {
    if (type === 'resume') return saveResume(item as ResumeData);
    return saveCoverLetter(item as CoverLetterData);
}

// Custom Template Functions
export const getAllCustomTemplates = async (): Promise<CustomTemplate[]> => {
  return db.getAll(CUSTOM_TEMPLATES_STORE);
};

export const getCustomTemplateById = async (id: string): Promise<CustomTemplate | undefined> => {
  return db.get(CUSTOM_TEMPLATES_STORE, id);
};

// FIX: Await result and cast from IDBValidKey to string to match return type.
export const saveCustomTemplate = async (template: CustomTemplate): Promise<string> => {
  const key = await db.put(CUSTOM_TEMPLATES_STORE, template);
  return key as string;
};

export const deleteCustomTemplate = async (id: string): Promise<void> => {
  return db.delete(CUSTOM_TEMPLATES_STORE, id);
};
