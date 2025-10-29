import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from '../types';
import { getChatResponseStream, getComplexResponse, getWebResponse } from '../services/geminiService';
import SendIcon from './icons/SendIcon';
import SparklesIcon from './icons/SparklesIcon';
import LoadingSpinner from './ui/LoadingSpinner';
import GlobeIcon from './icons/GlobeIcon';

const AiCoachChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleInitialMessage = useCallback(async () => {
    setIsLoading(true);
    setMessages([]);
    try {
        const stream = await getChatResponseStream([], "Merhaba");
        let modelResponse = '';
        for await (const chunk of stream) {
            modelResponse += chunk.text;
            setMessages([{ role: 'model', parts: [{ text: modelResponse }] }]);
        }
    } catch (error) {
        console.error("Error fetching initial greeting:", error);
        setMessages([{ role: 'model', parts: [{ text: "Merhaba, size yardımcı olurken bir sorunla karşılaştım. Lütfen daha sonra tekrar deneyin." }] }]);
    } finally {
        setIsLoading(false);
    }
  },[]);

  useEffect(() => {
    if (messages.length === 0) {
      handleInitialMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async () => {
    const currentInput = input.trim();
    if (!currentInput || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: currentInput }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await getChatResponseStream(messages, currentInput);
      let modelResponse = '';
      setMessages([...newMessages, { role: 'model', parts: [{ text: '' }] }]); 

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages([...newMessages, { role: 'model', parts: [{ text: modelResponse }] }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplexQuery = async () => {
    const currentInput = input.trim();
    if (!currentInput || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: currentInput }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Karmaşık sorunuzu düşünüyorum..." }] }]);
      const response = await getComplexResponse(currentInput);
      setMessages([...newMessages, { role: 'model', parts: [{ text: response }] }]);
    } catch (error) {
      console.error("Error with complex query:", error);
      setMessages([...newMessages, { role: 'model', parts: [{ text: "Üzgünüm, karmaşık sorunuzu işlerken bir hata oluştu." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebSearch = async () => {
    const currentInput = input.trim();
    if (!currentInput || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: currentInput }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
        setMessages([...newMessages, { role: 'model', parts: [{ text: "Web'de arama yapıyorum..." }] }]);
        const { text, sources } = await getWebResponse(currentInput);
        setMessages([...newMessages, { role: 'model', parts: [{ text }], sources }]);
    } catch (error) {
        console.error("Error with web search:", error);
        setMessages([...newMessages, { role: 'model', parts: [{ text: "Üzgünüm, web'de arama yaparken bir hata oluştu." }] }]);
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-150px)]">
      <div className="flex-grow overflow-y-auto pr-2 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end animate-slide-in-from-right' : 'justify-start animate-slide-in-from-left'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-emerald-500 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none shadow-sm'}`}>
              <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 border-t pt-2">
                    <h4 className="text-xs font-bold mb-1 text-slate-500">Kaynaklar:</h4>
                    <ul className="space-y-1">
                        {msg.sources.map((source, i) => (
                            <li key={i}>
                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-700 hover:underline break-all">
                                    {i + 1}. {source.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-slate-700 rounded-2xl rounded-bl-none shadow-sm p-4 animate-pulse">
              <LoadingSpinner />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 border-t pt-4 bg-slate-50">
        <div className="flex items-center space-x-2 bg-white rounded-full shadow-md p-2 focus-within:ring-2 focus-within:ring-emerald-400 transition-shadow">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Sorunuzu yazın..."
            className="w-full bg-transparent focus:outline-none px-4"
            disabled={isLoading}
          />
          <button onClick={handleWebSearch} disabled={isLoading} className="p-2 text-slate-500 hover:text-blue-500 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50" title="Web'de Ara (Güncel Bilgi)">
            <GlobeIcon />
          </button>
          <button onClick={handleComplexQuery} disabled={isLoading} className="p-2 text-slate-500 hover:text-purple-500 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50" title="Karmaşık Soru Sor (Daha Yavaş)">
            <SparklesIcon />
          </button>
          <button onClick={handleSend} disabled={isLoading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCoachChat;