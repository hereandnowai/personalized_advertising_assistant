import React from 'react';
import { Page } from '../../types';
import { COMPANY_NAME, SLOGAN, LOGO_TITLE_URL } from '../../constants';

interface HomePageProps {
  navigateTo: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 bg-gray-50 dark:bg-transparent rounded-lg transition-colors duration-300">
      <img 
        src={LOGO_TITLE_URL} 
        alt={`${COMPANY_NAME} Logo`} 
        className="w-48 sm:w-64 md:w-80 mb-6 sm:mb-8"
      />
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-secondary dark:text-brand-primary mb-3">
        Welcome to {COMPANY_NAME}
      </h1>
      <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-2 italic">
        {SLOGAN}
      </p>
      <p className="text-md sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
        Your AI-powered Personalized Advertising Assistant. We analyze customer data and behavior to help you deliver highly targeted and effective advertising campaigns.
      </p>
      <button
        onClick={() => navigateTo('assistant')}
        className="px-8 py-3 bg-brand-primary text-brand-secondary text-lg font-semibold rounded-lg hover:bg-yellow-300 transition-colors shadow-lg transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-50"
      >
        Get Started with the Assistant
      </button>
    </div>
  );
};

export default HomePage;