import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { FaArrowLeft, FaDownload, FaBook, FaLaptop, FaTools, FaCode, FaBug, FaLightbulb, FaComments } from 'react-icons/fa';
import ChatRoom from './chat/ChatRoom';
import { useAuth } from '../context/AuthContext';

const TechDetails = () => {
  const params = useParams();
  const id = params?.id;
  const [tech, setTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('installation');
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    const fetchTechDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/installations/${id}`);
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

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-gray-600">
      <div className="w-12 h-12 border-4 border-t-[#3498db] border-gray-200 rounded-full animate-spin mb-4"></div>
      <p className="text-lg">Loading technology details...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </div>
  );

  if (!tech) return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-md" role="alert">
        Technology not found.
      </div>
    </div>
  );
  
  const tabButtonBaseClasses = "flex-1 py-4 px-2 border-none cursor-pointer font-medium text-gray-600 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-200";
  const tabButtonActiveClasses = "bg-white text-[#3498db] border-b-[3px] border-[#3498db]";

  return (
    <div className="bg-gray-50 min-h-screen p-5">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-[#3498db] no-underline font-medium transition-colors duration-300 hover:text-[#2980b9] text-base">
          <FaArrowLeft /> Back to List
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex-1 mb-4 md:mb-0">
            <h1 className="mb-2 text-[#2c3e50] text-4xl font-bold">{tech.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="bg-[#3498db] text-white px-4 py-1 rounded-full text-sm font-medium">{tech.category}</span>
              {tech.version && <span className="text-gray-500 text-sm font-medium">Version: {tech.version}</span>}
            </div>
          </div>
          <div className="w-24 h-24 flex items-center justify-center flex-shrink-0">
            <div className="w-20 h-20 bg-gradient-to-br from-[#3498db] to-[#2c3e50] text-white rounded-full flex items-center justify-center text-4xl font-bold">
              {tech.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        
        {tech.description && (
          <div className="mb-8">
            <h2 className="text-[#2c3e50] text-xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tech.description}</p>
          </div>
        )}
        
        <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row bg-gray-100 border-b border-gray-200">
            <button 
              className={`${tabButtonBaseClasses} ${activeTab === 'installation' ? tabButtonActiveClasses : 'bg-gray-100'} sm:rounded-tl-md`}
              onClick={() => setActiveTab('installation')}
            >
              <FaTools /> Installation
            </button>
            <button 
              className={`${tabButtonBaseClasses} ${activeTab === 'commands' ? tabButtonActiveClasses : 'bg-gray-100'}`}
              onClick={() => setActiveTab('commands')}
            >
              <FaCode /> Commands
            </button>
            <button 
              className={`${tabButtonBaseClasses} ${activeTab === 'troubleshooting' ? tabButtonActiveClasses : 'bg-gray-100'}`}
              onClick={() => setActiveTab('troubleshooting')}
            >
              <FaBug /> Troubleshooting
            </button>
            <button 
              className={`${tabButtonBaseClasses} ${activeTab === 'usecases' ? tabButtonActiveClasses : 'bg-gray-100'}`}
              onClick={() => setActiveTab('usecases')}
            >
              <FaLightbulb /> Use Cases
            </button>
            <button 
              className={`${tabButtonBaseClasses} ${activeTab === 'chat' ? tabButtonActiveClasses : 'bg-gray-100'} sm:rounded-tr-md`}
              onClick={() => setActiveTab('chat')}
            >
              <FaComments /> Community Chat
            </button>
          </div>
          
          <div className="p-6 bg-white min-h-[200px]">
            {activeTab === 'installation' && (
              <div>
                <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Installation Steps</h2>
                {tech.installation_steps && tech.installation_steps.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {tech.installation_steps.map((step, index) => (
                      <div key={index} className="flex items-start bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="bg-[#3498db] text-white p-4 flex items-center justify-center font-bold min-w-[50px] text-lg self-stretch">{index + 1}</div>
                        <div className="p-4 text-gray-700 flex-1 whitespace-pre-line">{step}</div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">No installation steps provided.</p>}
              </div>
            )}
            
            {activeTab === 'commands' && (
              <div>
                <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Common Commands</h2>
                {tech.commands ? (
                  <div className="relative">
                    <pre className="bg-[#2c3e50] text-gray-100 p-5 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
                      {tech.commands}
                    </pre>
                    <button 
                      className="absolute top-3 right-3 bg-white/20 text-white border-none rounded px-3 py-1.5 cursor-pointer transition-colors hover:bg-white/30 text-xs"
                      onClick={() => copyToClipboard(tech.commands)}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                ) : <p className="text-gray-500">No commands provided.</p>}
              </div>
            )}
            
            {activeTab === 'troubleshooting' && (
              <div>
                <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Troubleshooting</h2>
                {tech.troubleshooting && tech.troubleshooting.length > 0 ? (
                  <div className="space-y-3">
                    {tech.troubleshooting.map((item, index) => (
                      <details key={index} className="group border border-gray-200 rounded-lg overflow-hidden">
                        <summary className="py-3 px-4 bg-gray-50 cursor-pointer font-medium flex items-center gap-3 list-none group-hover:bg-gray-100 transition-colors">
                          <span className="text-yellow-500">⚠️</span> {item.issue}
                        </summary>
                        <div className="p-4 text-gray-700 bg-white border-t border-gray-200 whitespace-pre-line">
                          <p>{item.solution}</p>
                        </div>
                      </details>
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
                      <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-3">
                        <div className="bg-[#3498db] text-white rounded-full w-7 h-7 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">{index + 1}</div>
                        <p className="text-gray-700 flex-1 whitespace-pre-line">{useCase}</p>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-gray-500">No use cases provided.</p>}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="h-[600px] flex flex-col">
                {user ? (
                  <div className="flex-1 flex flex-col">
                    <ChatRoom 
                      roomId={id} 
                      currentUser={{
                        id: user.id,
                        username: user.user_metadata?.full_name || user.email
                      }} 
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <FaComments className="text-4xl text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Join the Community Chat</h3>
                    <p className="text-gray-500 mb-4">Sign in to participate in the community discussion about {tech.name}</p>
                    <Link 
                      href="/login" 
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-white font-medium no-underline transition-all duration-300 bg-[#3498db] hover:bg-[#2980b9]"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {tech.supported_platforms && tech.supported_platforms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-3 flex items-center gap-2"><FaLaptop /> Supported Platforms</h2>
            <div className="flex flex-wrap gap-2">
              {tech.supported_platforms.map((platform, index) => (
                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors cursor-default">{platform}</span>
              ))}
            </div>
          </div>
        )}
        
        {(tech.download_link || tech.documentation_link) && (
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
            {tech.download_link && (
              <a href={tech.download_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-white font-medium no-underline transition-all duration-300 bg-[#3498db] hover:bg-[#2980b9] flex-1">
                <FaDownload /> Download
              </a>
            )}
            {tech.documentation_link && (
              <a href={tech.documentation_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg text-white font-medium no-underline transition-all duration-300 bg-[#2c3e50] hover:bg-slate-800 flex-1">
                <FaBook /> Documentation
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechDetails;