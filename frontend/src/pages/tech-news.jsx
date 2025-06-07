import React from 'react';
import RedditFeed from '../components/RedditFeed';
import { motion } from 'framer-motion';
import { FaNewspaper, FaRocket } from 'react-icons/fa';

const TechNewsPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto py-12 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-4"
                    >
                        <FaNewspaper className="text-4xl text-blue-500" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Tech News & Updates</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Stay up to date with the latest technology news, programming trends, and development updates from across the web.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <RedditFeed />
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-12 text-center"
                >
                    <a 
                        href="https://www.reddit.com/r/technology/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                    >
                        <FaRocket />
                        <span>Explore More on Reddit</span>
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default TechNewsPage; 