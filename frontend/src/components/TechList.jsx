import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TechList.css';

const TechList = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://t-hub-inrp.onrender.com/api/installations');
        setTechnologies(response.data);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(response.data.map(tech => tech.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch technologies');
        setLoading(false);
        console.error(err);
      }
    };

    fetchTechnologies();
  }, []);

  // Filter technologies by selected category
  const filteredTechnologies = selectedCategory === 'All' 
    ? technologies 
    : technologies.filter(tech => tech.category === selectedCategory);

  if (loading) return <div className="loading">Loading technologies...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tech-list-container">
      <h1>Tech Stack Installation Guides</h1>
      
      <div className="category-filter">
        <label>Filter by Category: </label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      <div className="tech-grid">
        {filteredTechnologies.map(tech => (
          <Link to={`/tech/${tech.id}`} key={tech.id} className="tech-card">
            <h2>{tech.name}</h2>
            <div className="tech-category">{tech.category}</div>
            <div className="tech-version">v{tech.version}</div>
            <p className="tech-description">{tech.description.substring(0, 100)}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TechList;