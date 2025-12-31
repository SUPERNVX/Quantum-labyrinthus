
import React from 'react';
import { useTranslation } from 'react-i18next';
import ApplicationsSection from './components/ApplicationsSection';
import LanguageSwitcher from './components/LanguageSwitcher';

const App: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <LanguageSwitcher />
            <header className="py-4 md:py-6 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-center text-quantum-accent">{t('header.title')}</h1>
                    <p className="text-center text-gray-400 mt-2 text-sm md:text-base">{t('header.subtitle')}</p>
                </div>
            </header>

            <main className="container mx-auto px-2 md:px-4 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    <ApplicationsSection />
                </div>
            </main>

            <footer className="py-4 md:py-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm md:text-base">
                    <p>{t('header.footer')}</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
