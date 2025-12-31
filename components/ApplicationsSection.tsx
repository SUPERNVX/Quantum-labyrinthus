import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QuantumMaze from './applications/QuantumMaze';
import MegaMaze from './applications/MegaMaze';

type MazeView = 'quantum' | 'mega';

const ApplicationsSection: React.FC = () => {
    const { t } = useTranslation();
    const [currentView, setCurrentView] = useState<MazeView>('quantum');

    const showQuantumMaze = () => setCurrentView('quantum');
    const showMegaMaze = () => setCurrentView('mega');

    return (
        <section id="aplicacoes" className="py-20 bg-gradient-to-r from-gray-800 to-quantum-dark">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('applications.title')} <span className="text-quantum-accent">{t('applications.titleSpan')}</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">{t('applications.description')}</p>
                    <div className="w-20 h-1 bg-quantum-accent mx-auto mt-4"></div>
                </div>

                <div className="bg-gray-900/50 rounded-2xl p-4 md:p-8 border border-quantum-secondary/20 min-h-[400px]">
                    {currentView === 'quantum' ? (
                        <QuantumMaze showMegaMaze={showMegaMaze} />
                    ) : (
                        <MegaMaze showQuantumMaze={showQuantumMaze} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default ApplicationsSection;
