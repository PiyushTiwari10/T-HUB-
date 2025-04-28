import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Tech Hub</h1>
        <div className="about-divider"></div>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Tech Hub aims to simplify the technology landscape by providing comprehensive guides
            and resources for developers of all skill levels. We believe that technology should be
            accessible to everyone, and our platform is designed to help you navigate the complex
            world of tech stacks with ease.
          </p>
        </section>
        
        <section className="about-section">
          <h2>What We Offer</h2>
          <ul className="features-list">
            <li>
              <span className="feature-icon">📚</span>
              <div>
                <h3>Comprehensive Guides</h3>
                <p>Detailed installation and usage instructions for various technologies</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">🔍</span>
              <div>
                <h3>Technology Comparison</h3>
                <p>Side-by-side comparisons to help you choose the right tools</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">💡</span>
              <div>
                <h3>Troubleshooting Tips</h3>
                <p>Solutions to common issues you might encounter</p>
              </div>
            </li>
            <li>
              <span className="feature-icon">🚀</span>
              <div>
                <h3>Best Practices</h3>
                <p>Industry-standard approaches to technology implementation</p>
              </div>
            </li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2>Our Team</h2>
          <p>
            Tech Hub is maintained by a team of passionate developers and technology enthusiasts
            who are committed to sharing knowledge and helping others succeed in their tech journey.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;