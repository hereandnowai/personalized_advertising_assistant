export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  structuredResponse?: StructuredResponse | null;
  error?: string | null;
  timestamp: number;
}

export interface StructuredResponse {
  audienceInsights?: string;
  personalizationStrategy?: string;
  creativeSuggestions?: string;
  channelRecommendations?: string;
  successMetrics?: string;
  suggestedFollowUps?: ChoiceOption[];
}

export interface ContactInfo {
  email: string;
  mobile: string;
  website: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface ChoiceOption {
  id: string;
  text: string;
  isCustomInputTrigger?: boolean; // If true, selecting this choice switches to text input mode
}

export type Page = 'home' | 'assistant' | 'about' | 'settings';

export interface SpeechRecognitionLanguage {
  code: string;
  name: string;
}

export type Theme = 'light' | 'dark';
export type ResponseVerbosity = 'concise' | 'detailed';

// Web Speech API Type Definitions
export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly interpretation?: any;
  readonly emma?: Document | null;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

export interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

export interface SpeechGrammar {
  src: string;
  weight?: number;
}
export interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
}
export declare var SpeechGrammarList: {
  prototype: SpeechGrammarList;
  new(): SpeechGrammarList;
};

export interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string; // Deprecated but part of the spec

  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

  abort(): void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
    SpeechGrammarList: typeof SpeechGrammarList;
    webkitSpeechGrammarList: typeof SpeechGrammarList;
    SpeechRecognitionEvent: { new(type: string, eventInitDict: any): SpeechRecognitionEvent; };
    webkitSpeechRecognitionEvent: { new(type: string, eventInitDict: any): SpeechRecognitionEvent; };
  }
}