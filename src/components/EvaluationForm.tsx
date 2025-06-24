import React, { useState } from 'react';
import { User, Phone, MessageSquare, ChefHat } from 'lucide-react';
import StarRating from './StarRating';
import { FormData, Language, HotpotBase } from '../types';
import { translations } from '../utils/translations';

interface EvaluationFormProps {
  onSubmit: (data: FormData) => void;
  language: Language;
  hotpotBases: HotpotBase[];
  isSubmitting?: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ 
  onSubmit, 
  language, 
  hotpotBases,
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    selectedBase: '',
    rating: 0,
    comment: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const t = (key: string) => translations[key]?.[language] || key;

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    } else if (!/^\d{8,12}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = t('phoneInvalid');
    }

    if (!formData.selectedBase) {
      newErrors.selectedBase = t('soupBaseRequired');
    }

    if (formData.rating === 0) {
      newErrors.rating = t('ratingRequired');
    }

    if (!formData.comment.trim()) {
      newErrors.comment = t('commentRequired');
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = t('commentTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !isSubmitting) {
      onSubmit(formData);
      setFormData({
        name: '',
        phone: '',
        selectedBase: '',
        rating: 0,
        comment: ''
      });
      setErrors({});
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return t('unsatisfied');
      case 2: return t('fair');
      case 3: return t('satisfied');
      case 4: return t('verySatisfied');
      case 5: return t('excellent');
      default: return t('ratingSelect');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <ChefHat className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('evaluationTitle')}</h2>
        <p className="text-gray-600">{t('evaluationSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-red-600" />
            {t('step1Title')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                  errors.name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={t('namePlaceholder')}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phone')} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                  errors.phone ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={t('phonePlaceholder')}
                disabled={isSubmitting}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Soup Base Evaluation */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-red-600" />
            {t('step2Title')}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('selectSoupBase')} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.selectedBase}
                onChange={(e) => setFormData(prev => ({ ...prev, selectedBase: e.target.value }))}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
                  errors.selectedBase ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isSubmitting}
              >
                <option value="">{t('selectSoupPlaceholder')}</option>
                {hotpotBases.map(base => (
                  <option key={base.id} value={base.id}>
                    {base.name[language]}
                  </option>
                ))}
              </select>
              {errors.selectedBase && <p className="text-red-500 text-sm mt-1">{errors.selectedBase}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('rating')} <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                  size="lg"
                />
                <span className="text-sm text-gray-600">
                  {getRatingText(formData.rating)}
                </span>
              </div>
              {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('yourReview')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none ${
                  errors.comment ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={t('reviewPlaceholder')}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.comment ? (
                  <p className="text-red-500 text-sm">{errors.comment}</p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {t('charactersEntered').replace('{count}', formData.comment.length.toString())}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transform hover:scale-105'
          }`}
        >
          {isSubmitting ? t('submitting') : t('submitEvaluation')}
        </button>
      </form>
    </div>
  );
};

export default EvaluationForm;