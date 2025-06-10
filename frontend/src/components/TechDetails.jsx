import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaBook, FaLaptop, FaTools, FaCode, FaBug, FaLightbulb, FaComments, FaChevronLeft, FaPlus } from 'react-icons/fa';
import ChatRoom from './chat/ChatRoom';
import ChatRoomList from './chat/ChatRoomList';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

const TechDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [tech, setTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('installation');
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchTechDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/installations/${id}`);
        setTech(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch technology details');
        console.error(err);
        setTech(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTechDetails();
  }, [id]);

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    const loadingMessages = [
      "Loading technology details...",
      "Gathering installation guides...",
      "Preparing documentation...",
      "Analyzing supported platforms...",
      "Almost there, tech explorer!",
      "Fetching tech specifications..."
    ];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-gray-600"
      >
        <motion.div 
          className="relative w-32 h-32"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-t-[#3498db] border-r-[#2c3e50] border-b-[#3498db] border-l-[#2c3e50] rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-t-[#3498db] border-r-[#2c3e50] border-b-[#3498db] border-l-[#2c3e50] rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-4 border-4 border-t-[#3498db] border-r-[#2c3e50] border-b-[#3498db] border-l-[#2c3e50] rounded-full animate-spin" />
          <div className="absolute inset-6 border-4 border-t-[#3498db] border-r-[#2c3e50] border-b-[#3498db] border-l-[#2c3e50] rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
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
      className="flex justify-center items-center min-h-[calc(100vh-200px)]"
    >
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </motion.div>
  );

  if (!tech) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center min-h-[calc(100vh-200px)]"
    >
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-md" role="alert">
        Technology not found.
      </div>
    </motion.div>
  );
  
  const tabButtonBaseClasses = "flex-1 py-4 px-2 border-none cursor-pointer font-medium text-gray-600 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-200";
  const tabButtonActiveClasses = "bg-white text-[#3498db] border-b-[3px] border-[#3498db]";

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-gray-50 min-h-screen p-5"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-[#3498db] no-underline font-medium transition-colors duration-300 hover:text-[#2980b9] text-base">
            <FaArrowLeft /> Back to List
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200"
        >
          <div className="flex-1 mb-4 md:mb-0">
            <h1 className="mb-2 text-[#2c3e50] text-4xl font-bold">{tech.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="bg-[#3498db] text-white px-4 py-1 rounded-full text-sm font-medium"
              >
                {tech.category}
              </motion.span>
              {tech.version && (
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-500 text-sm font-medium"
                >
                  Version: {tech.version}
                </motion.span>
              )}
            </div>
          </div>
          <motion.div 
            className="w-24 h-24 flex items-center justify-center flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#3498db] to-[#2c3e50] text-white rounded-full flex items-center justify-center text-4xl font-bold">
              {tech.name?.charAt(0).toUpperCase()}
            </div>
          </motion.div>
        </motion.div>
        
        {tech.description && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-[#2c3e50] text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tech.description}</p>
          </motion.div>
        )}
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8 border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row bg-gray-100 border-b border-gray-200">
            {[
              { id: 'installation', icon: <FaTools />, label: 'Installation' },
              { id: 'commands', icon: <FaCode />, label: 'Commands' },
              { id: 'troubleshooting', icon: <FaBug />, label: 'Troubleshooting' },
              { id: 'usecases', icon: <FaLightbulb />, label: 'Use Cases' },
              { id: 'chat', icon: <FaComments />, label: 'Community Chat' }
            ].map((tab, index) => (
              <motion.button 
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`${tabButtonBaseClasses} ${activeTab === tab.id ? tabButtonActiveClasses : 'bg-gray-100'} ${index === 0 ? 'sm:rounded-tl-md' : ''} ${index === 4 ? 'sm:rounded-tr-md' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon} {tab.label}
              </motion.button>
            ))}
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="p-6 bg-white min-h-[200px]"
            >
              {activeTab === 'installation' && (
                <div>
                  <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Installation Steps</h2>
                  {tech.installation_steps && tech.installation_steps.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {tech.installation_steps.map((step, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          <motion.div 
                            className="bg-[#3498db] text-white p-4 flex items-center justify-center font-bold min-w-[50px] text-lg self-stretch"
                            whileHover={{ scale: 1.05 }}
                          >
                            {index + 1}
                          </motion.div>
                          <div className="p-4 text-gray-700 flex-1 whitespace-pre-line">{step}</div>
                        </motion.div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500">No installation steps provided.</p>}
                </div>
              )}
              
              {activeTab === 'commands' && (
                <div>
                  <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Common Commands</h2>
                  {tech.commands ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative"
                    >
                      <pre className="bg-[#2c3e50] text-gray-100 p-5 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
                        {tech.commands}
                      </pre>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute top-3 right-3 bg-white/20 text-white border-none rounded px-3 py-1.5 cursor-pointer transition-colors hover:bg-white/30 text-xs"
                        onClick={() => copyToClipboard(tech.commands)}
                      >
                        {copied ? 'Copied!' : 'Copy'}
                      </motion.button>
                    </motion.div>
                  ) : <p className="text-gray-500">No commands provided.</p>}
                </div>
              )}
              
              {activeTab === 'troubleshooting' && (
                <div>
                  <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Troubleshooting</h2>
                  {tech.troubleshooting && tech.troubleshooting.length > 0 ? (
                    <div className="space-y-3">
                      {tech.troubleshooting.map((item, index) => (
                        <motion.details 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <summary className="py-3 px-4 bg-gray-50 cursor-pointer font-medium flex items-center gap-3 list-none group-hover:bg-gray-100 transition-colors">
                            <span className="text-yellow-500">⚠️</span> {item.issue}
                          </summary>
                          <div className="p-4 text-gray-700 bg-white border-t border-gray-200 whitespace-pre-line">
                            <p>{item.solution}</p>
                          </div>
                        </motion.details>
                      ))}
                    </div>
                  ) : <p className="text-gray-500">No troubleshooting tips provided.</p>}
                </div>
              )}
              
              {activeTab === 'usecases' && (
                <div>
                  <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Use Cases</h2>
                  {tech.use_cases && tech.use_cases.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tech.use_cases.map((useCase, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-3"
                        >
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className="bg-[#3498db] text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1"
                          >
                            {index + 1}
                          </motion.div>
                          <p className="text-gray-700 flex-1 whitespace-pre-line">{useCase}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : <p className="text-gray-500">No use cases provided.</p>}
                </div>
              )}

              {activeTab === 'chat' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 bg-white"
                >
                  {user ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#3498db] to-[#2c3e50] text-white">
                        <div className="flex items-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => selectedRoom ? setSelectedRoom(null) : setActiveTab('installation')}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors mr-3"
                            title={selectedRoom ? "Back to Chat Rooms" : "Go Back"}
                          >
                            <FaChevronLeft className="w-5 h-5" />
                          </motion.button>
                          <h2 className="text-lg font-semibold">
                            {selectedRoom ? selectedRoom.name : "Chat Rooms"}
                          </h2>
                        </div>
                        {!selectedRoom && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowCreateModal(true)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            title="Create New Room"
                          >
                            <FaPlus className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                      <div className="flex-1">
                        {selectedRoom ? (
                          <ChatRoom 
                            roomId={selectedRoom.id} 
                            currentUser={{
                              id: user.id,
                              username: user.user_metadata?.full_name || user.email,
                              email: user.email
                            }}
                            onBack={() => setSelectedRoom(null)}
                            hideHeader={true}
                          />
                        ) : (
                          <ChatRoomList
                            onSelectRoom={(room) => setSelectedRoom(room)}
                            currentUser={{
                              id: user.id,
                              username: user.user_metadata?.full_name || user.email
                            }}
                            techId={id}
                            hideHeader={true}
                            showCreateModal={showCreateModal}
                            setShowCreateModal={setShowCreateModal}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center h-full text-center p-8"
                    >
                      <p className="text-lg font-medium text-gray-800 mb-2">Sign in to join the chat</p>
                      <p className="text-gray-600">Create and join chat rooms to discuss this technology with others.</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {tech.supported_platforms && tech.supported_platforms.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-3 flex items-center gap-2">
              <FaLaptop /> Supported Platforms
            </h2>
            <div className="flex flex-wrap gap-2">
              {tech.supported_platforms.map((platform, index) => (
                <motion.span 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors cursor-default"
                >
                  {platform}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
        
        {(tech.download_link || tech.documentation_link) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            {tech.download_link && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={tech.download_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg text-white font-medium no-underline transition-all duration-300 bg-[#3498db] hover:bg-[#2980b9]"
              >
                <FaDownload /> Download
              </motion.a>
            )}
            {tech.documentation_link && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={tech.documentation_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg text-white font-medium no-underline transition-all duration-300 bg-[#2c3e50] hover:bg-[#1a252f]"
              >
                <FaBook /> Documentation
              </motion.a>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TechDetails;