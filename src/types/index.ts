export interface UserInfo {
  name: string;
  phone: string;
}

export interface HotpotBase {
  id: string;
  name: {
    th: string;
    zh: string;
    en: string;
  };
  averageRating: number;
  totalRatings: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  userPhone: string;
  rating: number;
  comment: string;
  timestamp: number;
  hotpotBaseId: string;
}

export interface FormData extends UserInfo {
  selectedBase: string;
  rating: number;
  comment: string;
}

export type Language = 'th' | 'zh' | 'en';

export interface Translations {
  [key: string]: {
    th: string;
    zh: string;
    en: string;
  };
}