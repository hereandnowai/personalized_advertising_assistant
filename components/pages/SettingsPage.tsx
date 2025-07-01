import React from 'react';
import { COMPANY_NAME } from '../../constants';
import { Theme, ResponseVerbosity } from '../../types';

interface SettingsPageProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  currentVerbosity: ResponseVerbosity;
  setVerbosity: (verbosity: ResponseVerbosity) => void;
  onClearChatHistory: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ 
  currentTheme, 
  setTheme,
  currentVerbosity,
  setVerbosity,
  onClearChatHistory 
}) => {
  const toggleTheme = () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear the entire chat history? This action cannot be undone.")) {
      onClearChatHistory();
      alert("Chat history has been cleared.");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-transparent rounded-lg space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brand-primary mb-2">
        Settings
      </h1>
      
      {/* Appearance Settings */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-brand-primary mb-4 text-left">Appearance</h2>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300">Current Theme:</p>
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${currentTheme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="px-6 py-2 bg-brand-secondary text-brand-primary font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
          </button>
        </div>
      </div>

      {/* AI Response Settings */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-brand-primary mb-4 text-left">AI Response</h2>
        <div>
          <p className="text-gray-600 dark:text-gray-300 mb-2 text-left">Response Verbosity:</p>
          <div className="flex space-x-4">
            {(['concise', 'detailed'] as ResponseVerbosity[]).map((level) => (
              <button
                key={level}
                onClick={() => setVerbosity(level)}
                aria-pressed={currentVerbosity === level}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                  ${currentVerbosity === level 
                    ? 'bg-brand-primary text-brand-secondary font-semibold shadow-md' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
           <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-left">
            {currentVerbosity === 'concise' ? 'Concise: AI provides brief, to-the-point answers.' : 'Detailed: AI provides more comprehensive explanations.'}
          </p>
        </div>
      </div>

      {/* Chat Data Management */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-brand-primary mb-4 text-left">Chat Data</h2>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300">Chat History:</p>
          <button
            onClick={handleClearHistory}
            className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Clear History
          </button>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-left">
          This will permanently remove all messages from your current chat session.
        </p>
      </div>

       <div className="mt-4 p-6 w-full max-w-md">
        <p className="text-xs text-gray-500 dark:text-gray-400">
            More customization options for {COMPANY_NAME} will be available here in future updates.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;