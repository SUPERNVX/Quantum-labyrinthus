
import React from 'react';
import ApplicationsSection from './components/ApplicationsSection';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <header className="py-4 md:py-6 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-center text-quantum-accent">Labirintos Quânticos</h1>
                    <p className="text-center text-gray-400 mt-2 text-sm md:text-base">Explorando a superposição quântica através da resolução de labirintos</p>
                </div>
            </header>

            <main className="container mx-auto px-2 md:px-4 py-8 md:py-12">
                <div className="max-w-6xl mx-auto">
                    <ApplicationsSection />
                </div>
            </main>

            <footer className="py-4 md:py-6 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm md:text-base">
                    <p>Aplicações da Superposição Quântica</p>
                </div>
            </footer>
        </div>
    );
};

export default App;
