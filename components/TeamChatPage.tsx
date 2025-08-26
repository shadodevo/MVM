import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../hooks/useApp';
import { Employee, ChatMessage, ChatConversation, MessageStatus } from '../types';
import { SearchIcon, SendIcon, PaperclipIcon, SmileIcon, MicIcon, CheckIcon, CheckAllIcon, MoreVerticalIcon, XIcon, ReplyIcon, ShareIcon, CornerUpLeftIcon, FileIcon } from './icons/Icons';

const CURRENT_USER_ID = '2'; // Hardcoded for 'Ali erkan karakurt'

const MessageStatusIcon: React.FC<{ status: MessageStatus }> = ({ status }) => {
    if (status === 'sent') {
        return <CheckIcon className="w-4 h-4 text-gray-400" />;
    }
    if (status === 'delivered') {
        return <CheckAllIcon className="w-4 h-4 text-gray-400" />;
    }
    if (status === 'seen') {
        return <CheckAllIcon className="w-4 h-4 text-blue-500" />;
    }
    return null;
};

const ForwardModal: React.FC<{ onClose: () => void, onForward: (targetChatIds: string[]) => void }> = ({ onClose, onForward }) => {
    const { t } = useTranslation();
    const { chatConversations } = useApp();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleToggleSelection = (chatId: string) => {
        setSelectedIds(prev =>
            prev.includes(chatId)
                ? prev.filter(id => id !== chatId)
                : [...prev, chatId]
        );
    };
    
    const handleForwardClick = () => {
        if (selectedIds.length > 0) {
            onForward(selectedIds);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('forward_to')}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                        <XIcon className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    <ul className="space-y-2">
                        {chatConversations.map(conv => (
                            <li
                                key={conv.id}
                                onClick={() => handleToggleSelection(conv.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${selectedIds.includes(conv.id) ? 'bg-blue-100 dark:bg-blue-900/50 ring-2 ring-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                            >
                                <img src={conv.avatar} alt={conv.name} className="w-10 h-10 rounded-full" />
                                <span className="font-semibold text-gray-800 dark:text-white">{conv.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="flex justify-end items-center p-4 border-t border-gray-200 dark:border-gray-700 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">{t('cancel')}</button>
                    <button onClick={handleForwardClick} disabled={selectedIds.length === 0} className="px-4 py-2 ml-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">{t('forward')}</button>
                </div>
            </div>
        </div>
    );
};

const ChatMessageBubble: React.FC<{ message: ChatMessage; sender?: Employee; onReply: (msg: ChatMessage) => void; onForward: (msg: ChatMessage) => void; }> = ({ message, sender, onReply, onForward }) => {
    const isMe = message.senderId === CURRENT_USER_ID;
    const { chatMessages, employees } = useApp();
    const { t } = useTranslation();

    const originalMessage = message.replyToMessageId ? chatMessages.find(m => m.id === message.replyToMessageId) : null;
    const originalSender = originalMessage ? employees.find(e => e.id === originalMessage.senderId) : null;

    return (
        <div className={`flex items-end gap-2 group ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && sender && <img src={sender.avatar} alt={sender.name} className="w-8 h-8 rounded-full self-end" />}
                <div className={`max-w-md md:max-w-lg p-3 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-lg'}`}>
                    {message.forwardedFrom && (
                        <p className="text-xs font-semibold mb-1 flex items-center gap-1 opacity-70"><ShareIcon className="w-3 h-3"/> {t('forwarded_message')}</p>
                    )}
                    {originalMessage && (
                        <div className="p-2 border-l-2 border-blue-300 dark:border-blue-400 bg-black/10 dark:bg-black/20 rounded-md mb-2">
                            <p className="font-bold text-xs">{originalSender?.name || 'Unknown'}</p>
                            <p className="text-xs opacity-80 truncate">{originalMessage.text}</p>
                        </div>
                    )}
                    
                    {message.attachment ? (
                         <div className="flex items-center gap-3">
                            {message.attachment.type === 'image' ? (
                                <img src={message.attachment.url} alt={message.attachment.name} className="max-w-[200px] rounded-lg" />
                            ) : (
                               <div className="flex items-center gap-2 p-2 bg-black/10 rounded-lg">
                                 <FileIcon className="w-8 h-8"/>
                                 <div>
                                     <p className="font-semibold text-sm">{message.attachment.name}</p>
                                     <p className="text-xs opacity-80">{message.attachment.size}</p>
                                 </div>
                               </div>
                            )}
                        </div>
                    ) : (
                         <p className="text-sm break-words">{message.text}</p>
                    )}

                    <div className="flex items-center justify-end gap-1 mt-1">
                        <p className={`text-xs ${isMe ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {isMe && <MessageStatusIcon status={message.status} />}
                    </div>
                </div>
                 <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onReply(message)} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><ReplyIcon className="w-4 h-4"/></button>
                    <button onClick={() => onForward(message)} className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"><ShareIcon className="w-4 h-4"/></button>
                </div>
            </div>
        </div>
    );
};

const MessagesPage: React.FC = () => {
    const { t } = useTranslation();
    const { employees, chatMessages, setChatMessages, chatConversations } = useApp();
    const [activeChatId, setActiveChatId] = useState<string>(chatConversations[0]?.id || '');
    const [messageText, setMessageText] = useState('');
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [forwardingMessage, setForwardingMessage] = useState<ChatMessage | null>(null);
    const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const activeConversation = useMemo(() => chatConversations.find(c => c.id === activeChatId), [activeChatId, chatConversations]);
    
    const activeChatMessages = useMemo(() => {
        return chatMessages
            .filter(msg => msg.chatId === activeChatId)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [chatMessages, activeChatId]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChatMessages]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [emojiPickerRef]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !activeChatId) return;

        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            chatId: activeChatId,
            senderId: CURRENT_USER_ID,
            text: messageText.trim(),
            timestamp: new Date().toISOString(),
            status: 'sent',
            replyToMessageId: replyingTo ? replyingTo.id : undefined,
        };

        setChatMessages(prev => [...prev, newMessage]);
        setMessageText('');
        setReplyingTo(null);
    };

    const handleForward = (targetChatIds: string[]) => {
        if (!forwardingMessage) return;

        const senderName = employees.find(e => e.id === forwardingMessage.senderId)?.name || 'Unknown';
        
        const forwardedMessages: ChatMessage[] = targetChatIds.map(targetId => ({
            ...forwardingMessage,
            id: `msg_${Date.now()}_${targetId}`,
            chatId: targetId,
            senderId: CURRENT_USER_ID,
            timestamp: new Date().toISOString(),
            status: 'sent',
            forwardedFrom: { name: senderName },
            replyToMessageId: undefined, // Don't carry over reply context
        }));
        
        setChatMessages(prev => [...prev, ...forwardedMessages]);
        setIsForwardModalOpen(false);
        setForwardingMessage(null);
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeChatId) return;
        
        const newAttachmentMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            chatId: activeChatId,
            senderId: CURRENT_USER_ID,
            text: '',
            timestamp: new Date().toISOString(),
            status: 'sent',
            attachment: {
                type: file.type.startsWith('image/') ? 'image' : 'file',
                url: URL.createObjectURL(file), // Local preview URL
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`
            }
        };
        setChatMessages(prev => [...prev, newAttachmentMessage]);
    };
    
    const EMOJIS = ['😀', '😂', '😍', '👍', '❤️', '🎉', '🚀', '🤔', '🙏', '🔥', '💯', '😊'];

    return (
        <div className="flex h-full bg-white dark:bg-gray-800">
            {isForwardModalOpen && <ForwardModal onClose={() => setIsForwardModalOpen(false)} onForward={handleForward} />}
            <input type="file" ref={attachmentInputRef} className="hidden" onChange={handleFileSelect} />
            
            {/* Sidebar with conversations */}
            <aside className="w-full md:w-1/3 xl:w-1/4 p-4 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 shrink-0">{t('messages')}</h2>
                <div className="relative mb-4 shrink-0">
                    <SearchIcon className="absolute top-1/2 left-3 rtl:left-auto rtl:right-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder={t('search_placeholder')} className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 ps-10 pe-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex-grow overflow-y-auto -mx-2 px-2">
                    {chatConversations.sort((a,b) => new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()).map((conv) => (
                        <div key={conv.id} onClick={() => setActiveChatId(conv.id)} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${conv.id === activeChatId ? 'bg-blue-100 dark:bg-blue-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}>
                            <div className="relative shrink-0">
                                <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full" />
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-gray-800 dark:text-white truncate">{conv.name}</h4>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{new Date(conv.lastMessageTimestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div className="flex justify-between items-start mt-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessageText}</p>
                                    {conv.unreadCount > 0 && <span className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0">{conv.unreadCount}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Chat Area */}
            {activeConversation ? (
                <main className="w-full md:w-2/3 xl:w-3/4 flex flex-col bg-gray-50 dark:bg-gray-900">
                    <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0 bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full" />
                            <div>
                                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{activeConversation.name}</h3>
                                <p className="text-sm text-green-500">Online</p>
                            </div>
                        </div>
                         <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><MoreVerticalIcon className="w-5 h-5"/></button>
                    </header>
                    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                        {activeChatMessages.map(msg => {
                           const sender = employees.find(e => e.id === msg.senderId);
                           return <ChatMessageBubble key={msg.id} message={msg} sender={sender} onReply={setReplyingTo} onForward={(msg) => { setForwardingMessage(msg); setIsForwardModalOpen(true); }} />
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                    <footer className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shrink-0 space-y-2">
                        {replyingTo && (
                             <div className="p-2 border-l-4 border-blue-500 bg-gray-100 dark:bg-gray-700 rounded-r-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-sm text-blue-600 dark:text-blue-400">{t('replying_to')} {employees.find(e=>e.id === replyingTo.senderId)?.name}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate max-w-md">{replyingTo.text}</p>
                                </div>
                                <button onClick={() => setReplyingTo(null)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                    <XIcon className="w-4 h-4 text-gray-500"/>
                                </button>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                             <div ref={emojiPickerRef} className="relative">
                                <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><SmileIcon className="w-6 h-6"/></button>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 p-2 grid grid-cols-6 gap-1">
                                        {EMOJIS.map(emoji => <button key={emoji} type="button" onClick={() => setMessageText(prev => prev + emoji)} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-xl">{emoji}</button>)}
                                    </div>
                                )}
                            </div>
                            <button type="button" onClick={() => attachmentInputRef.current?.click()} className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><PaperclipIcon className="w-6 h-6"/></button>
                            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder={t('type_a_message')} className="w-full bg-gray-100 dark:bg-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button type="button" className="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><MicIcon className="w-6 h-6"/></button>
                            <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"><SendIcon className="w-6 h-6"/></button>
                        </form>
                    </footer>
                </main>
            ) : (
                <div className="w-full md:w-2/3 xl:w-3/4 flex items-center justify-center text-gray-500">
                    Select a conversation to start messaging
                </div>
            )}
        </div>
    );
};

export default MessagesPage;
