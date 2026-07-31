import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import api from '../Api/api';
import { useAuth } from './AuthProvider';

const AdminSupportChat = () => {
    const [messages, setMessages] = useState([]);
    const [connection, setConnection] = useState(null);

    const [aiMessages, setAiMessages] = useState([
        { senderId: 'ai-assistant', message: "System Admin AI online. I have full clearance to discuss inventory and carts. How can I help?" }
    ]);
    const [isAiTyping, setIsAiTyping] = useState(false);

    const [inputText, setInputText] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState('ai-assistant'); 

    const messagesEndRef = useRef(null);
    const { userId } = useAuth();

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

        return () => { connection?.stop(); };
    }, [userId]);

    // ==========================================
    // CRITICAL FIX: Synchronous Listener & Deduplication
    // ==========================================
    useEffect(() => {
        if (!connection) return;

        const handleIncomingMessage = (newMessage) => {
            setMessages((prev) => {
                // Prevent duplicate messages if the server echoes our own message back
                const exists = prev.find(m => 
                    m.id === newMessage.id || 
                    (String(m.id).startsWith('temp-') && String(m.senderId) === String(newMessage.senderId) && m.message === newMessage.message)
                );
                
                if (exists) {
                    // Replace our temporary optimistic message with the real one from the database
                    return prev.map(m => m === exists ? newMessage : m);
                }
                
                return [...prev, newMessage];
            });
        };

        // Attach listener OUTSIDE of the .start() promise to prevent double-bindings
        connection.on("ReceiveMessage", handleIncomingMessage);

        if (connection.state === 'Disconnected') {
            connection.start().catch(e => console.error("SignalR Error: ", e));
        }

        return () => { 
            connection.off("ReceiveMessage", handleIncomingMessage); 
        };
    }, [connection]);

    const activeCustomers = useMemo(() => {
        const customerMap = new Map();
        messages.forEach(msg => {
            if (msg.senderId && String(msg.senderId) !== String(userId)) {
                if (!customerMap.has(msg.senderId)) {
                    customerMap.set(msg.senderId, { id: msg.senderId, name: msg.senderName || `Customer #${msg.senderId}`, pic: msg.senderProfilePic });
                }
            }
            const targetId = msg.receiverId || msg.recieverId;
            if (targetId && String(targetId) !== String(userId)) {
                if (!customerMap.has(targetId)) {
                    customerMap.set(targetId, { id: targetId, name: msg.receiverName || `Customer #${targetId}`, pic: msg.receiverProfilePic });
                }
            }
        });
        return Array.from(customerMap.values());
    }, [messages, userId]);

    const aiContact = { id: 'ai-assistant', name: 'AI Store Manager', isAi: true };
    const allContacts = [aiContact, ...activeCustomers];

    const isAiSelected = selectedCustomerId === 'ai-assistant';
    const currentConversation = useMemo(() => {
        if (!selectedCustomerId) return [];
        if (isAiSelected) return aiMessages;

        return messages.filter(msg => {
            const targetId = msg.receiverId || msg.recieverId;
            return String(msg.senderId) === String(selectedCustomerId) || String(targetId) === String(selectedCustomerId);
        });
    }, [messages, aiMessages, selectedCustomerId, isAiSelected]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [currentConversation]);

    const selectedCustomer = allContacts.find(c => String(c.id) === String(selectedCustomerId));

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (!inputText.trim() || !selectedCustomerId) return;

        const textToSend = inputText;
        setInputText("");

        if (isAiSelected) {
            const newUserMsg = { senderId: userId, message: textToSend };
            setAiMessages(prev => [...prev, newUserMsg]);
            setIsAiTyping(true);

            try {
                const response = await api.post('/api/Assistant/ask', {
                    UserMessage: textToSend
                });

                const aiReply = { senderId: 'ai-assistant', message: response.data.reply };
                setAiMessages(prev => [...prev, aiReply]);
            } catch (error) {
                console.error("AI Error:", error);
                setAiMessages(prev => [...prev, { senderId: 'ai-assistant', message: "Error communicating with Groq." }]);
            } finally {
                setIsAiTyping(false);
            }
        } else {
            // ==========================================
            // CRITICAL FIX: Optimistic UI Update
            // ==========================================
            // Instantly show the message on screen without waiting for the server
            const optimisticMsg = {
                id: `temp-${Date.now()}`,
                senderId: userId,
                receiverId: selectedCustomerId,
                message: textToSend,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, optimisticMsg]);

            try {
                await connection.invoke("SendMessageToCustomer", selectedCustomerId, textToSend);
            } catch (error) {
                console.error("Failed to send message: ", error);
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-[#F2F0F1] py-6 md:py-10 px-4 md:px-10 font-sans">
            <div className={`max-w-7xl mx-auto mb-6 px-2 ${selectedCustomerId ? 'hidden md:block' : 'block'}`}>
                <h1 className="font-integral font-bold text-[32px] md:text-[40px] leading-none">SUPPORT DESK</h1>
                <p className="text-[#9A9A9A] mt-2">Manage customer conversations and system AI.</p>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-[85vh] md:h-[75vh]">

                {/* LEFT PANE */}
                <div className={`w-full md:w-1/3 bg-white rounded-3xl shadow-sm border border-gray-100 flex-col overflow-hidden ${selectedCustomerId ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-sans font-bold text-[18px]">Conversations</h3>
                    </div>

                    <ul className="flex-1 overflow-y-auto m-0 p-3 list-none space-y-2">
                        {allContacts.map(contact => (
                            <li
                                key={contact.id}
                                onClick={() => setSelectedCustomerId(contact.id)}
                                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${selectedCustomerId === contact.id
                                    ? 'bg-black text-white shadow-md'
                                    : 'bg-white text-black hover:bg-[#F2F0F1] border border-transparent'
                                    }`}
                            >
                                {contact.isAi ? (
                                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl shadow-sm">
                                        🤖
                                    </div>
                                ) : contact.pic ? (
                                    <img src={contact.pic} alt={contact.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                                ) : (
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-[18px] ${selectedCustomerId === contact.id ? 'bg-white text-black' : 'bg-[#F0F0F0] text-[#9A9A9A]'}`}>
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div>
                                    <p className="font-semibold text-[16px]">{contact.name}</p>
                                    <p className={`text-xs mt-1 ${selectedCustomerId === contact.id ? 'text-gray-300' : 'text-[#9A9A9A]'}`}>
                                        {contact.isAi ? 'System Assistant' : 'Tap to view chat'}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* RIGHT PANE */}
                <div className={`w-full md:w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 flex-col overflow-hidden relative ${!selectedCustomerId ? 'hidden md:flex' : 'flex'}`}>

                    {/* Header */}
                    <div className="px-5 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-gray-100 bg-white z-10">
                        <div className="flex items-center">
                            <button onClick={() => setSelectedCustomerId(null)} className="md:hidden p-2 mr-3 -ml-2 rounded-full bg-[#F2F0F1] text-black">
                                ←
                            </button>
                            <div>
                                <h3 className="font-integral font-bold text-[20px] md:text-[24px]">
                                    {selectedCustomer ? selectedCustomer.name : 'Select a conversation'}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col gap-5 bg-[#FAFAFA]">
                        {currentConversation.map((msg, index) => {
                            const isMe = String(msg.senderId) === String(userId);
                            return (
                                <div key={index} className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                                    <span className={`px-5 py-3 md:px-6 md:py-3.5 text-[15px] leading-relaxed shadow-sm ${isMe ? 'bg-black text-white rounded-3xl rounded-tr-sm' : 'bg-white text-black border border-gray-100 rounded-3xl rounded-tl-sm'
                                        }`}>
                                        {msg.message}
                                    </span>
                                </div>
                            );
                        })}

                        {isAiTyping && isAiSelected && (
                            <div className="self-start bg-white text-black border border-gray-100 rounded-3xl rounded-tl-sm px-6 py-3.5">
                                <span className="animate-pulse">Analyzing store data...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 md:p-6 bg-white border-t border-gray-100 relative z-10">
                        <form onSubmit={handleSendMessage} className={`flex items-center rounded-full p-2 w-full transition-colors border ${selectedCustomerId ? 'bg-[#F2F0F1] border-gray-200 focus-within:bg-white' : 'bg-gray-50 opacity-60'}`}>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={!selectedCustomerId}
                                placeholder={isAiSelected ? "Ask the AI Assistant..." : "Write your reply..."}
                                className="bg-transparent outline-none flex-1 px-4 md:px-6 text-[15px] text-black placeholder-[#9A9A9A]"
                            />
                            <button type="submit" disabled={!selectedCustomerId || !inputText.trim()} className={`px-5 py-3 md:px-8 md:py-3.5 rounded-full font-semibold transition-transform shrink-0 ${inputText.trim() ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
                                Send
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminSupportChat;
