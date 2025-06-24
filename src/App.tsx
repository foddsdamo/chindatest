import React, { useState } from 'react';
import { Flame, Users, Award, ChefHat, RefreshCw } from 'lucide-react';
import EvaluationForm from './components/EvaluationForm';
import Leaderboard from './components/Leaderboard';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useLanguage } from './hooks/useLanguage';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { FormData, Review } from './types';
import { translations } from './utils/translations';

function App() {
  const { language, changeLanguage } = useLanguage();
  const { hotpotBases, loading, error, addReview, refreshData } = useGoogleSheets();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = (key: string) => translations[key]?.[language] || key;

  const handleSubmitEvaluation = async (formData: FormData) => {
    setIsSubmitting(true);
    
    const newReview: Review = {
      id: Date.now().toString(),
      userName: formData.name,
      userPhone: formData.phone,
      rating: formData.rating,
      comment: formData.comment,
      timestamp: Date.now(),
      hotpotBaseId: formData.selectedBase
    };

    const success = await addReview(newReview);
    
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    
    setIsSubmitting(false);
  };

  const totalReviews = hotpotBases.reduce((sum, base) => sum + base.totalRatings, 0);
  const overallAverage = hotpotBases.length > 0 
    ? hotpotBases.reduce((sum, base) => sum + base.averageRating, 0) / hotpotBases.filter(base => base.totalRatings > 0).length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flame className="w-10 h-10 text-red-600" />
              <div>
                <h1 className="text-4xl font-bold text-gray-800">{t('companyName')}</h1>
                <p className="text-red-600 font-medium">{t('tastingEvent')}</p>
              </div>
            </div>
            <LanguageSwitcher 
              currentLanguage={language} 
              onLanguageChange={changeLanguage} 
            />
          </div>
        </div>
      </header>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>{t('successMessage')}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mx-4 mt-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
              <button 
                onClick={refreshData}
                className="text-sm underline hover:no-underline mt-1"
              >
                Try to reconnect to Google Sheets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <ChefHat className="w-16 h-16 text-red-600" />
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            {t('welcomeTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('welcomeDescription')}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
              <ChefHat className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{hotpotBases.length}</div>
              <div className="text-gray-600">{t('soupVarieties')}</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{totalReviews}</div>
              <div className="text-gray-600">{t('totalReviews')}</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {overallAverage > 0 ? overallAverage.toFixed(1) : '0.0'}
              </div>
              <div className="text-gray-600">{t('averageRating')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Evaluation Form */}
          <div>
            <EvaluationForm 
              onSubmit={handleSubmitEvaluation} 
              language={language}
              hotpotBases={hotpotBases}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Leaderboard */}
          <div>
            <Leaderboard 
              hotpotBases={hotpotBases} 
              language={language}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Flame className="w-6 h-6 text-red-500" />
            <span className="text-xl font-semibold">{t('companyName')}</span>
          </div>
          <p className="text-gray-400">
            {t('footerNote')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;