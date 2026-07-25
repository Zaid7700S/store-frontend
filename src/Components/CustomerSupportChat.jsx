import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import api from '../Api/api';
import { useAuth } from './AuthProvider';
import msgIcon from '../assets/msg.svg';

const CustomerSupportChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'live'

    // Live Chat State
    const [messages, setMessages] = useState([]);
    const [connection, setConnection] = useState(null);

    // AI Chat State
    const [aiMessages, setAiMessages] = useState([
        { senderId: 'ai', message: "Hi! I'm your AI shopping assistant. How can I help you today?" }
    ]);
    const [isAiTyping, setIsAiTyping] = useState(false);

    const [inputText, setInputText] = useState("");
    const messagesEndRef = useRef(null);
    const { userId } = useAuth();

    // --- SignalR Setup (Unchanged) ---
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/api/chat/history');
                setMessages(response.data);
            } catch (error) {
                console.error("Failed to fetch chat history", error);
            }
        };

        fetchHistory().then(() => {
            const newConnection = new HubConnectionBuilder()
                .withUrl("https://store-backend-ilsn.onrender.com/chathub", {
                    accessTokenFactory: () => localStorage.getItem('accessToken')
                })
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();
            setConnection(newConnection);
        });
    }, [userId]);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    connection.on("ReceiveMessage", (newMessage) => {
                        setMessages((prev) => [...prev, newMessage]);
                    });
                })
                .catch(e => console.error("SignalR Connection Error: ", e));
        }
        return () => {
            if (connection) connection.off("ReceiveMessage");
        };
    }, [connection]);

    // --- Auto Scroll ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, aiMessages, isOpen, activeTab]);

    // --- Handle Sending ---
    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const textToSend = inputText;
        setInputText("");

        if (activeTab === 'live') {
            try {
                await connection.invoke("SendMessageToAdmin", textToSend);
            } catch (error) {
                console.error("Failed to send message: ", error);
            }
        } else {
            // Handle AI Request
            const newUserMsg = { senderId: userId, message: textToSend };
            setAiMessages(prev => [...prev, newUserMsg]);
            setIsAiTyping(true);

            try {
                const response = await api.post('/api/Assistant/ask', {
                    UserMessage: textToSend
                });

                const aiReply = { senderId: 'ai', message: response.data.reply };
                setAiMessages(prev => [...prev, aiReply]);
            } catch (error) {
                console.error("AI Error:", error);
                setAiMessages(prev => [...prev, { senderId: 'ai', message: "Sorry, I'm having trouble connecting right now." }]);
            } finally {
                setIsAiTyping(false);
            }
        }
    };

    // --- Render Helpers ---
    const currentMessages = activeTab === 'live' ? messages : aiMessages;

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform cursor-pointer flex items-center justify-center h-16 w-16"
                >
                    <img src={msgIcon} alt="Chat" className="w-8 h-8 filter invert" />
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">

                    {/* Header */}
                    <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-integral font-bold text-[20px]">SHOP.CO Support</h3>
                            <p className="text-xs text-gray-300 font-sans">How can we help?</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300 font-bold text-xl cursor-pointer">
                            ×
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50">
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'ai' ? 'border-b-2 border-black text-black bg-white' : 'text-gray-500 hover:text-black'}`}
                        >
                            🤖 AI Assistant
                        </button>
                        <button
                            onClick={() => setActiveTab('live')}
                            className={`flex-1 py-3 text-sm font-semibold transition-colors ${activeTab === 'live' ? 'border-b-2 border-black text-black bg-white' : 'text-gray-500 hover:text-black'}`}
                        >
                            👨‍💻 Live Agent
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="bg-[#F2F0F1] h-72 overflow-y-auto p-4 flex flex-col gap-3">
                        {currentMessages.length === 0 ? (
                            <p className="text-center text-[#9A9A9A] text-sm mt-auto mb-auto">
                                No messages yet.
                            </p>
                        ) : (
                            currentMessages.map((msg, index) => {
                                const isMe = String(msg.senderId) === String(userId);
                                return (
                                    <div key={index} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}>
                                        <div className={`px-4 py-2 text-[14px] ${isMe ? 'bg-black text-white rounded-2xl rounded-tr-sm' : 'bg-white text-black border border-gray-200 rounded-2xl rounded-tl-sm'}`}>
                                            {msg.message}
                                        </div>
                                    </div>
                                );
                            })
                        )}

                        {isAiTyping && activeTab === 'ai' && (
                            <div className="self-start bg-white text-black border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 text-[14px]">
                                <span className="animate-pulse">Thinking...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="flex items-center bg-[#F0F0F0] rounded-full px-4 h-12 w-full">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message..."
                                className="bg-transparent outline-none w-full text-[14px] text-black placeholder-[#9A9A9A]"
                            />
                            <button type="submit" className="text-black font-semibold text-[14px] hover:text-gray-600 transition cursor-pointer ml-2">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerSupportChat;
