import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './TechDetails.css';
import { FaArrowLeft, FaDownload, FaBook, FaLaptop, FaTools, FaCode, FaBug, FaLightbulb } from 'react-icons/fa';

const TechDetails = () => {
  const { id } = useParams();
  const [tech, setTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('installation');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTechDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/installations/${id}`);
        setTech(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch technology details');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTechDetails();
  }, [id]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading technology details...</p>
    </div>
  );
  
  if (error) return <div className="error-container"><div className="error">{error}</div></div>;
  if (!tech) return <div className="not-found">Technology not found</div>;

  return (
    <div className="tech-details-container">
      <div className="tech-details">
        <Link to="/" className="back-button">
          <FaArrowLeft /> Back to List
        </Link>
        
        <div className="tech-header">
          <div className="tech-header-content">
            <h1>{tech.name}</h1>
            <div className="tech-meta">
              <span className="tech-category">{tech.category}</span>
              <span className="tech-version">Version: {tech.version}</span>
            </div>
          </div>
          <div className="tech-image">
            {/* You can add a tech logo here based on tech.name or tech.category */}
            <div className="tech-icon">{tech.name.charAt(0)}</div>
          </div>
        </div>
        
        <div className="tech-description">
          <h2>Description</h2>
          <p>{tech.description}</p>
        </div>
        
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'installation' ? 'active' : ''}`}
              onClick={() => setActiveTab('installation')}
            >
              <FaTools /> Installation
            </button>
            <button 
              className={`tab ${activeTab === 'commands' ? 'active' : ''}`}
              onClick={() => setActiveTab('commands')}
            >
              <FaCode /> Commands
            </button>
            <button 
              className={`tab ${activeTab === 'troubleshooting' ? 'active' : ''}`}
              onClick={() => setActiveTab('troubleshooting')}
            >
              <FaBug /> Troubleshooting
            </button>
            <button 
              className={`tab ${activeTab === 'usecases' ? 'active' : ''}`}
              onClick={() => setActiveTab('usecases')}
            >
              <FaLightbulb /> Use Cases
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'installation' && (
              <div className="tab-pane fade-in">
                <h2>Installation Steps</h2>
                <div className="installation-steps">
                  {tech.installation_steps && tech.installation_steps.map((step, index) => (
                    <div key={index} className="step-card">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'commands' && (
              <div className="tab-pane fade-in">
                <h2>Common Commands</h2>
                <div className="commands-container">
                  <pre className="commands-block">
                    {tech.commands}
                  </pre>
                  <button 
                    className="copy-button" 
                    onClick={() => copyToClipboard(tech.commands)}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'troubleshooting' && (
              <div className="tab-pane fade-in">
                <h2>Troubleshooting</h2>
                <div className="accordion">
                  {tech.troubleshooting && tech.troubleshooting.map((item, index) => (
                    <details key={index} className="accordion-item">
                      <summary className="accordion-header">
                        <span className="issue-icon">⚠️</span> {item.issue}
                      </summary>
                      <div className="accordion-content">
                        <p>{item.solution}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'usecases' && (
              <div className="tab-pane fade-in">
                <h2>Use Cases</h2>
                <div className="use-cases-grid">
                  {tech.use_cases && tech.use_cases.map((useCase, index) => (
                    <div key={index} className="use-case-card">
                      <div className="use-case-number">{index + 1}</div>
                      <p>{useCase}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="tech-section platforms-section">
          <h2><FaLaptop /> Supported Platforms</h2>
          <div className="platforms-list">
            {tech.supported_platforms && tech.supported_platforms.map((platform, index) => (
              <span key={index} className="platform-badge">{platform}</span>
            ))}
          </div>
        </div>
        
        <div className="tech-links">
          <a href={tech.download_link} target="_blank" rel="noopener noreferrer" className="tech-link download-link">
            <FaDownload /> Download
          </a>
          <a href={tech.documentation_link} target="_blank" rel="noopener noreferrer" className="tech-link docs-link">
            <FaBook /> Documentation
          </a>
        </div>
      </div>
    </div>
  );
};

export default TechDetails;