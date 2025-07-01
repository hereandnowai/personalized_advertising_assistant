import React from 'react';
import { COMPANY_NAME, SLOGAN, CONTACT_INFO, WEBSITE_URL } from '../../constants';

const coreCapabilities = [
  "Customer Segmentation: Analyze user demographics, behavior patterns, purchase history, and engagement metrics to create detailed customer segments.",
  "Content Personalization: Generate personalized ad copy, visuals suggestions, and campaign messaging based on individual user profiles.",
  "Behavioral Analysis: Interpret user interactions, click-through rates, conversion patterns, and engagement metrics.",
  "Campaign Optimization: Recommend budget allocation, timing, platform selection, and targeting parameters.",
  "Performance Prediction: Forecast campaign performance and ROI based on historical data and current trends."
];

const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-transparent rounded-lg transition-colors duration-300">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-brand-secondary dark:text-brand-primary mb-2">About {COMPANY_NAME}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 italic">{SLOGAN}</p>
      </header>

      <section className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-brand-secondary dark:text-brand-primary mb-4">Our Mission</h2>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          At {COMPANY_NAME}, we are driven by a passion for innovation. Our mission is to empower businesses 
          by transforming complex customer data into actionable insights for highly personalized and effective 
          advertising. We believe in ethical AI that respects user privacy while delivering exceptional results.
        </p>
      </section>

      <section className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-brand-secondary dark:text-brand-primary mb-4">Core Capabilities</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 pl-4">
          {coreCapabilities.map((capability, index) => (
            <li key={index} className="text-lg leading-relaxed">{capability}</li>
          ))}
        </ul>
      </section>
      
      <section className="mb-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-brand-secondary dark:text-brand-primary mb-4">Data Processing & Ethics</h2>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
          We are committed to the highest standards of data privacy and ethical AI. Our assistant operates with strict adherence to:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-500 dark:text-gray-400 pl-4">
            <li>GDPR and privacy regulation compliance</li>
            <li>Data anonymization standards</li>
            <li>User consent preferences</li>
            <li>Avoidance of discriminatory targeting practices</li>
            <li>Transparent data usage policies</li>
        </ul>
      </section>

      <section className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-brand-secondary dark:text-brand-primary mb-4">Get in Touch</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-1">
          Have questions or want to learn more?
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-1">
          Email us at: <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand-primary hover:underline">{CONTACT_INFO.email}</a>
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Visit our website: <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">{WEBSITE_URL}</a>
        </p>
      </section>
    </div>
  );
};

export default AboutPage;