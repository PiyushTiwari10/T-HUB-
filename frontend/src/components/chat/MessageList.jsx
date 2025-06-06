import React from 'react';
import Message from './Message';

const MessageList = ({ messages, currentUser, onEditMessage, onDeleteMessage, onReaction, onRemoveReaction }) => {
    console.log('MessageList received messages:', messages);
    console.log('MessageList received currentUser:', currentUser);

    if (!messages || messages.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500">
                No messages yet. Start the conversation!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {messages.map((message) => {
                console.log('Rendering message:', message);
                return (
                    <Message
                        key={message.id}
                        message={message}
                        isOwnMessage={message.user_id === currentUser.id}
                        onEdit={onEditMessage}
                        onDelete={onDeleteMessage}
                        onReaction={onReaction}
                        onRemoveReaction={onRemoveReaction}
                    />
                );
            })}
        </div>
    );
};

export default MessageList; 