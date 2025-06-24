import { HotpotBase } from '../types';

export const initialHotpotBases: HotpotBase[] = [
  {
    id: 'traditional',
    name: '传统红汤锅底',
    averageRating: 0,
    totalRatings: 0,
    reviews: []
  },
  {
    id: 'spicy',
    name: '麻辣锅底',
    averageRating: 0,
    totalRatings: 0,
    reviews: []
  },
  {
    id: 'mushroom',
    name: '菌菇锅底',
    averageRating: 0,
    totalRatings: 0,
    reviews: []
  },
  {
    id: 'tomato',
    name: '番茄锅底',
    averageRating: 0,
    totalRatings: 0,
    reviews: []
  },
  {
    id: 'clear',
    name: '清汤锅底',
    averageRating: 0,
    totalRatings: 0,
    reviews: []
  }
];

export const getHotpotBaseName = (id: string): string => {
  const base = initialHotpotBases.find(b => b.id === id);
  return base ? base.name : '';
};