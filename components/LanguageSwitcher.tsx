import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    ];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-700">
                <div className="flex gap-1">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                                i18n.language === lang.code
                                    ? 'bg-quantum-accent text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                            title={lang.name}
                        >
                            {lang.flag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
