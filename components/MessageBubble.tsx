import React from 'react';
import { ChatMessage } from '../types';
import StructuredResponseDisplay from './StructuredResponseDisplay';
import { CHATBOT_AVATAR_URL, COMPANY_NAME, SLOGAN, LOGO_TITLE_URL, DOWNLOAD_ICON_ARIA_LABEL } from '../constants';
import { generateReportPdf } from '../utils/pdfGenerator';
import { DownloadIcon } from './icons';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleClasses = isUser 
    ? 'bg-brand-primary text-brand-secondary' 
    : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100';
  const timeFormatted = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleDownloadReport = async () => {
    if (message.structuredResponse) {
      try {
        await generateReportPdf(
            message.structuredResponse, 
            COMPANY_NAME, 
            SLOGAN, 
            LOGO_TITLE_URL 
        );
      } catch (error) {
        console.error("Failed to generate PDF report:", error);
        alert("Sorry, there was an error generating the PDF report.");
      }
    }
  };

  return (
    <div className={`flex w-full ${bubbleAlignment} ${!isUser ? 'items-end' : ''}`}>
      {!isUser && (
        <img 
          src={CHATBOT_AVATAR_URL} 
          alt="AI Avatar" 
          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 self-end mb-3"
        />
      )}
      <div className={`ml-2 max-w-xl md:max-w-2xl px-4 py-3 rounded-xl shadow ${bubbleClasses} transition-colors duration-300`}>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
        
        {message.structuredResponse && (
          <>
            <StructuredResponseDisplay response={message.structuredResponse} />
            <div className="mt-3 pt-3 border-t border-gray-400/50 dark:border-gray-500/50 flex justify-end">
              <button
                onClick={handleDownloadReport}
                aria-label={DOWNLOAD_ICON_ARIA_LABEL}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-brand-secondary/80 hover:bg-brand-secondary text-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 dark:focus:ring-offset-gray-600"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </button>
            </div>
          </>
        )}

        {message.error && (
          <div className="mt-2 p-2 bg-red-200 dark:bg-red-700/50 text-red-800 dark:text-red-200 rounded text-xs">
            <strong>Error:</strong> {message.error}
          </div>
        )}
        <p className={`text-xs mt-2 ${isUser ? 'text-teal-700/80 dark:text-teal-700/80' : 'text-gray-500 dark:text-gray-400'} text-left`}>
          {timeFormatted}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;