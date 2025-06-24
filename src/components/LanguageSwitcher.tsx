import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../types';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  const languages = [
    { code: 'th' as Language, name: 'ไทย', flag: '🇹🇭' },
    { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' }
  ];

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
        <Globe className="w-4 h-4 text-gray-600" />
        <div className="flex space-x-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                currentLanguage === lang.code
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{lang.flag}</span>
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;