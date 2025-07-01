import React from 'react';
import { StructuredResponse } from '../types';

interface StructuredResponseDisplayProps {
  response: StructuredResponse;
}

const SectionCard: React.FC<{ title: string; content?: string }> = ({ title, content }) => {
  if (!content) return null;
  return (
    <div className="mt-3 p-4 bg-gray-200/50 dark:bg-brand-secondary/30 rounded-lg shadow transition-colors duration-300">
      <h4 className="font-semibold text-brand-secondary dark:text-brand-primary mb-1 text-sm">{title}</h4>
      <p className="text-xs whitespace-pre-wrap text-gray-700 dark:text-gray-200">{content}</p>
    </div>
  );
};

const StructuredResponseDisplay: React.FC<StructuredResponseDisplayProps> = ({ response }) => {
  return (
    <div className="mt-4 space-y-3">
      <SectionCard title="Audience Insights" content={response.audienceInsights} />
      <SectionCard title="Personalization Strategy" content={response.personalizationStrategy} />
      <SectionCard title="Creative Suggestions" content={response.creativeSuggestions} />
      <SectionCard title="Channel Recommendations" content={response.channelRecommendations} />
      <SectionCard title="Success Metrics (KPIs)" content={response.successMetrics} />
    </div>
  );
};

export default StructuredResponseDisplay;