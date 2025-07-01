
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChatMessage, 
  ChoiceOption, 
  SpeechRecognitionLanguage, 
  ResponseVerbosity, 
  SpeechRecognition,
  SpeechRecognitionEvent, // Added import
  SpeechRecognitionErrorEvent // Added import
} from '../types';
import { geminiService } from '../services/geminiService';
import MessageBubble from './MessageBubble';
import LoadingSpinner from './LoadingSpinner';
import { INITIAL_AI_MESSAGE, INITIAL_CHOICES, BACK_TO_MAIN_CHOICES_ID, SPEECH_RECOGNITION_LANGUAGES, CHATBOT_AVATAR_URL } from '../constants';
import { MicIcon, MicOffIcon } from './icons'; 

const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognitionInstance: SpeechRecognition | null = null;
if (SpeechRecognitionAPI) {
    recognitionInstance = new SpeechRecognitionAPI();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true; 
} else {
    console.warn("Speech Recognition API not supported in this browser.");
}

interface ChatInterfaceProps {
  responseVerbosity: ResponseVerbosity;
  chatClearTrigger: number;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ responseVerbosity, chatClearTrigger }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'choices' | 'text'>('choices');
  const [currentChoices, setCurrentChoices] = useState<ChoiceOption[]>(INITIAL_CHOICES);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [selectedSpeechLanguage, setSelectedSpeechLanguage] = useState<string>(SPEECH_RECOGNITION_LANGUAGES[0].code);
  const initialChatClearTrigger = useRef(chatClearTrigger);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); 

  const resetChatToInitial = useCallback(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: INITIAL_AI_MESSAGE,
        timestamp: Date.now(),
      },
    ]);
    setCurrentChoices(INITIAL_CHOICES);
    setInputMode('choices');
    setUserInput('');
    if(recognitionInstance && isListening) recognitionInstance.abort();
    setIsListening(false);
  }, [isListening]);

  useEffect(() => {
    resetChatToInitial();
  }, []); // Initial load

  useEffect(() => {
    // Only clear if the trigger has changed from its initial value on component mount
    // and is not the same as the very first trigger value (e.g. 0).
    // This prevents clearing on initial load if trigger is 0, but clears on subsequent changes.
    if (chatClearTrigger !== initialChatClearTrigger.current) {
        resetChatToInitial();
        initialChatClearTrigger.current = chatClearTrigger; // Update ref to current trigger
    }
  }, [chatClearTrigger, resetChatToInitial]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (inputMode === 'text' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputMode]);
  
  const processMessageToAI = useCallback(async (messageText: string) => {
    setIsLoading(true);
    setInputMode('text'); 

    try {
      const aiResponse = await geminiService.generatePersonalizedAdPlan(messageText, responseVerbosity);
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: "Here's your personalized advertising plan:", 
        structuredResponse: aiResponse,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);

      if (aiResponse.suggestedFollowUps && aiResponse.suggestedFollowUps.length > 0) {
        setCurrentChoices([
          ...aiResponse.suggestedFollowUps,
          { id: BACK_TO_MAIN_CHOICES_ID, text: 'Show initial options' }
        ]);
      } else {
        setCurrentChoices(INITIAL_CHOICES);
      }
      setInputMode('choices'); 

    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessageContent = error instanceof Error ? error.message : String(error);
      const aiErrorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: `Sorry, I encountered an error processing your request. ${errorMessageContent}`,
        error: errorMessageContent,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiErrorMessage]);
      setCurrentChoices(INITIAL_CHOICES); 
      setInputMode('choices');
    } finally {
      setIsLoading(false);
    }
  }, [responseVerbosity]);

  const handleChoiceSelected = useCallback(async (choice: ChoiceOption) => {
    if (isLoading) return;

    if (choice.id === BACK_TO_MAIN_CHOICES_ID) {
      setCurrentChoices(INITIAL_CHOICES);
      setInputMode('choices');
      setUserInput('');
      return;
    }
    
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: choice.text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);

    if (choice.isCustomInputTrigger) {
      setInputMode('text');
      setUserInput('');
      setCurrentChoices(INITIAL_CHOICES); 
    } else {
      await processMessageToAI(choice.text);
    }
  }, [isLoading, processMessageToAI]);
  
  const handleTextInputSubmit = useCallback(async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: userInput.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = userInput.trim();
    setUserInput('');
    
    await processMessageToAI(currentInput);
  }, [userInput, isLoading, processMessageToAI]);

  const toggleListening = () => {
    if (!recognitionInstance) {
        alert("Speech recognition is not supported by your browser.");
        return;
    }
    if (isListening) {
        recognitionInstance.stop();
        setIsListening(false);
    } else {
        recognitionInstance.lang = selectedSpeechLanguage;
        recognitionInstance.onstart = () => setIsListening(true);
        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => { 
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // Smart append: avoid duplicating parts of finalTranscript if interim already had it
            setUserInput(prevInput => {
                let newText = prevInput;
                if (finalTranscript && !prevInput.endsWith(finalTranscript.trim())) { // Check if final exists and not already appended
                    newText += (prevInput.length > 0 && !prevInput.endsWith(' ') ? ' ' : '') + finalTranscript.trim();
                }
                if (interimTranscript) {
                    if (newText.length > 0 && !newText.endsWith(' ')) newText += ' ';
                     // Only append the truly new part of interim
                    let lastWordOfNewText = newText.trim().split(' ').pop()?.toLowerCase();
                    let firstWordOfInterim = interimTranscript.trim().split(' ')[0]?.toLowerCase();
                    if(lastWordOfNewText && firstWordOfInterim && lastWordOfNewText === firstWordOfInterim && newText.endsWith(interimTranscript.trim().split(' ')[0])) {
                         // Likely overlap, take substring
                        newText += interimTranscript.trim().substring(firstWordOfInterim.length).trimLeft();
                    } else {
                        newText += interimTranscript.trim();
                    }
                }
                return newText.trimStart();
            });
        };
        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => { 
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            alert(`Speech recognition error: ${event.error}`);
        };
        recognitionInstance.onend = () => {
            setIsListening(false);
            if (userInput.trim()) { 
               inputRef.current?.focus();
            }
        };
        try {
            recognitionInstance.start();
        } catch (e) {
            console.error("Error starting speech recognition:", e);
            setIsListening(false);
            alert("Could not start speech recognition. Please ensure microphone permission is granted and no other app is using the mic.");
        }
    }
  };


  return (
    <div className="w-full flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-300 dark:border-brand-primary/30 transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-brand-secondary dark:text-brand-primary text-center">Personalized Advertising Assistant</h2>
      </div>
      
      <div className="flex-grow p-6 space-y-6 overflow-y-auto bg-gray-100 dark:bg-gray-700/50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && messages[messages.length-1]?.sender === 'user' && ( 
          <div className="flex justify-start items-center space-x-2 py-2 pl-12"> 
            <img src={CHATBOT_AVATAR_URL} alt="AI Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0" />
            <LoadingSpinner />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {isLoading && inputMode === 'choices' && !messages.some(m => m.sender === 'user' && isLoading) && ( 
        <div className="p-4 flex justify-center items-center border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && inputMode === 'choices' && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {currentChoices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelected(choice)}
                disabled={isLoading}
                aria-label={choice.text}
                className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                  ${choice.isCustomInputTrigger 
                    ? 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-100 dark:text-gray-200 focus:ring-gray-400' 
                    : choice.id === BACK_TO_MAIN_CHOICES_ID 
                        ? 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500 text-white focus:ring-teal-400'
                        : 'bg-brand-primary hover:bg-yellow-300 text-brand-secondary font-medium focus:ring-yellow-400'
                  } 
                  disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {inputMode === 'text' && (
        <form onSubmit={handleTextInputSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            {SpeechRecognitionAPI && (
              <div className="flex-shrink-0 relative">
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                  className={`p-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 ${
                    isListening ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 animate-pulse' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 focus:ring-gray-400'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {isListening ? <MicOffIcon className="w-5 h-5" /> : <MicIcon className="w-5 h-5" />}
                </button>
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your request or use the microphone..."
              className="flex-grow p-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              disabled={isLoading || isListening}
              aria-label="Custom request input"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim() || isListening}
              className="px-5 py-3 bg-brand-primary text-brand-secondary font-semibold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <button
              type="button"
              onClick={() => { setInputMode('choices'); setUserInput(''); setCurrentChoices(INITIAL_CHOICES); if(recognitionInstance && isListening) recognitionInstance.abort(); setIsListening(false);}}
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-brand-primary underline disabled:opacity-60 disabled:text-gray-500"
              disabled={isLoading}
            >
              Show initial options
            </button>
            {SpeechRecognitionAPI && (
              <select
                value={selectedSpeechLanguage}
                onChange={(e) => setSelectedSpeechLanguage(e.target.value)}
                disabled={isListening || isLoading}
                className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 p-1 rounded border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-brand-primary focus:outline-none"
                aria-label="Select speech recognition language"
              >
                {SPEECH_RECOGNITION_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatInterface;
