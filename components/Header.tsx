import React from 'react';
import { Page } from '../types'; 

interface HeaderProps {
  companyName: string;
  slogan: string;
  logoUrl: string;
  currentPage: Page;
  navigateTo: (page: Page) => void;
}

const NavItem: React.FC<{
  pageName: Page;
  currentPage: Page;
  navigateTo: (page: Page) => void;
  children: React.ReactNode;
}> = ({ pageName, currentPage, navigateTo, children }) => {
  const isActive = currentPage === pageName;
  return (
    <button
      onClick={() => navigateTo(pageName)}
      aria-current={isActive ? 'page' : undefined}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive 
          ? 'bg-brand-primary text-brand-secondary shadow-md' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white focus:bg-gray-200 dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white'
        }
        focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-brand-secondary
      `}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ companyName, slogan, logoUrl, currentPage, navigateTo }) => {
  return (
    <header className="bg-white dark:bg-brand-secondary shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <button onClick={() => navigateTo('home')} className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-primary rounded" aria-label="Go to Home page">
              <img 
                src={logoUrl} 
                alt={`${companyName} Logo`} 
                className="h-10 sm:h-12 md:h-14 object-contain" 
              />
            </button>
             <p className="ml-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 italic hidden md:block">{slogan}</p>
          </div>
          
          <nav className="hidden sm:flex sm:items-center sm:space-x-2 md:space-x-4">
            <NavItem pageName="home" currentPage={currentPage} navigateTo={navigateTo}>Home</NavItem>
            <NavItem pageName="assistant" currentPage={currentPage} navigateTo={navigateTo}>Assistant</NavItem>
            <NavItem pageName="about" currentPage={currentPage} navigateTo={navigateTo}>About</NavItem>
            <NavItem pageName="settings" currentPage={currentPage} navigateTo={navigateTo}>Settings</NavItem>
          </nav>
          
          <div className="sm:hidden">
            <select 
              onChange={(e) => navigateTo(e.target.value as Page)} 
              value={currentPage}
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-brand-primary"
              aria-label="Main navigation"
            >
              <option value="home">Home</option>
              <option value="assistant">Assistant</option>
              <option value="about">About</option>
              <option value="settings">Settings</option>
            </select>
          </div>
        </div>
      </div>
       <p className="md:hidden text-center text-xs text-gray-600 dark:text-gray-300 italic pb-2">{slogan}</p>
    </header>
  );
};

export default Header;