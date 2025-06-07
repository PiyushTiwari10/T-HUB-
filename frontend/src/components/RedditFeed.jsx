import React, { useState, useEffect } from 'react';
import { FaReddit, FaArrowUp, FaComment, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RedditFeed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubreddit, setSelectedSubreddit] = useState('technology');

    const subreddits = [
        { id: 'technology', name: 'Technology' },
        { id: 'programming', name: 'Programming' },
        { id: 'webdev', name: 'Web Development' },
        { id: 'coding', name: 'Coding' },
        { id: 'technews', name: 'Tech News' }
    ];

    useEffect(() => {
        fetchPosts();
    }, [selectedSubreddit]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log(`Fetching posts from r/${selectedSubreddit}`);
            
            const response = await fetch(`http://localhost:5000/api/reddit/${selectedSubreddit}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`Received ${data.length} posts from r/${selectedSubreddit}`);
            setPosts(data);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-64"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <FaSpinner className="text-4xl text-blue-500" />
                </motion.div>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-6 bg-red-50 text-red-600 rounded-lg shadow-md"
            >
                <p className="font-medium text-lg mb-2">Error Loading Posts</p>
                <p className="text-sm mb-4">{error}</p>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchPosts}
                    className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                    Try Again
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-8"
            >
                <FaReddit className="text-3xl text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-800">Tech Feed</h2>
            </motion.div>

            {/* Subreddit Selector */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide"
            >
                {subreddits.map((subreddit, index) => (
                    <motion.button
                        key={subreddit.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSubreddit(subreddit.id)}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 ${
                            selectedSubreddit === subreddit.id
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md'
                        }`}
                    >
                        r/{subreddit.id}
                    </motion.button>
                ))}
            </motion.div>

            {/* Posts List */}
            <AnimatePresence mode="wait">
                <motion.div 
                    key={selectedSubreddit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                >
                    {posts.map((post, index) => (
                        <motion.div 
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        className="flex flex-col items-center bg-gray-50 p-2 rounded-lg"
                                    >
                                        <FaArrowUp className="text-blue-500" />
                                        <span className="text-sm font-medium text-gray-700">{post.ups}</span>
                                    </motion.div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                            <span className="font-medium">Posted by u/{post.author}</span>
                                            <span>•</span>
                                            <span>{formatDate(post.created_utc)}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-800 hover:text-blue-500 transition-colors">
                                            {post.title}
                                        </h3>
                                        {post.selftext && (
                                            <p className="text-gray-600 mb-4 line-clamp-3">
                                                {post.selftext}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-6 text-sm">
                                            <motion.a 
                                                whileHover={{ scale: 1.05 }}
                                                href={`https://reddit.com${post.permalink}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                                            >
                                                <FaComment />
                                                <span>{post.num_comments} comments</span>
                                            </motion.a>
                                            {post.url && !post.url.includes('reddit.com') && (
                                                <motion.a 
                                                    whileHover={{ scale: 1.05 }}
                                                    href={post.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                                                >
                                                    <FaExternalLinkAlt />
                                                    <span>View Link</span>
                                                </motion.a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default RedditFeed; 