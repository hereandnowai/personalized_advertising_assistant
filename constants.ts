import { ContactInfo, SocialLink, ChoiceOption, SpeechRecognitionLanguage, ResponseVerbosity } from './types';
import { LinkedInIcon, InstagramIcon, GitHubIcon, XIcon, YouTubeIcon, BlogIcon } from './components/icons';

export const COMPANY_NAME = "HERE AND NOW AI";
export const SLOGAN = "designed with passion for innovation";
export const WEBSITE_URL = "https://hereandnowai.com";

export const LOGO_TITLE_URL = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";
export const CHATBOT_AVATAR_URL = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel.jpeg";

export const GEMINI_MODEL = 'gemini-2.5-flash-preview-04-17';
export const GEMINI_TEMPERATURE = 0.7;

export const CONTACT_INFO: ContactInfo = {
  email: "info@hereandnowai.com",
  mobile: "+91 996 296 1000",
  website: "https://hereandnowai.com"
};

export const SOCIAL_LINKS: SocialLink[] = [
  { name: "Blog", url: "https://hereandnowai.com/blog", icon: BlogIcon },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/hereandnowai/", icon: LinkedInIcon },
  { name: "Instagram", url: "https://instagram.com/hereandnow_ai", icon: InstagramIcon },
  { name: "GitHub", url: "https://github.com/hereandnowai", icon: GitHubIcon },
  { name: "X", url: "https://x.com/hereandnow_ai", icon: XIcon },
  { name: "YouTube", url: "https://youtube.com/@hereandnow_ai", icon: YouTubeIcon },
];

export const VERBOSITY_INSTRUCTION_CONCISE = "Keep all text explanations brief and to the point. Focus on actionable advice.";
export const VERBOSITY_INSTRUCTION_DETAILED = "Provide detailed explanations, examples, and elaborations where appropriate to ensure full understanding.";

export const SYSTEM_INSTRUCTION_BASE = `You are an AI-powered Personalized Advertising Assistant created by ${COMPANY_NAME}.
Your primary function is to analyze customer data and behavior to deliver highly targeted and personalized advertising campaigns.
{{VERBOSITY_INSTRUCTION}}

Core Capabilities:
1. Customer Segmentation
2. Content Personalization
3. Behavioral Analysis
4. Campaign Optimization
5. Performance Prediction

Output Format:
VERY IMPORTANT: Your entire response MUST be ONLY a single, valid JSON object. Do NOT include any text, explanations, or markdown fences (like \`\`\`json) before or after the JSON object.

The JSON object must follow this exact structure:
{
  "audienceInsights": "Key demographic and behavioral characteristics. Be specific and actionable.",
  "personalizationStrategy": "Specific recommendations for targeting. Include examples.",
  "creativeSuggestions": "Tailored messaging and visual concepts. Describe ad copy ideas and visual styles.",
  "channelRecommendations": "Optimal platforms and timing. Justify your choices.",
  "successMetrics": "Key Performance Indicators (KPIs) to track campaign effectiveness. List 3-5 relevant metrics.",
  "suggestedFollowUps": [
    { "id": "follow_up_1", "text": "Suggest a relevant follow-up question or action based on the response." },
    { "id": "follow_up_2", "text": "Suggest another relevant follow-up." }
  ]
}

If no specific follow-up questions are relevant, provide an empty array for "suggestedFollowUps": [].

Compliance & Ethics:
- Adhere to GDPR and privacy regulations.
- Maintain data anonymization.
- Respect user consent.
- Avoid discriminatory targeting.
- Implement transparent data usage policies.

Brand Integration:
Company: ${COMPANY_NAME}
Website: ${WEBSITE_URL}
Slogan: "${SLOGAN}"

Always maintain ethical advertising standards. Provide a comprehensive personalized advertising plan based on user input, strictly adhering to the JSON output format and guidelines.
`;

export const INITIAL_AI_MESSAGE = "How can I assist you with your personalized advertising campaign today? Please select an option below or type a custom request.";

export const INITIAL_CHOICES: ChoiceOption[] = [
  { id: 'segmentation', text: 'Help with Customer Segmentation' },
  { id: 'personalization', text: 'Suggest Content Personalization' },
  { id: 'analysis', text: 'Analyze User Behavior' },
  { id: 'optimization', text: 'Optimize my Campaign' },
  { id: 'prediction', text: 'Predict Campaign Performance' },
  { id: 'custom', text: 'Enter a custom request', isCustomInputTrigger: true },
];

export const BACK_TO_MAIN_CHOICES_ID = 'back_to_main_choices';
export const DOWNLOAD_ICON_ARIA_LABEL = 'Download report as PDF';

export const SPEECH_RECOGNITION_LANGUAGES: SpeechRecognitionLanguage[] = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'fr-CA', name: 'French (Canada)' },
  { code: 'de-DE', name: 'German' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'es-MX', name: 'Spanish (Mexico)' },
];