import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TechList from './components/TechList';
import TechDetails from './components/TechDetails';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<TechList />} />
            <Route path="/tech/:id" element={<TechDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;