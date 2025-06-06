import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

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
        const response = await axios.get('http://localhost:5000/api/installations');
        setTechnologies(response.data);
        const uniqueCategories = ['All', ...new Set(response.data.map(tech => tech.category).filter(Boolean))];
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        setError('Failed to fetch technologies');
        console.error(err);
        setTechnologies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  const filteredTechnologies = selectedCategory === 'All' 
    ? technologies 
    : technologies.filter(tech => tech.category === selectedCategory);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-gray-600">
      <div className="w-12 h-12 border-4 border-t-[#3498db] border-gray-200 rounded-full animate-spin mb-4"></div>
      <p className="text-lg">Loading technologies...</p>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-5">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center" role="alert">
        <strong className="font-bold text-lg block">Error!</strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  return (
    <div className="p-5 md:p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Tech Stack Installation Guides</h1>
      
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <label htmlFor="category-filter" className="text-gray-700 font-medium">Filter by Category: </label>
        <select 
          id="category-filter"
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="py-2.5 px-4 rounded-md border border-gray-300 shadow-sm focus:border-[#3498db] focus:ring focus:ring-[#3498db]/30 focus:ring-opacity-50 bg-white min-w-[200px]"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      {filteredTechnologies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTechnologies.map(tech => (
            <Link href={`/tech/${tech.id}`} key={tech.id} className="group block bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-2xl no-underline text-gray-800 border border-transparent hover:border-[#3498db]">
              <h2 className="text-xl font-semibold text-slate-700 mb-2 group-hover:text-[#3498db] transition-colors">{tech.name}</h2>
              {tech.category && 
                <div className="inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium mb-3 group-hover:bg-[#3498db]/20 group-hover:text-[#3498db] transition-colors">{tech.category}</div>
              }
              {tech.version && 
                <div className="text-sm text-gray-500 mb-3">Version: {tech.version}</div>
              }
              {tech.description &&
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{tech.description}</p>
              }
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p className="text-xl mb-2">No technologies found for "{selectedCategory}".</p>
          {selectedCategory !== 'All' && 
            <button onClick={() => setSelectedCategory('All')} className="text-[#3498db] hover:underline">
              Show all technologies
            </button>
          }
        </div>
      )}
    </div>
  );
};

export default TechList;