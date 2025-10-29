export enum Tab {
  Calendar = 'Calendar',
  Chat = 'Chat',
  Check = 'Check',
  ImageEditor = 'ImageEditor',
}

export interface CareTask {
  day: number;
  title: string;
  description: string;
  icon: string; 
}

export interface Source {
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  sources?: Source[];
}