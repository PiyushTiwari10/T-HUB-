import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaUsers, FaTimes, FaSearch } from 'react-icons/fa';

const ChatRoomList = ({ onSelectRoom, currentUser, techId }) => {
    const [rooms, setRooms] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newRoom, setNewRoom] = useState({
        name: '',
        description: '',
        technology_id: techId
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, [techId, searchQuery]); // Refetch when techId or searchQuery changes

    const fetchRooms = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/chat/rooms/tech/${techId}${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`);
            if (!response.ok) {
                throw new Error('Failed to fetch chat rooms');
            }
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
            setError('Failed to load chat rooms');
        }
    };

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/chat/rooms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRoom),
            });

            if (!response.ok) {
                throw new Error('Failed to create chat room');
            }

            const createdRoom = await response.json();
            setRooms(prev => [createdRoom, ...prev]);
            setShowCreateModal(false);
            setNewRoom({ name: '', description: '', technology_id: techId });
        } catch (error) {
            console.error('Error creating chat room:', error);
            setError('Failed to create chat room');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#3498db] to-[#2c3e50] text-white">
                <h2 className="text-lg font-semibold">Chat Rooms</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreateModal(true)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <FaPlus className="w-5 h-5" />
                </motion.button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by room ID or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto p-4">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
                        {error}
                    </div>
                )}

                {rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="text-lg font-medium mb-2">No chat rooms found</p>
                        <p className="text-sm text-gray-400">
                            {searchQuery ? 'Try a different search term' : 'Create a new room to start chatting!'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rooms.map(room => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => onSelectRoom(room)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-800">{room.name}</h3>
                                        <p className="text-sm text-gray-500 font-mono">ID: {room.room_id}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <FaUsers className="w-4 h-4" />
                                        <span className="text-sm">{room.active_users || 0}</span>
                                    </div>
                                </div>
                                {room.description && (
                                    <p className="mt-1 text-sm text-gray-600">{room.description}</p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Room Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50 p-6"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Create New Chat Room</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <FaTimes className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateRoom} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Room Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={newRoom.name}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description (optional)
                                    </label>
                                    <textarea
                                        id="description"
                                        value={newRoom.description}
                                        onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
                                    >
                                        Create Room
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatRoomList; 