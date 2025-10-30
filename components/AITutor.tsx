import React, { useState, useRef, useEffect, useCallback } from 'react';
import { runAiTutorQuery } from '../services/geminiService';
import type { ChatMessage } from '../types';

interface AITutorProps {
    isOpen: boolean;
    onClose: () => void;
}

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
);

export const AITutor: React.FC<AITutorProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setMessages([
                { sender: 'ai', text: 'Hello! I am CryptoGPT. How can I help you learn about crypto, blockchain, or trading today?' }
            ]);
            setInput('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = useCallback(async () => {
        if (input.trim() === '' || isLoading) return;

        const newUserMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await runAiTutorQuery(input);
            const cleanedResponse = aiResponse.replace(/[*#]/g, '');
            const newAiMessage: ChatMessage = { sender: 'ai', text: cleanedResponse };
            setMessages(prev => [...prev, newAiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { sender: 'ai', text: 'Sorry, something went wrong. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }, [input, isLoading]);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
            
            <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 z-50 w-full h-full md:w-[calc(100vw-3rem)] md:max-w-md md:h-[calc(100vh-6rem)] md:max-h-[600px] bg-white dark:bg-dark-card rounded-none md:rounded-lg shadow-2xl flex flex-col animate-slide-up">
                <div className="p-4 bg-primary-blue dark:bg-primary-green text-white dark:text-primary-blue font-bold rounded-t-lg flex justify-between items-center">
                    <h2>CryptoGPT Tutor</h2>
                    <button onClick={onClose} className="text-xl">&times;</button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-primary-green text-primary-blue' : 'bg-gray-200 dark:bg-dark-bg text-gray-800 dark:text-gray-200'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start mb-4">
                            <div className="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-gray-200 dark:bg-dark-bg text-gray-800 dark:text-gray-200">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
                                    <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center bg-gray-100 dark:bg-dark-bg rounded-lg">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask about crypto..."
                            className="flex-grow bg-transparent px-4 py-3 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={handleSendMessage} disabled={isLoading} className="p-3 text-primary-green disabled:text-gray-400">
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};