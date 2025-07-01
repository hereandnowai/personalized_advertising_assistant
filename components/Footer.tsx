
import React from 'react';
import { ContactInfo, SocialLink } from '../types';

interface FooterProps {
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  companyName: string;
  slogan: string;
}

const Footer: React.FC<FooterProps> = ({ contactInfo, socialLinks, companyName, slogan }) => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-12 px-4 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-brand-secondary dark:text-brand-primary mb-3">Connect with {companyName}</h3>
            <p className="mb-1">📧 <a href={`mailto:${contactInfo.email}`} className="hover:text-brand-primary transition-colors break-all">{contactInfo.email}</a></p>
            <p className="mb-1">📱 <a href={`tel:${contactInfo.mobile.replace(/\s/g, '')}`} className="hover:text-brand-primary transition-colors">{contactInfo.mobile}</a></p>
            <p>🌐 <a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors break-all">{contactInfo.website}</a></p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-brand-secondary dark:text-brand-primary mb-3">Follow Us</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {socialLinks.map(link => (
                <a 
                  key={link.name} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={link.name}
                  className="text-gray-700 dark:text-gray-300 hover:text-brand-primary transition-colors flex items-center gap-2"
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 text-center">
          <p className="text-sm">Powered by <span className="font-semibold text-brand-secondary dark:text-brand-primary">{companyName}</span> - {slogan}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Developed by Adhithya J [ AI Products Engineering Team ]
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
