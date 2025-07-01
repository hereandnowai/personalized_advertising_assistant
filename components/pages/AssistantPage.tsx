import React from 'react';
import ChatInterface from '../ChatInterface';
import { ResponseVerbosity } from '../../types';

interface AssistantPageProps {
  responseVerbosity: ResponseVerbosity;
  chatClearTrigger: number;
}

const AssistantPage: React.FC<AssistantPageProps> = ({ responseVerbosity, chatClearTrigger }) => {
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-start py-4 md:py-8">
      {/* Container to constrain ChatInterface width and allow it to take full height within this page */}
      <div className="w-full max-w-4xl flex-1 flex flex-col">
        <ChatInterface responseVerbosity={responseVerbosity} chatClearTrigger={chatClearTrigger} />
      </div>
    </div>
  );
};

export default AssistantPage;