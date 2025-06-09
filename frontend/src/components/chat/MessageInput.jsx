import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaSmile } from 'react-icons/fa';

const MessageInput = ({ onSendMessage, onTyping, onStopTyping }) => {
    const [message, setMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isComposing, setIsComposing] = useState(false);
    const typingTimeoutRef = useRef(null);
    const textareaRef = useRef(null);
    const formRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isComposing) {
            onSendMessage(message);
            setMessage('');
            onStopTyping();
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
            // Focus back on textarea after sending
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 0);
        }
    };

    const handleChange = (e) => {
        const newMessage = e.target.value;
        setMessage(newMessage);
        
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set new timeout
        onTyping();
        typingTimeoutRef.current = setTimeout(() => {
            onStopTyping();
        }, 2000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    return (
        <motion.form 
            ref={formRef}
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="border-t border-gray-200 p-2 md:p-4 bg-white"
        >
            <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Type a message..."
                        rows={1}
                        className={`w-full resize-none rounded-lg border ${
                            isFocused ? 'border-blue-500' : 'border-gray-300'
                        } p-2 md:p-3 pr-10 md:pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base`}
                        style={{ 
                            minHeight: '40px', 
                            maxHeight: '120px',
                            paddingRight: '2.5rem'
                        }}
                    />
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute right-2 bottom-2 p-1.5 md:p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FaSmile className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.button>
                </div>
                <motion.button
                    type="submit"
                    disabled={!message.trim() || isComposing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2.5 md:p-3 rounded-lg font-medium flex items-center justify-center ${
                        message.trim() && !isComposing
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    } transition-colors duration-200`}
                >
                    <FaPaperPlane className="w-4 h-4 md:w-5 md:h-5" />
                </motion.button>
            </div>
        </motion.form>
    );
};

export default MessageInput; 