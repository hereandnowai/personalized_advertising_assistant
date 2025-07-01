import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 rounded-full bg-brand-primary animate-bounce"></div>
      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">AI is thinking...</span>
    </div>
  );
};

export default LoadingSpinner;