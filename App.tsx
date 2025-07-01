import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import AssistantPage from './components/pages/AssistantPage';
import AboutPage from './components/pages/AboutPage';
import SettingsPage from './components/pages/SettingsPage';
import { COMPANY_NAME, SLOGAN, CONTACT_INFO, SOCIAL_LINKS, LOGO_TITLE_URL } from './constants';
import { Page, Theme, ResponseVerbosity } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark theme
  const [responseVerbosity, setResponseVerbosity] = useState<ResponseVerbosity>('detailed'); // Default verbosity
  const [chatClearTrigger, setChatClearTrigger] = useState<number>(0);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const handleClearChatHistory = () => {
    setChatClearTrigger(prev => prev + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} />;
      case 'assistant':
        return <AssistantPage responseVerbosity={responseVerbosity} chatClearTrigger={chatClearTrigger} />;
      case 'about':
        return <AboutPage />;
      case 'settings':
        return (
          <SettingsPage 
            currentTheme={theme} 
            setTheme={setTheme} 
            currentVerbosity={responseVerbosity}
            setVerbosity={setResponseVerbosity}
            onClearChatHistory={handleClearChatHistory}
          />
        );
      default:
        return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-brand-secondary text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Header 
        companyName={COMPANY_NAME} 
        slogan={SLOGAN} 
        logoUrl={LOGO_TITLE_URL}
        currentPage={currentPage}
        navigateTo={navigateTo} 
      />
      <main className="flex-grow container mx-auto p-4 w-full flex flex-col">
        {renderPage()}
      </main>
      <Footer contactInfo={CONTACT_INFO} socialLinks={SOCIAL_LINKS} companyName={COMPANY_NAME} slogan={SLOGAN} />
    </div>
  );
};

export default App;