
export type RaffleMode = 'INSTAGRAM' | 'MANUAL_LIST';
export type EngagementType = 'COMMENTS' | 'LIKES';

export interface Participant {
  id: string;
  username: string;
  content?: string;
  avatarUrl?: string;
  timestamp?: string;
}

export interface MetaMedia {
  id: string;
  caption: string;
  media_url: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  timestamp: string;
  permalink: string;
}

export interface RaffleSettings {
  winnersCount: number;
  engagementType: EngagementType;
  minMentions: number;
  requiredKeyword: string;
  allowDuplicates: boolean;
}

export interface RaffleResult {
  id: string;
  timestamp: number;
  mediaInfo?: MetaMedia;
  settings: RaffleSettings;
  winners: Participant[];
  verificationHash: string;
}

export enum AppState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  SELECTING_MEDIA = 'SELECTING_MEDIA',
  PROCESSING = 'PROCESSING',
  COUNTDOWN = 'COUNTDOWN',
  REVEALED = 'REVEALED'
}
