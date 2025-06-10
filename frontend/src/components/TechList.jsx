import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../context/SearchContext';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { API_URL } from '../config';

const TechList = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        console.log('Fetching technologies from:', `${API_URL}/api/installations`);
        const response = await axios.get(`${API_URL}/api/installations`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        console.log('Response received:', response.data);
        setTechnologies(response.data);
        const uniqueCategories = ['All', ...new Set(response.data.map(tech => tech.category).filter(Boolean))];
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        setError(`Failed to fetch technologies: ${err.message}`);
        setTechnologies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  const filteredTechnologies = technologies.filter(tech => {
    const matchesCategory = selectedCategory === 'All' || tech.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tech.category && tech.category.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  if (loading) {
    const loadingMessages = [
      "Fetching the latest tech stacks...",
      "Analyzing technology trends...",
      "Preparing installation guides...",
      "Loading development tools...",
      "Almost there, tech enthusiasts!",
      "Gathering tech insights..."
    ];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-gray-600"
      >
        <motion.div 
          className="relative w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-t-[#3498db] border-r-[#2c3e50] border-b-[#3498db] border-l-[#2c3e50] rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-t-[#3498db] border-r-[#2c3e50] border-b-[#3498db] border-l-[#2c3e50] rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-4 border-4 border-t-[#3498db] border-r-[#2c3e50] border-b-[#3498db] border-l-[#2c3e50] rounded-full animate-spin" />
        </motion.div>
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.p 
            className="text-xl font-semibold text-[#2c3e50] mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
          </motion.p>
          <motion.div 
            className="flex justify-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="w-2 h-2 bg-[#3498db] rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div 
              className="w-2 h-2 bg-[#3498db] rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="w-2 h-2 bg-[#3498db] rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center min-h-[calc(100vh-200px)] p-5"
    >
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center" role="alert">
        <strong className="font-bold text-lg block">Error!</strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full overflow-x-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl sm:text-4xl font-bold text-slate-800 mb-8 text-center bg-gradient-to-r from-[#3498db] to-[#2c3e50] bg-clip-text text-transparent"
        >
          Tech Stack Installation Guides
        </motion.h1>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="w-full sm:w-auto flex items-center gap-2 bg-white p-2 rounded-lg shadow-md">
            <FaFilter className="text-[#3498db]" />
            <label htmlFor="category-filter" className="text-gray-700 font-medium whitespace-nowrap">Filter by Category: </label>
            <select 
              id="category-filter"
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-4 rounded-md border border-gray-300 shadow-sm focus:border-[#3498db] focus:ring focus:ring-[#3498db]/30 focus:ring-opacity-50 bg-white w-full sm:w-auto min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </motion.div>
        
        <AnimatePresence mode="wait">
          {filteredTechnologies.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            >
              {filteredTechnologies.map(tech => (
                <motion.div
                  key={tech.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    href={`/tech/${tech.id}`} 
                    className="group block bg-white rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 ease-in-out hover:shadow-2xl no-underline text-gray-800 border border-transparent hover:border-[#3498db] relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#3498db]/5 to-[#2c3e50]/5 opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={false}
                      animate={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2 group-hover:text-[#3498db] transition-colors">{tech.name}</h2>
                    {tech.category && (
                      <motion.div 
                        className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium mb-3 group-hover:bg-[#3498db]/20 group-hover:text-[#3498db] transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {tech.category}
                      </motion.div>
                    )}
                    {tech.version && (
                      <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#3498db] rounded-full" />
                        Version: {tech.version}
                      </div>
                    )}
                    {tech.description && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{tech.description}</p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-500 py-10"
            >
              <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-lg sm:text-xl mb-2">
                {searchQuery 
                  ? `No technologies found matching "${searchQuery}"${selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}.`
                  : `No technologies found for "${selectedCategory}".`
                }
              </p>
              {(selectedCategory !== 'All' || searchQuery) && (
                <motion.button 
                  onClick={() => setSelectedCategory('All')} 
                  className="text-[#3498db] hover:underline mt-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Show all technologies
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TechList;