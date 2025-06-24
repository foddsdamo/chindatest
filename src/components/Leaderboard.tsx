import React from 'react';
import { Trophy, Star, MessageSquare, TrendingUp } from 'lucide-react';
import { HotpotBase, Language } from '../types';
import { translations } from '../utils/translations';
import StarRating from './StarRating';

interface LeaderboardProps {
  hotpotBases: HotpotBase[];
  language: Language;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ hotpotBases, language }) => {
  const sortedBases = [...hotpotBases].sort((a, b) => b.averageRating - a.averageRating);
  
  const t = (key: string) => translations[key]?.[language] || key;

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Trophy className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Trophy className="w-6 h-6 text-orange-500" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">{index + 1}</span>;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-400';
    if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-gradient-to-r from-gray-100 to-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <TrendingUp className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('leaderboardTitle')}</h2>
        <p className="text-gray-600">{t('leaderboardSubtitle')}</p>
      </div>

      <div className="space-y-4">
        {sortedBases.map((base, index) => (
          <div
            key={base.id}
            className={`rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg ${
              index === 0 ? 'border-yellow-300 bg-yellow-50' :
              index === 1 ? 'border-gray-300 bg-gray-50' :
              index === 2 ? 'border-orange-300 bg-orange-50' :
              'border-gray-200 bg-white hover:border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadge(index)}`}>
                  {getRankIcon(index)}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{base.name[language]}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <StarRating rating={Math.round(base.averageRating)} readonly size="sm" />
                    <span className="text-lg font-bold text-gray-700">
                      {base.averageRating > 0 ? base.averageRating.toFixed(1) : '0.0'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({base.totalRatings} {t('reviews')})
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end space-x-2 text-gray-600">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">{t('averageScore')}</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {base.averageRating > 0 ? base.averageRating.toFixed(1) : '0.0'}
                </div>
              </div>
            </div>

            {/* Latest Review */}
            {base.reviews.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <MessageSquare className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">{t('latestReview')}</span>
                </div>
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">
                      {base.reviews[0].userName}
                    </span>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={base.reviews[0].rating} readonly size="sm" />
                      <span className="text-sm text-gray-500">
                        {new Date(base.reviews[0].timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {base.reviews[0].comment}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;