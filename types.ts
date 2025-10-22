export type UserRole = 'Physician / NP' | 'Nursing Staff' | 'Allied Health and Pharmacy Staff';
export type SiteArea = 'AKC North' | 'AKC South';
export type SiteType = 'Hospital Unit' | 'Urban Satellite' | 'Rural Satellite' | 'Long Term Care Site';

export type AppState = 'roleSelection' | 'siteSelection' | 'home' | 'feedback' | 'summary';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface InterviewSession {
  topic: Topic;
  transcript: ChatMessage[];
}

export interface Topic {
  id: string;
  name: string;
  emoji: string;
}
