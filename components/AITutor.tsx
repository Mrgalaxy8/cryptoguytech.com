
import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini, ChatMessage } from '../services/geminiService';

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 7.5h-9v9h9v-9z" />
        <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15a3 3 0 01-3 3h-.75v.75a.75.75 0 01-1.5 0v-.75h-2.25v.75a.75.75 0 01-1.5 0v-.75H9v.75A.75.75 0 017.5 21v-.75a3 3 0 01-3-3v-.75H3.75a.75.75 0 010-1.5h.75V12.75H3.75a.75.75 0 010-1.5h.75V9a3 3 0 013-3h.75V5.25a.75.75 0 01.75-.75zm-3 5.25a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h11.25a1.5 1.5 0 001.5-1.5v-6a1.5 1.5 0 00-1.5-1.5H5.25z" clipRule="evenodd" />
    </svg>
);

export const AITutor: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: "Hello! I'm CryptoGuy, your personal AI Tutor. I can help you understand Bitcoin, DeFi, and the latest crypto news. Ask me anything!" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const botResponse = await chatWithGemini(messages, input);
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please check your internet connection and try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col max-w-4xl">
            <div className="flex-none mb-6 text-center animate-fade-in">
                <h1 className="text-3xl font-black text-primary-blue dark:text-white">
                    AI Crypto<span className="text-primary-green">Tutor</span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Powered by Gemini 3 Pro. Real-time news & simplified explanations.
                </p>
            </div>

            {/* Chat Window */}
            <div className="flex-grow bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col animate-slide-up">
                
                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                                    msg.role === 'user' ? 'bg-primary-blue text-white' : 'bg-primary-green text-white'
                                }`}>
                                    {msg.role === 'user' ? <UserIcon className="w-5 h-5" /> : <BotIcon className="w-6 h-6" />}
                                </div>

                                {/* Bubble */}
                                <div className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-primary-blue text-white rounded-tr-none' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-700'
                                }`}>
                                    <div className="whitespace-pre-wrap font-medium">
                                        {/* Simple formatting for bullet points if raw text doesn't parse perfectly */}
                                        {msg.text.split('\n').map((line, i) => (
                                            <p key={i} className={`min-h-[1.2em] ${line.trim().startsWith('*') || line.trim().startsWith('-') ? 'pl-4' : ''}`}>
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                    
                                    {/* Sources Display */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-4 pt-3 border-t border-gray-300 dark:border-gray-600">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Sources:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((source, idx) => (
                                                    <a 
                                                        key={idx} 
                                                        href={source.uri} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-xs bg-white dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded px-2 py-1 hover:text-primary-green hover:border-primary-green transition-colors truncate max-w-[150px]"
                                                    >
                                                        {source.title}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-green text-white flex items-center justify-center">
                                    <BotIcon className="w-6 h-6" />
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-50 dark:bg-dark-bg border-t border-gray-200 dark:border-gray-700">
                    <div className="relative flex items-center">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about crypto, blockchain trends, or prices..."
                            className="w-full bg-white dark:bg-dark-card text-gray-900 dark:text-white rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-green focus:border-transparent pl-4 pr-12 py-3 resize-none h-14 shadow-inner text-sm sm:text-base"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 bg-primary-green text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-md"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-gray-400 mt-2">
                        AI can make mistakes. Always verify important financial information.
                    </p>
                </div>
            </div>
        </div>
    );
};
